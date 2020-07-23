let io;
let socket;

function connect(server) {
    io = require('socket.io')(server);

    io.on('connect', ioSocket => {
        socket = ioSocket;
    })
}

function getIo() {
    return io;
}

function getSocket() {
    return socket;
}

module.exports = {
    connect,
    getIo,
    getSocket
}