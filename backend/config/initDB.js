import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const initDB = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("MongoDB Connected.");
        })
        .catch((err) => {
            console.log("MongoDB Error:\n" + err);
        });
};
