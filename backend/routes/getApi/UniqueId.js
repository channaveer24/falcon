import express from "express";
import { getUniqueId } from "../../controllers/getApi/UniqueId.js";

const router = express.Router();

router.get("/uniqueId", getUniqueId  )

export default router;

