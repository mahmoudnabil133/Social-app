const { Server } = require('socket.io');
let io;
const initializeSocket = (server)=>{
    io = new Server(server, {
        cors: {
            origin: '*',
        }
    });
    return io;
}

const getIo = ()=>{
    if (!io){
        throw new Error('socket.io not initialized');
    }
    return io;
}
module.exports = {initializeSocket, getIo}