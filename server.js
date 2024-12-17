var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http,  {
  cors: {
    origin: '*',
  }
});
let rooms = {
  "room1":1,
  "room2":1,
};

// var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

// var Message = mongoose.model('Message',{
//   name : String,
//   message : String
// })

// var dbUrl = 'mongodb://amkurian:amkurian1@ds257981.mlab.com:57981/simple-chat'

// app.get('/messages', (req, res) => {
//   Message.find({},(err, messages)=> {
//     res.send(messages);
//   })
// })


// io.on("message", async(data)=>{
//     var message = new Message(data);
//     var savedMessage = await message.save()
// });




io.on('connection', (socket) =>{
  console.log('a user is connected')

      // Example for restricting joining rooms
    socket.on('join-room', (roomName) => {
        if (roomName in rooms) {
            socket.join(roomName);
            socket.emit('room-joined', `Joined room ${roomName}`);
        } else {
            socket.emit('room-error', 'Room does not exist.');
            socket.disconnect();
        }
    });

     socket.on('send-message', (roomName, message, user) => {
        // Send message to all users in the specified room
        io.to(roomName).emit('receive-message', {
            message: message,
            user: user,
        });
    });
})

// mongoose.connect(dbUrl ,{useMongoClient : false} ,(err) => {
//   console.log('mongodb connected',err);
// })

var server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});
