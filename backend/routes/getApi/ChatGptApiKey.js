import express from "express";
import { getChatGptApiKeys } from "../../controllers/getApi/ChatGptApiKey.js";

const router = express.Router();

router.get("/apiKey", getChatGptApiKeys);

export default router;

