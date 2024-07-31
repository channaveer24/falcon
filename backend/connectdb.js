import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const chatGptApiKey = {
  apiKey: process.env.API_KEY,
};

export const db = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});




// export const db = mysql.createPool({
//   host: "b86ejnxvpzepjjv0odog-mysql.services.clever-cloud.com",
//   user: "urhhbqyiexyxxbx5",
//   password: "0dgkRPjtOdZ3DgHWNtnY",
//   database: "b86ejnxvpzepjjv0odog",
// });

// export const db = mysql.createPool({
//     host:"localhost",
//     user:"root",
//     password:"",
//     database:"dashboard",
// })
