import express from "express";
import { postChatData } from "../../controllers/postApi/ChatData.js";

const router = express.Router();

router.post("/chatData", postChatData)

export default router;
