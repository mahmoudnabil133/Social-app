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
const notificationRouter = require('./router/notificationRouter');
const {initializeSocket} = require('./utils/io')
const socketRouter = require('./router/socketRouter');
const socketMiddleware = require('./middlewares/socket');
const processMessage = require('./workers/msgWorker');
const processEmail = require('./workers/emailWorker');
const processNotification = require('./workers/notificationWorker');
const path = require('path');
const app = express();
const http = require('http');

const server = http.createServer(app);
const io = initializeSocket(server)
socketMiddleware(io);
socketRouter(io);

// workers
processMessage();
processEmail();
processNotification();
// middle ware
// app.use(cors());

app.use(cors())
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api/users', userRouter);
app.use('/api/posts', PostRouter);
app.use('/api/comments', commentRouter);
app.use('/api/likes', likeRouter);
app.use('/api/chat', messageRouter);
app.use('/api/notifications', notificationRouter);



connectDB();
server.listen(port , '0.0.0.0' , (
    console.log(`Server is ruccing on port ${port || 3000}`)
));
