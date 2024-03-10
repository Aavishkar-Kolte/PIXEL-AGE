import { Player } from "../models/Player.js";


// Function to handle the creation of a lobby
export const handleCreateLobby = async (data, socket, isPrivate) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let length = 4;
    let code = "";

    // Generate a unique lobby code
    do {
        code = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }
    } while ((await Player.findOne({ lobbyCode: code })) !== null);

    // Create a new player and save it to the database
    const newPlayer = await Player.create({
        playerName: data.name,
        socketId: socket.id,
        lobbyCode: code,
        lobbyIsPrivate: isPrivate,
        lobbyIsOpen: true,
    });

    newPlayer.save();

    // Join the lobby and emit an event to notify the client about the created lobby
    socket.join(code);
    socket.emit("created-lobby", {
        name: data.name,
        lobbyCode: code,
        playerId: newPlayer._id,
    });

    // Set a timeout to delete the player after 10 minutes
    setTimeout(() => {
        Player.deleteOne({ _id: newPlayer._id })
        // .then((e) => console.log("deleted", e, newPlayer._id))
        // .catch((e) => console.log("error", e));
    }, 600000);
};



// Function to handle joining a lobby
export const handleJoinLobby = async (data, socket, isPrivate) => {
    // Find the player with the provided lobby code
    const player = await Player.findOne({ lobbyCode: data.lobbyCode });
    console.log(player);

    if (player) {
        if (player.lobbyIsOpen) {
            // Create a new player and save it to the database
            const newPlayer = new Player({
                playerName: data.name,
                socketId: socket.id,
                lobbyCode: data.lobbyCode,
                lobbyIsPrivate: isPrivate,
                lobbyIsOpen: false,
            });

            newPlayer.save();

            // Join the lobby and emit events to notify the client and other players about the new player
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

            // Update the lobbyIsOpen property of the existing player to and set a timeout to delete the new player after 10 minutes
            await Player.updateOne({ _id: player._id }, { lobbyIsOpen: false });
            setTimeout(() => {
                Player.deleteOne({ _id: newPlayer._id })
                // .then((e) => console.log("deleted", e, newPlayer._id))
                // .catch((e) => console.log("error", e));
            }, 600000);
        } else {
            // Emit an event to notify the client that the lobby is not open
            socket.emit("lobby-not-open", { lobbyCode: data.lobbyCode });
        }
    } else {
        // console.log("not found");
        // console.log(player);
        // Emit an event to notify the client that the lobby was not found
        socket.emit("lobby-not-found", { lobbyCode: data.lobbyCode });
    }
};
