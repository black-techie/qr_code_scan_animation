const express = require("express");


let count = 0;
let skips = 0;
const delay = 10

const app = express()
const path = require('path');

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/viewer", (req, res) => {
    // return res.json({ view: count>0?"animation":"screen saver", battery: count })
    return res.sendFile(path.join(__dirname + '/public/index.html'));
})

app.get("/sender", (req, res) => {
    const intervalId = setInterval(() => {
        if(skips < delay && count < delay-5){
            count--;
            skips++;
        }
        else{
            skips = 0;
        }
        count++;
        io.emit("update", count)
        if (count === 101) {
            count = 0;
            clearInterval(intervalId);
        }
    }, 100);
    return res.redirect("/viewer")
})

app.get("/led", (req, res) => {
    return res.json({ status: count > 0 ? true : false })
})

server.listen(8000, () => {
    console.log("running")
})

io.on("connection", (socket) => {
    console.log("A viewer connected");
    socket.emit("update", count);
    socket.on("disconnect", () => {
        console.log("A viewer disconnected");
    });
})