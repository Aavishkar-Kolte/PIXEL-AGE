import { Player } from "../models/Player.js";

export const handleCreateLobby = async (data, socket, isPrivate) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let length = 4;
    let code = "";

    do {
        code = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }
    } while ((await Player.findOne({ lobbyCode: code })) !== null);

    const newPlayer = await Player.create({
        playerName: data.name,
        socketId: socket.id,
        lobbyCode: code,
        lobbyIsPrivate: isPrivate,
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
        Player.deleteOne({ _id: newPlayer._id })
            .then((e) => console.log("deleted", e, newPlayer._id))
            .catch((e) => console.log("error", e));
    }, 600000);
};

export const handleJoinLobby = async (data, socket, isPrivate) => {
    const player = await Player.findOne({ lobbyCode: data.lobbyCode });
    console.log(player);
    if (player) {
        if (player.lobbyIsOpen) {
            const newPlayer = new Player({
                playerName: data.name,
                socketId: socket.id,
                lobbyCode: data.lobbyCode,
                lobbyIsPrivate: isPrivate,
                lobbyIsOpen: false,
            });
            newPlayer.save();

            socket.join(data.lobbyCode);
            socket.emit("joined-lobby", {
                name: data.name,
                lobbyCode: data.lobbyCode,
                playerId: newPlayer._id,
            });
            socket.broadcast.to(data.lobbyCode).emit("new-player-joined", {
                name: data.name,
                playerId: newPlayer._id,
            });

            await Player.updateOne({ _id: player._id }, { lobbyIsOpen: false });
            setTimeout(() => {
                Player.deleteOne({ _id: newPlayer._id })
                    .then((e) => console.log("deleted", e, newPlayer._id))
                    .catch((e) => console.log("error", e));
            }, 600000);
        }
    } else {
        console.log("not found");
        console.log(player);
        socket.emit("lobby-not-found", { lobbyCode: data.lobbyCode });
    }
};
