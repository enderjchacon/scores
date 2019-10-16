module.exports = function(app) {
    
    
    const mlb   = require('./controllers/mlb');
    const lvbp   = require('./controllers/lvbp');
    
    app.get('/api/mlb/getGames',mlb.getGames)
    app.get('/api/lvbp/getGames',lvbp.getGames)
   // app.get('/api/mlb/refreshGame',mlb.refreshGames)
}