const controller = require('../controller');
const verify = require('./../../../../service/verifyPhoneNumber')

class verifyController  extends controller {
    showForm(req, res ){
        res.status(200).json({message : 'show form verify code'})
    }

    async verifyProcess(req, res, next){
        const result = await this.validationForm(req, res);
        if(result.success){
            this.verify(req, res, next);
        }else{
            return res.status(400).json({ success: false, errors: result.errors });
        }
    }


    async verify(req, res, next) {
      try {
        verify.checkVerifyCode(req.body.phoneNumber, req.body.code)
          .then(result => {
            res.status(200).json({ success: true, message: result.message, token : result.user.token, });
          })
          .catch(error => {
            // console.error('Error during verification:', error);
            res.status(500).json({ success: false, error: error });
          });
      } catch (error) {
        // console.error('Error during verification:', error);
        res.status(500).json({ success: false, error: error });
      }
    }


    async resend(req, res, next){
      try {
        const otpId = await verify.sendCode(req.body.phoneNumber);
        const status = await verify.getStatus(otpId);
        if(status.status == 'operatorDelivered'){
          res.status(200).json({ message: 'Code resent successfully', status });
        }else{
          res.status(400).json({ message: 'Failed to send verification code', status });
        }
        
      } catch (error) { 
        res.status(500).json({ error: 'Internal server error' });
      }
    }
    
}


module.exports = new verifyController();