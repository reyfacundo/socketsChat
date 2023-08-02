const socket = io();

let chatbox = document.getElementById("chatbox");
let user

Swal.fire({
    title:"Bienvenido al chat",
    input:"text",
    text:"Ingresa tu usuario.",
    icon:"success",
    allowOutsideClick:false,
    inputValidator:(value)=>{
        if(!value){
            return "Debes ingresar un nombre de usuario";
        }
    }
}).then((result)=>{
    if(result.value){
        user = result.value;
        socket.emit("new-user", { user: user, id: socket.id})
    }
});
socket.on("new-user-connected", (data) =>{
        Swal.fire({
            title:"Nuevo usuario conectado!",
            text:`${data.user} se ha conectado `,
            toast:true,
            position: "top-end",
        })
})

chatbox.addEventListener("keyup", (e)=>{
    if(e.key === "Enter"){
        if(chatbox.value.trim().length > 0){
            socket.emit("message", {
                user:user,
                message:chatbox.value
            });
            chatbox.value="";
        }
    }
})

socket.on("messageLogs", (data)=>{
    let log = document.getElementById("messageLogs");
    let messages = "";
    data.forEach(element => {
        messages = messages + `${element.user} says : ${element.message} <br>`
    });
    log.innerHTML = messages;
})