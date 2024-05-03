let socketIO;
module.exports = {
    init: httpServer => {
        socketIO = require('socket.io')(httpServer, {
            cors: {
                origin: process.env.CORS_URL
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