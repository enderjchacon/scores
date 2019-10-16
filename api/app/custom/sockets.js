const mlb   = require('./../controllers/mlb');
const lvbp   = require('./../controllers/lvbp');
class sockets{

    refreshGames (io){
        io.on('connect', onConnect);
        function onConnect(socket) {
            console.log('socket connect')
            socket.on('setDataMlb', function(data) {
                
                var setIntervalData = setInterval(function () {
                    let league = data.league;
                    var response = [];
                    if(league=='LVBP'){
                        response =  lvbp.getGamesSocket(data.date);
                    }else{
                        response =  mlb.getGamesSocket(data.date);
                    }

                    console.log('client ID: ', socket.id,'league:',league); 
                    socket.emit('refresh_mlb', response);
                    
                }, data.interval);

                socket.on('disconnect', function () {
                    console.log('socket connect');
                    clearInterval(setIntervalData);
                });
            }); 
        };
        
    }
}

module.exports  = new sockets();