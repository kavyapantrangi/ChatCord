const formatMessage=require('./public/utils/messages')
const path=require('path');
const http=require('http');
const socketio=require('socket.io')
const express=require('express');
const app=express();
const  {userJoin,getCurrentUser,getRoomUsers,userLeave}=require('./public/utils/users');

const server=http.createServer(app);
const io=socketio(server)
//set Static folder
app.use(express.static(path.join(__dirname,'public')));

const botname='ChatCord Bot'
//Run when client connects
io.on('connection',socket=>
{
  socket.on('joinRoom',({username,room})=>
  {
const user=userJoin(socket.id,username,room);
socket.join(user.room)
  //welcoming the current user
    socket.emit('message',formatMessage(botname,'welcome to ChatCord'));
    // socket.emit('message','welcome to ChatCord');
    //broadcast the all the users
    socket.broadcast.to(user.room).emit(
      'message',
      formatMessage(botname,`${username} has Joined the chat`));
    //send users and room info
    io.to(user.room).emit('roomUsers',{
      room:user.room,
      users:getRoomUsers(user.room)
    });



    //listen for chatmessage
    socket.on('chatMessage',msg=>
    {
      const user=getCurrentUser(socket.id);
     io.to(user.room).emit('message',formatMessage(user.username,msg));
      
    });
  });
    //when user  left the chat
    socket.on('disconnect',()=>
      {
        const user=userLeave(socket.id);
        if(user)
        {
          io.to(user.room).emit('message',formatMessage(botname,`${user.username} has left the chat)`));
          
        }
        io.to(user.room).emit('roomUsers',{
          room:user.room,
          users:getRoomUsers(user.room)
        });
        
      });
        
} 

);
const PORT=3000||process.env.PORT;
server.listen(PORT,()=>
{
    console.log(`Server running on port ${PORT}`);
    
});