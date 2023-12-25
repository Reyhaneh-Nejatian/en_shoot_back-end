const {check} = require('express-validator');
const validator = require('validator');
const User = require('./../../Models/User');

class loginValidator{
    handle(){
        return[
            // check('userName')
            //     .isLength({min : 5})
            //     .withMessage('enter your userName'),
            
            check('phoneNumber')
                .custom(async (value) => {
                  // اعتبارسنجی بر اساس اینکه مقدار یک شماره تلفن باشد
                    if(!value)
                    {
                        throw new Error('No phone number entered.');
                    }else if(value && !validator.isMobilePhone(value, 'any', { strictMode: false }))
                    {
                        throw new Error('The phone number is not valid.');
                    }
                    return true;
                }),

            check('password')
                .isLength({min : 6})
                .withMessage('Entered password is less than 6 characters'),
        ]
    }
}


module.exports = new loginValidator();