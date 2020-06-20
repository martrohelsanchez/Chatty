const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const signUpRoute = require('./route/signUp');
const logInRoute = require('./route/logIn');

mongoose.connect(
  "mongodb+srv://martrohel:mongodb@cluster0-sutr8.gcp.mongodb.net/chatApp?retryWrites=true&w=majority",
  { useUnifiedTopology: true, useNewUrlParser: true }
);

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    console.log("get req")
    res.status(200).json({
        message: "get request succeffully made"
    });
})

io.on("connection", (socket) => {
  console.log("a user just connected");
  socket.on('sendMessage', message => {
      io.emit('receive message', message)
      console.log(message)
  })
});

app.use("/signUp", signUpRoute);
app.use('/logIn', logInRoute);

server.listen(5000);