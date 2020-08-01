let io;

function connect(server) {
    io = require('socket.io')(server);

    io.on('connect', socket => {
        socket.on('join room', (roomName) => {
            socket.join(roomName);
        })

        socket.on('err', err => {
            console.error(err)
        })
    })
}

function getIo() {
    return io;
}

module.exports = {
    connect,
    getIo
}