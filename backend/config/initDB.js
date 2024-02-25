import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

//Initializes the database connection using MONGO_URI env variable
export const initDB = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("MongoDB Connected.");
        })
        .catch((err) => {
            console.log("MongoDB Error:\n" + err);
        });
};
