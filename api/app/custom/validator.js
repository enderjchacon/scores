let errors = require('./errors');

class validator
{  
    constructor(){
        this.errors = true;
    }

    check(arrCheck)
    {
        this.errors = true
        for (var [code, value] of arrCheck) {
            
            if(!value){
                return this.errors = errors.get(code);
            }
        }
    }

    date(dateString) 
    {
        var regEx = /^\d{4}-\d{2}-\d{2}$/;

        return (dateString)?dateString.match(regEx) != null:false;  
    }
}

module.exports = new validator();