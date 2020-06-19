const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');

app.use(cors());

app.get('/', (req, res, next) => {
    console.log("get req")
    res.status(200).json({
        message: "get request succeffully made"
    });
})

io.on("connection", (socket) => {
  console.log("a user just connected");
  socket.on('sendMessage', message => {
      console.log(message)
  })
});

server.listen(5000);