const jwt = require('jsonwebtoken');
const User = require('../models/user');
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail');
const { promisify } = require('util');
const env = require('dotenv').config();

const createSendToken = (user, statusCode, res)=>{
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    console.log(token)
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnley: true
    }
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        success: true,
        token,
        data: user
    })
};


exports.signUp = async(req, res)=>{
    try{
        console.log(req.body)
        const newUser = {}
        newUser.userName = req.body.userName;
        newUser.email = req.body.email;
        newUser.password = req.body.password;
        newUser.confirmPassword = req.body.confirmPassword;
        const user = await User.create(newUser)
        console.log(user)
        createSendToken(user, 201, res)
        
    }catch(err){
        console.log(err.message)
        res.status(400).json({
            success: false,
            msg: err.message
        })
    }
};

exports.login = async(req, res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email: email}).select('+password');
        if (!user || !(await user.correctPassword(password, user.password))) {
            throw new Error('incorrect email or password')
        }
        createSendToken(user, 200, res)

    }catch(err){
        res.status(400).json({
            success: false,
            msg: err.message
        })
    }
};

exports.logout = async(req, res)=>{
    // remove cookies from browser.
    console.log('logout')
    res.cookie('jwt', 'loogedout',{
        expires: new Date(Date.now() + 10 * 1000),
        httpOnley: true
    });
    res.status(200).json({
        success: true,
        msg: 'looged out'
    })

};

exports.protect = async(req, res, next)=>{
    try{
        console.log('protected route');
        console.log(req.cookies)
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            console.log('got token from headers')
        } else if (req.cookies.jwt){
            token = req.cookies.jwt;
            console.log('got token from cookies')
        }
        console.log(token)
        if (!token) throw new Error('you are not logged in please login');
        // what is pomisify to get decoded ?
        let decoded;;
        try{
            decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        } catch(err){
            throw new Error('token is invalid')
        }
        console.log(decoded)
        const user = await User.findById(decoded.id)
        if (!user) throw new Error('user not found');
        if (user.changedPassword(decoded.iat)) {
            throw new Error('token didnt changed after updating password please login again')
        }
        // allow access to user
        req.user = user
        next()

    }catch(err){
        res.status(400).json({
            success: false,
            msg: err.message
        })
    }
};

exports.isAuth = async(req, res)=>{
    try{
        const token = req.body.token;
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) throw new Error('user not found');
        if (user.changedPassword(decoded.iat)) {
            throw new Error('token didnt changed after updating  password please login again')
        }
        res.status(200).json({
            valid: true
        })

    } catch(err){
        res.status(400).json({
            valid: false
        })
    }
};

exports.restrictTo = (...roles) => {
    return (req, res, next)=>{
        try {
            if (!roles.includes(req.user.role)) throw new Error('you are not allowed to access this route');
            next()
        } catch(err){
            res.status(400).json({
                success: false,
                msg: err.message
            })
        }
    }
};

exports.forgotPassword = async(req, res)=>{
    try{
        const { email } = req.body;
        const user = await User.findOne({email: email})
        if (!user) throw new Error('user not found');
        const resetToken = user.CreatePasswordResetToken()
        await user.save({ validateBeforeSave: false})
        const resetUrl = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`;
        const message = `forgot your password ? subnit a patch request with you new password and passwordconferm to ${resetUrl}. if you didnt forget your password please ignore this mail`
        try{
            await sendEmail({
                email: user.email,
                subject: 'password reset token',
                message
            });
            res.status(200).json({
                success: true,
                msg: 'token sent to email'
            })

        } catch(err){
            user.passwordResetToken = undefined
            user.passwordResetExpires = undefined
            await user.save({validateBeforeSave: false})
            throw new Error('error while sending email')
        }
    } catch(err){
        res.status(400).json({
            success: false,
            msg: err.message
        })
    }
};


exports.resetPassword = async(req, res) =>{
    try{
        const { token } = req.params
        const encryptedToken = crypto.createHash("sha256").update(token).digest('hex');
        const user = await User.findOne({passwordResetToken:encryptedToken, passwordResetExpires: {$gt: Date.now()}});
        if (!user) throw new Error('user not found');
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save()
        createSendToken(user, 200, res)
    } catch(err){
        res.status(400).json({
            success: false,
            msg: err.message
        })
    }
};

exports.updatePassword = async(req, res)=>{
    try{
        const user = await User.findById(req.user.id).select('+password')
        if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
            throw new Error('password is incorrect')
        }
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        await user.save()
        createSendToken(user, 200, res)

    }catch(err){
        res.status(400).json({
            success: false,
            msg: err.message
        })
    }
}