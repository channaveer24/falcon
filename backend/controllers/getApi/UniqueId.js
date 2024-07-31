import { db } from "../../connectdb.js";

export const getUniqueId = async (req, res) => {
    try {
      const [rows] = await db.query("SELECT MAX(id) as maxId FROM chat_message");
      const nextId = rows[0].maxId + 1;
      return res.json({ uniqueID: nextId });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
