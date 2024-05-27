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
  if (!name || !description) {
    res.status(400).json({ error: "Name and description are required" });
    return;
  }
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

// Delete a department
app.delete("/departments/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM departments WHERE id = ?", [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send("Department deleted");
    }
  });
});

app.get("/sections", (req, res) => {
  db.query("SELECT * FROM sections", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json(results);
  });
});

app.post("/sections", (req, res) => {
  const { department_id, name, description, section, department } = req.body;
  console.log("Received section data:", req.body); // Log the received data
  if (!department_id || !name || !description || !section || !department) {
    res.status(400).json({
      error:
        "Department ID, name, description, section, and department are required",
    });
    return;
  }
  db.query(
    "INSERT INTO sections (department_id, name, description, section, department) VALUES (?, ?, ?, ?, ?)",
    [department_id, name, description, section, department],
    (err, results) => {
      if (err) {
        console.error("Error inserting section:", err); // Log the error
        res.status(500).json({ error: err.message });
        return;
      }
      console.log("Inserted section with ID:", results.insertId); // Log the insert ID
      res.status(201).json({ id: results.insertId });
    }
  );
});

// Delete a section
app.delete("/sections/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM sections WHERE id = ?", [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send("Section deleted");
    }
  });
});

// Update a department
app.put("/departments/:id", (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!name || !description) {
    res.status(400).json({ error: "Name and description are required" });
    return;
  }
  db.query(
    "UPDATE departments SET name = ?, description = ? WHERE id = ?",
    [name, description, id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(200).send("Department updated");
    }
  );
});

app.put("/sections/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, section, department } = req.body;
  if (!name || !description || !section || !department) {
    res.status(400).json({
      error: "Name, description, section, and department are required",
    });
    return;
  }
  db.query(
    "UPDATE sections SET name = ?, description = ?, section = ?, department = ? WHERE id = ?",
    [name, description, section, department, id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(200).send("Section updated");
    }
  );
});

// // Update a section
// app.put("/sections/:id", (req, res) => {
//   const { id } = req.params;
//   const { name, description, section, department } = req.body;
//   if (!name || !description || !section || !department) {
//     res.status(400).json({
//       error: "Name, description, section, and department are required",
//     });
//     return;
//   }
//   db.query(
//     "UPDATE sections SET name = ?, description = ?, section = ?, department = ? WHERE id = ?",
//     [name, description, section, department, id],
//     (err, results) => {
//       if (err) {
//         res.status(500).json({ error: err.message });
//         return;
//       }
//       res.status(200).send("Section updated");
//     }
//   );
// });

// Get all titles
app.get("/titles", (req, res) => {
  db.query("SELECT * FROM titles", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json(results);
  });
});

// Add a new title
app.post("/titles", (req, res) => {
  const { titleName, deptSection, til } = req.body;
  if (!titleName || !deptSection || !til) {
    res
      .status(400)
      .json({ error: "Title name, department section, and til are required" });
    return;
  }
  db.query(
    "INSERT INTO titles (titleName, deptSection, til) VALUES (?, ?, ?)",
    [titleName, deptSection, til],
    (err, results) => {
      if (err) {
        console.error("Error saving title:", err);
        res.status(500).json({ error: err.message });
        return;
      }
      console.log("Title saved successfully");
      res.status(201).json({ id: results.insertId });
    }
  );
});

// Delete a title
app.delete("/titles/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM titles WHERE id = ?", [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send("Title deleted");
    }
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
