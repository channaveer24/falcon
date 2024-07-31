import express from "express";
import { postFeedBackUpdate } from "../../controllers/postApi/FeedBackUpdate.js";

const router = express.Router();

router.put("/response", postFeedBackUpdate);

export default router;
