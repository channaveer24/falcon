import { db } from "../../connectdb.js";

export const getChatData = async (req, res) => {
  try {
    const q = "SELECT * FROM chat_message ORDER BY id DESC";
    const [rows] = await db.query(q); 
    return res.status(200).json(rows); 
  } catch (err) {
    console.error('Error fetching chat data:', err); // Log the error for debugging
    return res.status(500).json({ error: 'Internal Server Error' }); // Provide a more specific error message
  }
};

