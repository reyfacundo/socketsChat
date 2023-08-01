import express from "express";                  //EXPRESS
import __dirname from "./utils.js"   //DIRNAME
import handlebars from 'express-handlebars';    //HANDLEBAR
import viewsRouter from './routes/views.router.js'  // HANDLEBAR ROUTER
import { Server } from "socket.io";   // SOCKETS 
import * as dotenv from "dotenv";    //DOTENV

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
const httpServer = app.listen( PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})
let messages = [];
const io = new Server(httpServer);      // SOCKET

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine('handlebars', handlebars.engine()); //HANDLEBAR
app.set('view engine', 'handlebars'); //HANDLEBAR
app.set('views', './src/views'); //HANDLEBAR

app.use(express.static("public")); //STATIC PUBLIC

app.use('/', viewsRouter); // HANDLEBAR ROUTER

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado!");
    socket.on("new-user", (data)=>{
        socket.user = data.user;
        socket.id = data.id;
        io.emit("new-user-connected", {
            user:socket.user,
            id: socket.id 
        });
    });
    socket.on("message", (data)=>{
        messages.push(data);
        socket.emit("messageLogs", messages);
    });
})