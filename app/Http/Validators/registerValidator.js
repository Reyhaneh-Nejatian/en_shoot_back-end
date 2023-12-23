const {check} = require('express-validator');
const validator = require('validator');
const User = require('./../../Models/User');

class registerValidator{
    handle(){
        return[
            check('firstName')
                .isLength({min : 5})
                .withMessage('enter your firstName'),

            check('lastName')
                .isLength({min : 5})
                .withMessage('enter your lastName'),

            check('age')
                .isInt({ max: 99 }) // حداکثر 99 سال
                .withMessage('Entered age is not valid'),
        

            check('userName')
                .isLength({min : 5})
                .withMessage('enter your userName'),
            
            check('phoneNumber')
                .custom(async (value) => {
                  // اعتبارسنجی بر اساس اینکه مقدار یک شماره تلفن باشد
                    if(!value)
                    {
                        throw new Error('No phone number entered.');
                    }else if(value && !validator.isMobilePhone(value, 'any', { strictMode: false }))
                    {
                        throw new Error('The phone number is not valid.');
                    }else {
                        // بررسی یکتا بودن شماره تلفن
                        const existingUser = await User.findOne({ phoneNumber: value });
                        if (existingUser) {
                            throw new Error('Phone number already exists.');
                        }
                    }
        
                    return true;
                }),

            check('password')
                .isLength({min : 6})
                .withMessage('Entered password is less than 6 characters'),
        ]
    }
}


module.exports = new registerValidator();