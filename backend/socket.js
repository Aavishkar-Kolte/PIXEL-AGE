import { Server } from "socket.io";
import { handleConnection } from "./controllers/socketController.js";

// Function to create the instance of the socket.io server and configure it
export const configureSocketIO = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    // Event handler for when a client connects to the server
    io.on("connection", (server) => {
        handleConnection(server, io);
    });
};