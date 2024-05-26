import express from "express";
import mysql from "mysql2";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Salaha@07root",
  database: "digitalcs",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Get all departments
app.get("/departments", (req, res) => {
  db.query("SELECT * FROM departments", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json(results);
  });
});

// Add a new department
app.post("/departments", (req, res) => {
  const { name, description } = req.body;
  db.query(
    "INSERT INTO departments (name, description) VALUES (?, ?)",
    [name, description],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: results.insertId });
    }
  );
});

// Get all sections
app.get("/sections", (req, res) => {
  db.query("SELECT * FROM sections", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json(results);
  });
});

// Add a new section
app.post("/sections", (req, res) => {
  const { department_id, name, description } = req.body;
  db.query(
    "INSERT INTO sections (department_id, name, description) VALUES (?, ?, ?)",
    [department_id, name, description],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: results.insertId });
    }
  );
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
