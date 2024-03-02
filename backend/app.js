import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { initDB } from "./config/initDB.js";
import { configureRoutes } from "./routes.js";
import { configureSocketIO } from "./socket.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT;
const corsOptions = {
  origin: "*", // Set the allowed origin to any value, allowing requests from any origin
  methods: "GET,POST", // allowed HTTP methods
  optionsSuccessStatus: 200,
};

app.use(express.static('public'))
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


initDB();
configureRoutes(app);
configureSocketIO(server);


// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
