const { validationResult } = require("express-validator");
const abind = require('abind');
const config = require('./../../../config');



module.exports = class controller{

    constructor(){
        abind(this);
    }


    async validationForm(req, res){
        const result = await validationResult(req);

        if(!result.isEmpty()){
            const errors = result.array();
            const messages =  errors.map(err => err.msg);
            return { success: false, errors: messages };
        }else{
            return { success: true, errors: [] };
        }
    }
}