const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./../app/Models/User');
const verify = require('./../service/verifyPhoneNumber');



passport.use('local.register', new localStrategy({
    usernameField: 'userName',
    passwordField: 'password',
    passReqToCallback: true,
  }, async (req, userName, password, done) => {

    const user = await User.findOne({'userName' : userName});
        if(user){
            // اگر کاربر با این ایمیل قبلا ثبت نام کرده باشد
            return done(null, false, { message: 'This information has already been registered in the system' });

        }

        let { firstName, lastName, phoneNumber, age } = req.body;
        const addUser = new User({
            firstName,
            lastName,
            userName,
            age,
            phoneNumber,
            password
        });

        // const token = await addUser.generateToken(addUser);

        // addUser.token = token;

        await addUser.save();


        try {
            const otpId = await verify.sendCode(phoneNumber);
            const status = await verify.getStatus(otpId);
            addUser.status = status;
            return done(null, addUser, { message: 'Registration successful.', status });
        } catch (error) {
            return done(error, null);
        }
  }));


// کانفیگ سریالایزر Passport برای ساخت session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// کانفیگ دیسریالایزر Passport برای بازگرداندن اطلاعات کاربر از session
passport.deserializeUser(async (id, done) => {
    try {
        // یافتن کاربر با استفاده از شناسه
        const user = await User.findById(id);

        // انجام کالبک
        done(null, user);
    } catch (err) {
        // در صورت بروز خطا در هنگام جستجو در دیتابیس
        done(err, null);
    }
});


passport.use('local.login', new localStrategy({
    usernameField: 'phoneNumber',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, phoneNumber, password, done)=>{
    try{
        const user = await User.findOne({'phoneNumber' : phoneNumber});

        // console.log(user);

        if(!user || !user.comparePassword(password)){
            return done(null, false, {message : 'The username or password is incorrect.'})
        }

        return done(null, user);
    }catch(err){
        return done(err, false, {message : 'There was a problem logging into your account.'})
    }
}))


module.exports = passport;