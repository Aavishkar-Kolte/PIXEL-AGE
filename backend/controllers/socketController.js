import { Player } from "../models/Player.js";
import { handleCreateLobby, handleJoinLobby } from "../handlers/lobbyHandlers.js";


// Function to set up event listeners. This function is called when a client connects to the server
export const handleConnection = (socket, io) => {
    console.log("new connection");

    // Event listener for "ping" event
    // Yet to be implemented
    socket.on("ping", (callback) => {
        callback();
    });

    // Event listener for "message" event
    socket.on("message", (data) => {
        io.to(data.lobbyCode).emit("message", { str: data.str });
    });

    // Event listener for "create-lobby" event
    socket.on("create-lobby", async (data) => {
        handleCreateLobby(data, socket, true);
    });

    // Event listener for "join-lobby" event
    socket.on("join-lobby", async (data) => {
        handleJoinLobby(data, socket, true);
    });

    // Event listener for "play-online" event
    // Checks if there is an available player to join
    // If available, calls the handleJoinLobby function to join the lobby
    // If not available, calls the handleCreateLobby function to create a new lobby
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

    // Event listener for "connection-request" event
    // Sends a connection request to another player
    socket.on("connection-request", async (data) => {
        const { fromName, fromPlayerId, toPlayerId, offer } = data;
        const toPlayer = await Player.findOne({ _id: toPlayerId });
        socket
            .to(toPlayer.socketId)
            .emit("connection-request", { fromName, fromPlayerId, offer });
    });

    // Event listener for "connection-request-accepted" event
    // Notifies the sender that the connection request has been accepted
    socket.on("connection-request-accepted", async (data) => {
        const { toPlayerId, answer } = data;
        const toPlayer = await Player.findOne({ _id: toPlayerId }).catch((e) =>
            console.log("error", e)
        );
        socket
            .to(toPlayer.socketId)
            .emit("connection-request-accepted", { answer });
    });

    // Event listener for "ice-candidate" event
    // Sends ICE candidate information to another player
    socket.on("ice-candidate", async (data) => {
        const { toPlayerId } = data;
        const toPlayer = await Player.findOne({ _id: toPlayerId }).catch((e) =>
            console.log("error", e)
        );
        io.to(toPlayer.socketId).emit("ice-candidate", data.candidate);
    });

    // Event listener for "delete-log" event
    // Deletes a player's log entry from the database
    socket.on("delete-log", (data) => {
        const { playerId } = data;
        Player.deleteOne({ _id: playerId })
            .then((e) => console.log("deleted", e, playerId))
            .catch((e) => console.log("error", e));
    });
};
