const messsageController = require('../controllers/messageController');
const socketRouter = (io)=>{
    io.on('connection', (socket)=>{
        socket.join(socket.userId);
        console.log('user connected with id', socket.userId);
        socket.on('send-message', (data)=>{
            messsageController.sendMessage(socket, data);
        });
        socket.on('disconnect', ()=>{
            console.log('user disconnected');
        })
    })
}
module.exports = socketRouter;