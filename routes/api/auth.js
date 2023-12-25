const express = require('express');
const router = express.Router();

// controller
const registerController = require('./../../app/Http/Controllers/Auth/registerController');
const verifyController = require('app/Http/Controllers/Auth/verifyController');
const loginController = require('app/Http/Controllers/Auth/loginController');


//validator
const registerValidator = require('./../../app/Http/Validators/registerValidator');
const verifyValidator = require('./../../app/Http/Validators/verifyValidator');
const loginValidator = require('./../../app/Http/Validators/loginValidator');

// register
router.get('/register', registerController.showForm);
router.post('/register', registerValidator.handle() , registerController.registerProcess);


//login
router.get('/login', loginController.showForm);
router.post('/login', loginValidator.handle(), loginController.loginProcess);

//verify Code
router.get('/verify', verifyController.showForm);
router.post('/verify', verifyValidator.handle(), verifyController.verifyProcess);
router.post('/resend-code', verifyController.resend);

module.exports = router;