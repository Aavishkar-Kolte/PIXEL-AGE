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
  origin: "*",
  methods: "GET,POST",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

initDB();
configureRoutes(app);
configureSocketIO(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
