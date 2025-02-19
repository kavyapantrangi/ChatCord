
const chatForm=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
//Get Username and room from url
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true});
console.log(username,room);

const socket = io();
//Join chatroom
socket.emit('joinRoom',{username,room});
//Get room and users


socket.on('roomUsers',({room,users
})=>
{
outputRoomName(room);
OutputUsers(users);
}
);



// Listen for 'message' event from the server
socket.on('message', (message) => {
    console.log(message);  // Logs the message in the browser console
    outputMessage(message);
});
//scroll down

chatMessages.scrollTop=chatMessages.scrollHeight;


//Message submit
chatForm.addEventListener('submit',(e)=>
{
e.preventDefault();
//get message text
const msg=e.target.elements.msg.value;
//emit message to server
socket.emit('chatMessage',msg);
//clear the input

e.target.elements.msg.value='';
e.target.elements.msg.focus();

});
//output message to dom function
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">${message.text}</p>
    `;
    chatMessages.appendChild(div);

    // Auto-scroll to the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
//add room name to dom
function outputRoomName(room)
{
roomName.innerText=room;
}
// add users to dom
function OutputUsers(users)
{
    userList.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}

    `;
}