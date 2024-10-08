const messsageController = require('../controllers/messageController');
let newSocket;
const socketRouter = (io)=>{
    io.on('connection', (socket)=>{
        newSocket = socket;
        socket.join(socket.userId);
        console.log('user connected with id', socket.userId);
        socket.on('send-message', (data)=>{
            messsageController.sendMessage(socket, data);
        });
        socket.on('disconnect', ()=>{
        })
    })
}
module.exports = socketRouter
