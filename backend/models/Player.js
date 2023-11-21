import mongoose from "mongoose";

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
        lobbyIsPrivate: {
            type: Boolean,
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

export const Player = mongoose.model("player", playerSchema);

