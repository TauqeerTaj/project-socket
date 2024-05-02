let socketIO;
module.exports = {
    init: httpServer => {
        socketIO = require('socket.io')(httpServer, {
            cors: {
                origin: "https://project-socket-backend.vercel.app"
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