import mysql from "mysql";

// Extend the type

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "books",
  dateStrings: true,
});

// Connect and handle errors
db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

export default db;
