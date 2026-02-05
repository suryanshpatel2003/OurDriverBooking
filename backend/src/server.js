import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./config/socket.js";

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

// init socket
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port by suryansh patel ${PORT}`);
});
