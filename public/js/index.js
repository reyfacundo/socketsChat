const socket = io();

let user;

let chatbox = document.getElementById("chatbox");

Swal.fire({
    title: "Inicia sesion!",
    text: "Ingresa tu nombre de usuario",
    input: "text",
    confirmButtonText: "Cool",
    allowOutsideClick: false,
    inputValidator: (value) => {
        if (!value) {
            return "Debe ingresar un nombre de usuario";
        }
    },
}).then((result) => {
    if (result.value) {
        user = result.value;
        socket.emit("new-user", { user: user, id: socket.id });
    }
});

chatbox.addEventListener("keyup", (e) => {
    console.log("chatBox existe", chatbox);
    console.log("evento key up", e.key, chatbox.value);
    if (e.key === "Enter") {
        if (chatbox.value.trim().length > 0) {
            socket.emit("message", {
                user: user,
                message: chatbox.value,
            });
            chatbox.value = "";
        }
    }
});

socket.on("messageLogs", (data) => {
    let log = document.getElementById("messageLogs");
    let message = "";

    data.forEach((elem) => {
        message += `
    
        <div class="chat-message">
        <div class="message-bubble">
  
          <div class="message-sender">${elem.user}</div>
          <p>${elem.message}</p>
          </div>
  
        </div>
      `;
    });

    log.innerHTML = message;
});

socket.on("new-user-connected", (data) => {
    if (data.id !== socket.id)
        Swal.fire({
            text: `${data.user} se ha conectado al chat`,
            toast: true,
            position: "top-end",
        });
});