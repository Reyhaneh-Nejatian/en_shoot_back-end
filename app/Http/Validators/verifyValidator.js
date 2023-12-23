const {check} = require('express-validator');

class verifyValidator{
    handle(){
        return[
            check('code')
                .isLength({min : 5})
                .withMessage('enter your code'),
        ]
    }
}


module.exports = new verifyValidator();