const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'Please enter your name'],
        unique: true
    },
    email: {
        type: String,
        validate:[validator.isEmail, 'please enter a valid email'],
        required: [true, 'Please enter your email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(val) {
                return val === this.password;
            },
            message: 'Passwords do not match'
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    active:{
        type: Boolean,
        default: true,
        select: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    friends:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    requistedFriends:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

UserSchema.pre('save', async function(next){
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000 ; // to make sure the token is created after the password is changed
    next()
});

UserSchema.methods.correctPassword = async function(candidatePasswrod, userPassword) {
    return await bcrypt.compare(candidatePasswrod, userPassword);
};

UserSchema.methods.changedPassword = function(JWTTimeStamp) {
    if (this.passwordChangedAt){
      const passworChangingTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      return passworChangingTime > JWTTimeStamp
    }
    return false
};

UserSchema.methods.CreatePasswordResetToken  = function(){
    const resetToken = 
      crypto
        .randomBytes(32)
        .toString('hex');
    this.passwordResetToken = 
      crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
  };
module.exports = mongoose.model('User', UserSchema);