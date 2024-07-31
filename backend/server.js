import express from "express";
import http from "http";
import { Server } from 'socket.io';
import authRoutes from "./routes/auth.js";
import chatData from "./routes/postApi/ChatData.js";
import feedBackUpdate from "./routes/postApi/FeedBackUpdate.js";
import gptApiCalls from "./routes/postApi/StoreApiCalls.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { db } from "./connectdb.js";
import path from "path";
import dotenv from "dotenv";

import getChatData from "./routes/getApi/ChatData.js";
import getApiKey from "./routes/getApi/ChatGptApiKey.js";
import getUniqueId from "./routes/getApi/UniqueId.js";
import chatGptApiCall from "./routes/getApi/apiCalls.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Adjust to your actual origin
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling']
  }
});

dotenv.config();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/chatdata", chatData);
app.use("/api/feedbackupdate", feedBackUpdate);
app.use("/api/gptapicalls", gptApiCalls);
app.use("/api/getchatdata", getChatData);
app.use("/api/getapikey", getApiKey);
app.use("/api/getuniqueid", getUniqueId);
app.use("/api/chatgptapicall", chatGptApiCall);

// Deployment settings
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontEnd/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontEnd", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

const onSocketConnection = socket => {
  console.log('Socket connected');
  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
  // Add other socket event handlers here
};

io.on("connection", onSocketConnection);

const PORT = process.env.PORT || 8600;

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await db.getConnection();
    console.log("Connected to db");
  } catch (err) {
    console.log("Error in connecting to db", err);
  }
});

export { io };
