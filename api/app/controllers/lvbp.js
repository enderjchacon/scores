
const DB        = require('./../database');
const validator = require('./../custom/validator');
//const socketsLog= require('./../custom/sockets');

class lvbp{
    
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
            DB.LVBP.findAll({

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
            DB.LVBP.findAll({

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

        let {date} = req.query;
        //let statedDataToday = socketsLog.manageEmits(date);
        //if(statedDataToday){
            var socketio = req.app.get('socketio');
            socketio.on('connection', function (socket) {
                socket.on('setDataMlb', function(data) {
                    
                    var setIntervalData = setInterval(function () {

                        DB.LVBP.findAll({
                            where:{
                                Fecha:data.date
                            }
                        }).then(response => {
                            if(!response.length){
                                response = {"code":"500","message":"Not Found Results"}
                            }
                            console.log('socket refresh_mlb emit');
                            socket.emit('refresh_mlb', response);
                        });
                        
                    }, data.interval);

                    socket.on('disconnect', function () {
                        console.log('disconect');
                        clearInterval(setIntervalData);
                    });
                });
                
            });
        //}
        
        res.json({'start':'refresh','dateLive':date})
    }      
}

module.exports  = new lvbp();