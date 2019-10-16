
const DB        = require('./../database');
const validator = require('./../custom/validator');
const socketsLog= require('./../custom/sockets');

class mlb{

    constructor(){
        this.response = [];
    }
    
    getGames(req,res){

        let {date} = req.query;

        validator.check([ 
            [1000, date],
            [1001, validator.date(date)]
        ]);
        
        if(validator.errors===true){
            DB.Mlb.findAll({

                where:{
                    Fecha:req.query.date
                },
            }).then(response => {
                if(!response.length){
                    response = {"code":"500","message":"Not Found Results"}
                }
                res.json(response);
            });
        }else{
            res.status(validator.errors.http.code).json(validator.errors.response);
        }
        
    }

    getGamesSocket(date){

        validator.check([ 
            [1000, date],
            [1001, validator.date(date)]
        ]);
        
        if(validator.errors===true){
            DB.Mlb.findAll({

                where:{
                    Fecha:date
                },
            }).then(response => {
                if(!response.length){
                    response = {"code":"500","message":"Not Found Results"}
                }
                this.response = response; 

                
            });
        }else{
            this.response = validator.errors.response;
        }
       return this.response;
    }

    refreshGames (req,res){


        var socketio = req.app.get('socketIo');
        socketio.on('connect', onConnect);    
        function onConnect(socket) {
           // socket.on('setDataMlb', function(data) {
                
                var setIntervalData = setInterval(function () {

                    //var response =  getGamesSocket('2018-10-03');
                    console.log('client:', socket.id); 
                    DB.Mlb.findAll({

                        where:{
                            Fecha:'2018-10-03'
                        },
                    }).then(response => {
                        if(!response.length){
                            response = {"code":"500","message":"Not Found Results"}
                        }
                        socket.broadcast.emit('refresh_mlb', response);
                    });
                        
                    
                },30000); 

                socket.on('disconnect', function () {
                    console.log('disconect');
                    clearInterval(setIntervalData);
                });
           // }); 
        };
        res.json({'start':'refresh'})
    }

    getGamesMlb(req,res){
        var socketio = req.app.get('socketio');
        socketio.on('connection', function (socket) {
            console.log('socket connect')
            socket.on('setDataMlb', function(data) {
                var {date} = data;
                validator.check([ 
                    [1000, date],
                    [1001, validator.date(date)]
                ]);

                if(validator.errors===true){
                    DB.Mlb.findAll({
                        limit: 10,
                        where:{
                            Fecha:date
                        },
                        order: [
                            ['Hora', 'ASC']
                        ]
                    }).then(response => {
                        if(!response.length){
                            response = {"code":"500","message":"Not Found Results"}
                        }

                        socket.emit('dataMlb', response);
                        res.json(response);
                    });
                }else{
                    res.status(validator.errors.http.code).json(validator.errors.response);
                }  
            });
        
        });
    }       
}

module.exports  = new mlb();