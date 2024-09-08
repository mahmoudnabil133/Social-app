const express = require('express');
const env = require('dotenv').config();
const port = process.env.PORT || 3000;
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config');
const cookieParser = require('cookie-parser');
const userRouter = require('./router/user');
const PostRouter = require('./router/post');
const commentRouter = require('./router/comment');
const likeRouter = require('./router/like');
const app = express();

// middle ware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// routes
app.use('/users', userRouter);
app.use('/posts', PostRouter);
app.use('/comments', commentRouter);
app.use('/likes', likeRouter);



connectDB();
app.listen(port || 3000, (
    console.log(`Server is ruccing on port ${port || 3000}`)
))