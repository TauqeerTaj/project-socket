let socketIO;
module.exports = {
    init: httpServer => {
        socketIO = require('socket.io')(httpServer, {
            cors: {
                origin: "http://localhost:3000"
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