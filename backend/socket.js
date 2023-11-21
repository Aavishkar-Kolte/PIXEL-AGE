import { Server } from "socket.io";
import { handleConnection } from "./controllers/socketController.js";

export const configureSocketIO = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (server) => {
        handleConnection(server, io);
    });
};
