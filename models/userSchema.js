const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        select : false
    }
},{timestamps: true});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

userSchema.methods = {
    jwtToken(){
        return JWT.sign({
            id: this._id,
            email: this.email
        },
        process.env.JWT_SECRET,{
            expiresIn: '1d'
        }) 
    }
}


module.exports = mongoose.model('Users', userSchema);