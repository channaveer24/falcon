import { db } from "../../connectdb.js";

export const postSpeechToTextData = async (req, res) => {
  try {

    if (!req.body.date) {
      return res.status(400).json({ error: "Missing required field: date" });
    }

    const q = "insert into speech_to_text_api (`date`) value (?)";
    const values = [req.body.date];
    const [data] = await db.query(q, [values]);
    return res.status(200).json("Speech to Text Data Posted");
  } catch (err) {
    return res.status(500).json(err);
  }
};


export const postChatGptData = async (req, res) => {
  try {

    if (!req.body.date) {
      return res.status(400).json({ error: "Missing required field: date" });
    }

    const q = "insert into chat_gpt_api (`date`) value (?)";
    const values = [req.body.date];
    const data = await db.query(q, [values]);
    return res.status(200).json("Chat Gpt Data Posted");
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const postTextToSpeechApi = async (req, res) => {
  try {
    
    if (!req.body.date) {
      return res.status(400).json({ error: "Missing required field: date" });
    }
    const q = "insert into text_to_speech_api (`date`) value (?)";
    const values = [req.body.date];
    const data = await db.query(q, [values]);
    return res.status(200).json("Text to Speech Data Posted");
  } catch (err) {
    return res.status(500).json(err);
  }
};
