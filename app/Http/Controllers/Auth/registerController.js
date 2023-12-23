const express = require('express');
const passport = require('passport');
const controller = require('../controller');


class registerController extends controller{

    showForm(req, res, next){
        res.status(200).json({message : 'show form register'})
    }

    async registerProcess(req, res, next){
        const result = await this.validationForm(req, res);
        if (result.success) {
            this.register(req, res, next);
        }else{
            return res.status(400).json({ success: false, errors: result.errors });
        }
    }


    async register(req, res, next) {

        try {
            const authenticateCallback = async (err, user, info) => {
                if (err) { return next(err); }
                if (!user) {
                    return res.status(400).json({ message: info.message });
                }
                const status = user.status;
                const phoneNumber = user.phoneNumber;             
                return res.status(200).json({ message: 'The code has been sent to you successfully', phoneNumber, status });
            };
    
            await passport.authenticate('local.register', authenticateCallback)(req, res, next);
        } catch (err) {
            console.error('Error during registration:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        
    }
    
}

module.exports = new registerController();