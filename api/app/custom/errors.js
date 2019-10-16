let fs = require('fs');

class errors
{  
    get(code)
    {
        let errors = JSON.parse(
                fs.readFileSync('./app/assets/json/errors.json', 'utf-8')
            );
        
        return (errors[code])?errors[code]:false;
    }

}

module.exports = new errors();