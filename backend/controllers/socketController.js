import { Player } from "../models/Player.js";
import { handleCreateLobby, handleJoinLobby } from "../handlers/lobbyHandlers.js";

export const handleConnection = (socket, io) => {
    console.log("new connection");

    socket.on("ping", (callback) => {
        callback();
    });

    socket.on("message", (data) => {
        io.to(data.lobbyCode).emit("message", { str: data.str });
    });

    socket.on("create-lobby", async (data) => {
        handleCreateLobby(data, socket, true);
    });

    socket.on("join-lobby", async (data) => {
        handleJoinLobby(data, socket, true);
    });

    socket.on("play-online", async (data) => {
        const player = await Player.findOne({
            lobbyIsPrivate: false,
            lobbyIsOpen: true,
        });

        if (player) {
            handleJoinLobby(
                { name: data.name, lobbyCode: player.lobbyCode },
                socket,
                false
            );
        } else {
            handleCreateLobby(data, socket, false);
        }
    });

    socket.on("connection-request", async (data) => {
        const { fromName, fromPlayerId, toPlayerId, offer } = data;
        const toPlayer = await Player.findOne({ _id: toPlayerId });
        socket
            .to(toPlayer.socketId)
            .emit("connection-request", { fromName, fromPlayerId, offer });
    });

    socket.on("connection-request-accepted", async (data) => {
        const { toPlayerId, answer } = data;
        const toPlayer = await Player.findOne({ _id: toPlayerId }).catch((e) =>
            console.log("error", e)
        );
        socket
            .to(toPlayer.socketId)
            .emit("connection-request-accepted", { answer });
    });

    socket.on("ice-candidate", async (data) => {
        const { toPlayerId } = data;
        const toPlayer = await Player.findOne({ _id: toPlayerId }).catch((e) =>
            console.log("error", e)
        );
        io.to(toPlayer.socketId).emit("ice-candidate", data.candidate);
    });

    socket.on("delete-log", (data) => {
        const { playerId } = data;
        Player.deleteOne({ _id: playerId })
            .then((e) => console.log("deleted", e, playerId))
            .catch((e) => console.log("error", e));
    });
};
