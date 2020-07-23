const app = require('express')();
const server = require('http').createServer(app);
const io = require('./websocket').connect(server);
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoute = require('./route/user');
const chatRoute = require('./route/chat');

mongoose.connect(
  `mongodb+srv://martrohel:${process.env.mongodbPass}@cluster0-sutr8.gcp.mongodb.net/chatApp?retryWrites=true&w=majority`,
  { useUnifiedTopology: true, useNewUrlParser: true }
);

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    res.status(200).json({
        message: "get request succeffully made"
    });
})

app.use('/user', userRoute);
app.use('/chat', chatRoute);

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`The server is running on port ${port}`));