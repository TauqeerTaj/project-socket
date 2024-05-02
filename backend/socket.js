const CORS_PORT = process.env.CORS_PORT
let socketIO;
module.exports = {
    init: httpServer => {
        socketIO = require('socket.io')(httpServer, {
            cors: {
                origin: CORS_PORT
            }
        });
        return socketIO
    },
    getIO: () => {
        if(!socketIO){
            throw new Error('Socket.io not initialized')
        }
        return socketIO
    }
}