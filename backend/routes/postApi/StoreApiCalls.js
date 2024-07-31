import express from "express";
import { postSpeechToTextData, postChatGptData, postTextToSpeechApi  } from "../../controllers/postApi/StoreApiCalls.js";

const router = express.Router();

router.post("/speechToText", postSpeechToTextData);;
router.post("/chatGpt", postChatGptData);
router.post("/textToSpeech", postTextToSpeechApi);

export default router;
