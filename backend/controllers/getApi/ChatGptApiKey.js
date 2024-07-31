import { chatGptApiKey } from "../../connectdb.js";

export const getChatGptApiKeys = async (req, res) => {
  try {
    return res.status(200).json(chatGptApiKey);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
