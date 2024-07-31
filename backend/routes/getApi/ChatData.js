import express from "express";
import { getChatData } from "../../controllers/getApi/ChatData.js";

const router = express.Router();

router.get("/getChatdata", getChatData);

export default router;
