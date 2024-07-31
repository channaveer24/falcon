import { db } from "../../connectdb.js";

export const postFeedBackUpdate = async (req, res) => {
  try {
    const q = "update chat_message set response_feedback = ? where id = ?";
    const values = [req.body.response_feedback, req.body.id];
    
    if (!req.body.response_feedback) {
      return res.status(400).json("response_feedback is required");
    }
    if (!req.body.id) {
      return res.status(400).json("id is required");
    }

    const data = await db.query(q, values);
    return res.status(200).json("Feedback Updated");
  } catch (err) {
    return res.status(500).json(err);
  }
};
