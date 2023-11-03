require('dotenv').config();
const express = require("express");
const { Server } = require("socket.io");
const http = require("http")
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const PORT = process.env.PORT;
const corsOptions = {
    origin: "*",
    methods: "GET,POST",
    optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected.");
    })
    .catch((err) => {
        console.log("Mongo Error " + err);
    });

app.use(express.static('public'))
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

        do{
            code = "";
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                code += characters.charAt(randomIndex);
            }
            console.log(code + " - " + data.name);
        }while(await Player.findOne({ lobbyCode: code }) !== null);
        

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
        setTimeout(() => {
            Player.deleteOne({ _id: newPlayer._id }).then(e => console.log("deleted",e, newPlayer._id)).catch(e => console.log("error", e));
        }, 600000)
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
                setTimeout(() => {
                    Player.deleteOne({ _id: newPlayer._id }).then(e => console.log("deleted",e, newPlayer._id)).catch(e => console.log("error", e));
                }, 600000)
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

    socket.on("delete-log", (data) => {
        const { playerId } = data;
        Player.deleteOne({ _id: playerId }).then(e => console.log("deleted",e, playerId)).catch(e => console.log("error", e));
    });

});

app.get('/', (req, res) => {
    res.sendFile(__dirname+"/public/index.html");
})


server.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) });
