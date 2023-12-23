const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const cookieParser = require('cookie-parser');



const app = express();

module.exports = class Application{
    constructor(){
        this.configServerAndMongo();
        this.setConfig();
        this.setRouts();
    }

    configServerAndMongo(){
        mongoose.connect(config.database.url)
        .then(()=>{
            app.listen(3000) 
        }).catch((err)=>{
            console.log(err)
        })
    }

    setConfig(){
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));  // کانفیگ برای گرفتن اطلاعات از فرم

        //passport
        require('./../passport/passport-local');
        // app.use(passport.initialize());
        // app.use(passport.session());


        //session
        app.use(cookieParser('secretId'));
        app.use(session({...config.session}));
        app.use(passport.initialize());
        app.use(passport.session());

    }


    setRouts(){
        app.use(require('./../routes/api'));
    }
}