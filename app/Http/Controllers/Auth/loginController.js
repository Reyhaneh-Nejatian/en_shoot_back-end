const express = require('express');
const passport = require('passport');
const controller = require('./../controller');
const { promisify } = require('util');
const verify = require('./../../../../service/verifyPhoneNumber')


class loginController extends controller{

    showForm(req, res, next){
        res.status(200).json({message : 'show form login'})
    }

    async loginProcess(req, res, next){
        const result = await this.validationForm(req, res);
        if(result.success){
            this.login(req, res, next);
        }else{
            return res.status(400).json({success : false, errors : result.errors});
        }
    }

    async login(req, res, next) {
        try{

            const authenticateCallback = async (err, user, info) => {
                if (!user) {
                    return res.status(400).json({ success: false, message: 'Authentication failed' });
                }

                if (!user.isVerified) {
                    try {
                      const otpId = await verify.sendCode(user.phoneNumber);
                      const status = await verify.getStatus(otpId);
                      if (status.status == 'operatorDelivered') {
                        return res.status(200).json({ message: 'Code resent successfully', status });
                      } else {
                        return res.status(400).json({ message: 'Failed to send verification code', status });
                      }
              
                    } catch (error) {
                      return res.status(500).json({ error: 'Internal server error' });
                    }
                  }

                req.login(user, (err)=>{
                    if(err){
                        return res.status(500).json({success : false, message : 'Internal server error'})
                    }
                })

                return res.status(200).json({success : true, message : 'Authentication successful', user})
    
    
            }

            passport.authenticate('local.login', authenticateCallback)(req, res, next);

              

        }catch(err){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}


module.exports = new loginController();