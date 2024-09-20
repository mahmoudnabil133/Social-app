const jwt = require('jsonwebtoken');
const authSocket = (io)=>{
    return io.use((socket, next)=>{
        const token = socket.handshake.auth.token;
        console.log('token', token);
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
}
module.exports = authSocket;