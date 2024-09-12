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
const messageRouter = require('./router/messageRouter');
const {initializeSocket} = require('./utils/io')
const socketRouter = require('./router/socketRouter');
const socketMiddleware = require('./middlewares/socket');
const processMessage = require('./worker');
const path = require('path');
const app = express();
const {Server} = require('socket.io');
const http = require('http');
const jwt = require('jsonwebtoken');

const server = http.createServer(app);
const io = initializeSocket(server)
socketMiddleware(io);
socketRouter(io);

// workers
processMessage();

// middle ware
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/users', userRouter);
app.use('/posts', PostRouter);
app.use('/comments', commentRouter);
app.use('/likes', likeRouter);
app.use('/chat', messageRouter);



connectDB();
server.listen(port || 3000, (
    console.log(`Server is ruccing on port ${port || 3000}`)
));