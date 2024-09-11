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
const path = require('path');
const app = express();
const {Server} = require('socket.io');
const http = require('http');
const jwt = require('jsonwebtoken');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
    }
});

app.use(cors());
io.use((socket, next)=>{
    console.log('asasasassasas');
    const token = socket.handshake.auth.token;
    if (token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
            if(err){
                next(new Error('authentication error'));
            } socket.userId = decoded.id;
            next();
        })
    }else{
        next(new Error('token not found'));
    }  
});

io.on('connection', (socket)=>{
    console.log('user connected with id', socket.userId);
    socket.join(socket.userId);

    socket.on('send-message', (data)=>{
        const {recievedId, message, from} = data;
        socket.to(recievedId).emit('recieve-message', {message, from});
    })
    socket.on('disconnect', ()=>{
        console.log('user disconnected');
    })
})
// middle ware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/users', userRouter);
app.use('/posts', PostRouter);
app.use('/comments', commentRouter);
app.use('/likes', likeRouter);



connectDB();
server.listen(port || 3000, (
    console.log(`Server is ruccing on port ${port || 3000}`)
))