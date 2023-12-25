const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {v4 : uuidv4} = require('uuid');
const jwt = require('jsonwebtoken');

const User = mongoose.Schema({
    admin : { type : Boolean, default : false},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, unique: true },
    age: { type: Number },
    token : { type : String, default : ''},
    points : { type : Number, default : 0},
    wallet: { type: Number },
    languageLevel: { type: String },
    isVerified: { type: Boolean, default: false },
},{
    timestamps : true
})


User.pre('save', function(next){
    const salt = bcrypt.genSaltSync(15);
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
    next();
});

// User.pre('findOneAndUpdate', function(next){
//     const salt = bcrypt.genSaltSync(15);
//     const hash = bcrypt.hashSync(this.getUpdate().$set.password, salt);
//     this.getUpdate().$set.password = hash;
//     next();
// })

User.pre('findOneAndUpdate', async function () {
    const update = this.getUpdate();
    if (update.$set && update.$set.password) {
      const salt = bcrypt.genSaltSync(15);
      const hash = bcrypt.hashSync(update.$set.password, salt);
      this.getUpdate().$set.password = hash;
    }
  });

User.methods.generateToken= async function() {
    const secretKey = process.env.JWT_SECRET_KEY || 'default-secret-key';
    const token = jwt.sign({ userId: this.id, userName: this.userName }, secretKey, { expiresIn: '1h' });
    this.token = token;
    return token;
  }

// User.methods.setRememberToken = async function(res){
//     try{
//         const token = uuidv4();
//         res.cookie('remember_token', token, {maxAge: 1000 * 60 * 60 * 24 , httpOnly : true, signed : true});
//         await this.updateOne({rememberToken : token})
//     }catch(err){
//         console.log(err);
//     }
// }


User.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password);
}



module.exports = mongoose.model('User', User);