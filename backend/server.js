const express = require('express');
const port = process.env.PORT || 3000;
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config');
const cookieParser = require('cookie-parser');
const userRouter = require('./router/user');
const app = express();

// middle ware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// routes
app.use('/users', userRouter);




connectDB();
app.listen(port || 3000, (
    console.log(`Server is ruccing on port ${port || 3000}`)
))