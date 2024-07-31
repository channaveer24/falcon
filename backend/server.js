import express from "express";
import http from "http";
import { Server } from 'socket.io';
import authRoutes from "./routes/auth.js";
import chatData from "./routes/postApi/ChatData.js";
import feedBackUpdate from "./routes/postApi/FeedBackUpdate.js";
import gptApiCalls from "./routes/postApi/StoreApiCalls.js"
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
app.use(express.json());
dotenv.config();



// ----------------- Deployement -----------------
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontEnd/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontEnd", "build", "index.html"));
  }
  );

} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}





// ----------------- Deployement -----------------

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling']
});

//middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// end points for the api requests.....
app.use("/api/auth", authRoutes);
app.use("/api", chatData);
app.use("/api", feedBackUpdate);
app.use("/api", gptApiCalls);

app.use("/api", getChatData);
app.use("/api", getApiKey);
app.use("/api", getUniqueId);
app.use("/api", chatGptApiCall);

app.get("/", (req, res) => {
  res.send("API Working");
});

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
  console.log("API Working");

  try {
    await db.getConnection();
    console.log("Connected to db");
  } catch (err) {
    console.log("Error in connecting to db", err);
  }
});

export { io };
