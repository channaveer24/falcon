import express from 'express';
import { chatGptApiMonthlyCall, speechToTextApiMonthlyCall, textToSpeechApiMonthlyCall, chatGptApiDailyCall, speechToTextApiDailyCall, textToSpeechApiDailyCall } from '../../controllers/getApi/apiCall.js';

const router = express.Router();

router.get('/chatGptApiMonthlyCall', chatGptApiMonthlyCall);
router.get('/speechToTextApiMonthlyCall', speechToTextApiMonthlyCall);
router.get('/textToSpeechApiMonthlyCall', textToSpeechApiMonthlyCall);
router.get('/chatGptApiDailyCall', chatGptApiDailyCall);
router.get('/speechToTextApiDailyCall', speechToTextApiDailyCall);
router.get('/textToSpeechApiDailyCall', textToSpeechApiDailyCall);

export default router;