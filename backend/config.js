const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const conenctDB = async()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then(()=> console.log('DB connected'))
    .catch(err=> console.log(err))
};
module.exports = conenctDB;