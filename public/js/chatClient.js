const socket = io()  //websocket api
const messages = document.querySelector('#chat-message')
const chatUserName = document.querySelector('#chat-username')
const chatForm = document.querySelector('form')
const chatMessage = document.querySelector('#chat-message')
const chatDisplay = document.querySelector('.chat-display')

//server broadcast

// socket.on("connection", (data) => {
    
//     let newMessage =document.createElement('p');

//     newMessage.className = "chat-text "
    
//     newMessage.innerHTML = `${data.username} has landed.`

//     chatDisplay.insertBefore(newMessage, chatDisplay.firstChild)

// })
// socket.on("disconnect", (data) => {
    
//     let newMessage =document.createElement('p');

//     newMessage.className = "chat-text "
    
//     newMessage.innerHTML = `${data.username} has left the nest.`

//     chatDisplay.insertBefore(newMessage, chatDisplay.firstChild)

// })


// socket.on("connection", (socket) => {
//     socket.broadcast.emit("hello", "world");
// });


socket.on('updateMessage',(data) => {
    
    let newMessage =document.createElement('p');
    if (chatUserName.value === data.username){
        newMessage.className = "chat-text text-green text-right "
    } else{
        newMessage.className = "chat-text "
    }
    newMessage.innerHTML = `<strong>${data.username}</strong>: ${data.message}`

    chatDisplay.insertBefore(newMessage, chatDisplay.firstChild)
    
    // chatDisplay.appendChild(newMessage)


})



//emit message to server
chatForm.addEventListener('submit',(e) => {
    e.preventDefault();
    //retrieve message from chat input field
    //chat.value
    //take socket object and emit message to node server socket.emit()
    // console.log(chatUserName.value, chatMessage.value);
    socket.emit('postMessage',{
        username: chatUserName.value,
        message: chatMessage.value
    })
    
    
    // chatDisplay.scrollTop = chatDisplay.scrollHeight - chatDisplay.clientHeight;
})
