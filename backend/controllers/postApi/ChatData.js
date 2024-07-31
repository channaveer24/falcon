import { db } from "../../connectdb.js";
import { io } from "../../server.js"; 

export const postChatData = async (req, res) => {
  try {
    const q = "INSERT INTO chat_message (`date_time`,`protocol_name`,`request`,`response`,`user_id`,`response_feedback`) VALUES (?)";
    const values = [
      req.body.date_time,
      req.body.protocol_name,
      req.body.request,
      req.body.response,
      req.body.user_id,
      req.body.response_feedback,
    ];

    if (!req.body.date_time || !req.body.protocol_name || !req.body.request || !req.body.response || !req.body.user_id || !req.body.response_feedback) {
      return res.status(400).json("All fields are required");
    }

    await db.query(q, [values]);
    io.emit("newMessage", {
      ...req.body,
      date_time: new Date(req.body.date_time).toISOString(),
    });
    return res.status(200).json("Chat Data Posted");
  } catch (error) {
    return res.status(500).json(error);
  }
};



// if (!req.body.date_time) {
//   return res.status(400).json("date_time is required");
// }
// if (!req.body.protocol_name) {
//   return res.status(400).json("protocol_name is required");
// }
// if (!req.body.request) {
//   return res.status(400).json("request is required");
// }
// if (!req.body.response) {
//   return res.status(400).json("response is required");
// }
// if (!req.body.user_id) {
//   return res.status(400).json("user_id is required");
// }
// if (!req.body.response_feedback) {
//   return res.status(400).json("response_feedback is required");
// }
