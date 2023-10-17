const express = require("express");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const PORT = 8000;
const corsOptions = {
    origin: "*",
    methods: "GET,POST",
    optionsSuccessStatus: 200,
};

const app = express();
const io = new Server({
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

mongoose.connect("mongodb://127.0.0.1:27017/game")
    .then(() => {
        console.log("MongoDB Connected.");
    })
    .catch((err) => {
        console.log("Mongo Error " + err);
    });

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const playerSchema = new mongoose.Schema(
    {
        playerName: {
            type: String,
            required: true,
        },
        socketId: {
            type: String,
            required: true,
            unique: true,
        },
        lobbyCode: {
            type: String,
            required: true,
        },
        lobbyIsOpen: {
            type: Boolean,
        },
    },
    {
        timestamps: true,
    }
);

const Player = mongoose.model("player", playerSchema);



io.on("connection", (socket) => {

    console.log("new connection");

    socket.on("ping", (callback) => {
        callback();
    });

    socket.on("message", (data) => {
        console.log(data.lobbyCode + " " + data.name + " " + data.str);
        io.to(data.lobbyCode).emit("message", { str: data.str });
    });

    socket.on("create-lobby", async (data) => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let length = 4;
        let code = "";

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }
        console.log(code + " - " + data.name);

        // code validation code

        const newPlayer = await Player.create({
            playerName: data.name,
            socketId: socket.id,
            lobbyCode: code,
            lobbyIsOpen: true,
        });

        newPlayer.save();

        socket.join(code);
        socket.emit("created-lobby", {
            name: data.name,
            lobbyCode: code,
            playerId: newPlayer._id,
        });
    });

    socket.on("join-lobby", async (data) => {
        console.log(data)
        const players = await Player.find({ lobbyCode: data.lobbyCode });
        console.log(players);


        if (players.length === 1) {
            if (players[0].lobbyIsOpen) {

                const newPlayer = new Player({
                    playerName: data.name,
                    socketId: socket.id,
                    lobbyCode: data.lobbyCode,
                    lobbyIsOpen: false,
                });
                newPlayer.save();

                socket.join(data.lobbyCode);
                socket.emit("joined-lobby", {
                    name: data.name,
                    lobbyCode: data.lobbyCode,
                    playerId: newPlayer._id,
                });
                socket.broadcast
                    .to(data.lobbyCode)
                    .emit("new-player-joined", {
                        name: data.name,
                        playerId: newPlayer._id,
                    });

                await Player.updateOne({ _id: players[0]._id }, { lobbyIsOpen: false });
            }
        }
    });



    socket.on("connection-request", async (data) => {
        console.log(data)
        const { fromName, fromPlayerId, toPlayerId, offer } = data;
        const toPlayer = await Player.findOne({ _id: toPlayerId });
        socket.to(toPlayer.socketId).emit("connection-request", { fromName, fromPlayerId, offer });
    });

    socket.on("connection-request-accepted", async (data) => {
        console.log(data);
        const { toPlayerId, answer } = data;
        const toPlayer = await Player.findOne({ _id: toPlayerId }).catch(e => console.log("error", e));
        console.log(toPlayer);
        socket.to(toPlayer.socketId).emit("connection-request-accepted", { answer });
    });

    socket.on("ice-candidate", async (data) => {
        console.log(data);
        const { toPlayerId } = data;
        const toPlayer = await Player.findOne({ _id: toPlayerId }).catch(e => console.log("error", e));
        io.to(toPlayer.socketId).emit("ice-candidate", data.candidate);
    });


});



app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) });
io.listen(8001);
