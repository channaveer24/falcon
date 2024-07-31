import { db } from "../../connectdb.js";

export const chatGptApiMonthlyCall = async (req, res) => {
  try {
    const q = "SELECT id, DATE(date) AS date FROM chat_gpt_api";
    const [rows] = await db.query(q);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthlyCounts = Array(12).fill(0);

    rows.forEach((row) => {
      const month = new Date(row.date).getMonth();
      monthlyCounts[month] += 1;
    });

    const result = monthNames.map((month, index) => ({
      months: month,
      counts: monthlyCounts[index],
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching chat data:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const speechToTextApiMonthlyCall = async (req, res) => {
  try {
    const q = "SELECT id, DATE(date) AS date FROM speech_to_text_api";
    const [rows] = await db.query(q);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthlyCounts = Array(12).fill(0);

    rows.forEach((row) => {
      const month = new Date(row.date).getMonth();
      monthlyCounts[month] += 1;
    });

    const result = monthNames.map((month, index) => ({
      months: month,
      counts: monthlyCounts[index],
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching chat data:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const textToSpeechApiMonthlyCall = async (req, res) => {
  try {
    const q = "SELECT id, DATE(date) AS date FROM text_to_speech_api";
    const [rows] = await db.query(q);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthlyCounts = Array(12).fill(0);

    rows.forEach((row) => {
      const month = new Date(row.date).getMonth();
      monthlyCounts[month] += 1;
    });

    const result = monthNames.map((month, index) => ({
      months: month,
      counts: monthlyCounts[index],
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching chat data:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const chatGptApiDailyCall = async (req, res) => {
  try {
    const q = `
        SELECT DATE(date) AS date, COUNT(*) AS counts
        FROM chat_gpt_api
        GROUP BY DATE(date)
        ORDER BY DATE(date)
      `;
    const [rows] = await db.query(q);

    const result = rows.map((row) => ({
      date: row.date.toISOString().split("T")[0],
      counts: row.counts,
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching chat data:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const speechToTextApiDailyCall = async (req, res) => {
  try {
    const q = `SELECT DATE(date) AS date, COUNT(*) AS counts
        FROM speech_to_text_api
        GROUP BY DATE(date)
        ORDER BY DATE(date)`;
    const [rows] = await db.query(q);

    const dailyCounts = Array(31).fill(0);

    const result = rows.map((row) => ({
      date: row.date.toISOString().split("T")[0],
      counts: row.counts,
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching chat data:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const textToSpeechApiDailyCall = async (req, res) => {
  try {
    const q = `SELECT DATE(date) AS date, COUNT(*) AS counts
        FROM text_to_speech_api
        GROUP BY DATE(date)
        ORDER BY DATE(date)`;
    const [rows] = await db.query(q);

    const dailyCounts = Array(31).fill(0);

    const result = rows.map((row) => ({
      date: row.date.toISOString().split("T")[0],
      counts: row.counts,
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching chat data:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};
