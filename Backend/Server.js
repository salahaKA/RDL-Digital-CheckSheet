const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
const port = 3001;

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Salaha@07root",
  database: "mydatabase",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

app.use(bodyParser.json());
app.use(cors());

// Default route for testing server
app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// Admin credentials
const adminEmail = "adminorg@example.com";
const adminPassword = "adminorg123"; // You should hash this password

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (email === adminEmail && password === adminPassword) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "SELECT * FROM adminlogin WHERE email = ?";
    db.execute(query, [email], (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        res.status(500).json({ error: "Database error" });
        return;
      }

      if (results.length === 0) {
        const insertQuery =
          "INSERT INTO adminlogin (email, password) VALUES (?, ?)";
        db.execute(
          insertQuery,
          [email, hashedPassword],
          (err, insertResult) => {
            if (err) {
              console.error("Database insert error:", err);
              res.status(500).json({ error: "Database error" });
              return;
            }

            res
              .status(200)
              .json({ message: "Login successful and credentials stored" });
          }
        );
      } else {
        res.status(200).json({ message: "Login successful" });
      }
    });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Department APIs

// Get all departments
app.get("/departments", (req, res) => {
  const query = "SELECT * FROM department";
  db.execute(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(200).json(results);
  });
});

// Add a new department
app.post("/departments", (req, res) => {
  const { name, description } = req.body;
  const query = "INSERT INTO department (name, description) VALUES (?, ?)";
  db.execute(query, [name, description], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res
      .status(201)
      .json({ message: "Department added", departmentId: results.insertId });
  });
});

// Update a department

app.put("/departments/:id", (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const query = "UPDATE department SET name = ?, description = ? WHERE id = ?";
  db.execute(query, [name, description, id], (err) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    // Update department name in the sections table
    const updateSectionsQuery =
      "UPDATE sections SET department = ? WHERE department = (SELECT name FROM department WHERE id = ?)";
    db.execute(updateSectionsQuery, [name, id], (err) => {
      if (err) {
        console.error("Error updating sections:", err);
        res.status(500).json({ error: "Database error" });
        return;
      }
      res.status(200).json({ message: "Department updated" });
    });
  });
});

app.get("/departments", (req, res) => {
  const query = "SELECT * FROM departments";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(200).json(results);
  });
});

// Delete a department
app.delete("/departments/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM department WHERE id = ?";
  db.execute(query, [id], (err) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(200).json({ message: "Department deleted" });
  });
});

// Get all sections
app.get("/sections", (req, res) => {
  const query = "SELECT * FROM sections";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(200).json(results);
  });
});

// Add a new section
app.post("/sections", (req, res) => {
  const { department, section, description } = req.body;
  const query =
    "INSERT INTO sections (department, section, description) VALUES (?, ?, ?)";
  db.query(query, [department, section, description], (err, result) => {
    if (err) {
      console.error("Database insert error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res
      .status(200)
      .json({ message: "Section added successfully", id: result.insertId });
  });
});

// Update an existing section
app.put("/sections/:id", (req, res) => {
  const { department, section, description } = req.body;
  const { id } = req.params;
  const query =
    "UPDATE sections SET department = ?, section = ?, description = ? WHERE id = ?";
  db.query(query, [department, section, description, id], (err) => {
    if (err) {
      console.error("Database update error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(200).json({ message: "Section updated successfully" });
  });
});

// Delete a section
app.delete("/sections/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM sections WHERE id = ?";
  db.query(query, [id], (err) => {
    if (err) {
      console.error("Database delete error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(200).json({ message: "Section deleted successfully" });
  });
});

// Get all sections
app.get("/sections", (req, res) => {
  const query = "SELECT * FROM sections";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(200).json(results);
  });
});

// Get all titles
app.get("/titles", (req, res) => {
  const query = "SELECT * FROM titles";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(200).json(results);
  });
});

// Add a new title
app.post("/titles", (req, res) => {
  const { title, department, section } = req.body;

  // Check if all necessary fields are provided
  if (!title || !department || !section) {
    res
      .status(400)
      .json({ error: "Title, department, and section are required" });
    return;
  }

  const query =
    "INSERT INTO titles (title, department, section) VALUES (?, ?, ?)";

  db.query(query, [title, department, section], (err, result) => {
    if (err) {
      console.error("Database insert error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }

    res
      .status(201)
      .json({ message: "Title added successfully", id: result.insertId });
  });
});

// Update an existing title
app.put("/titles/:id", (req, res) => {
  const { title, department, section } = req.body;
  const id = parseInt(req.params.id); // Convert id to a number

  // Check if all necessary fields are provided
  if (!title || !department || !section) {
    res
      .status(400)
      .json({ error: "Title, department, and section are required" });
    return;
  }

  const query =
    "UPDATE titles SET title = ?, department = ?, section = ? WHERE id = ?";
  db.query(query, [title, department, section, id], (err) => {
    if (err) {
      console.error("Database update error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(200).json({ message: "Title updated successfully" });
  });
});

app.delete("/titles/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM titles WHERE id = ?";
  db.query(query, [id], (err) => {
    if (err) {
      console.error("Database delete error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(200).json({ message: "Title deleted successfully" });
  });
});
// Get sections by department
app.get("/sections/:department", (req, res) => {
  const { department } = req.params;
  const query = "SELECT * FROM sections WHERE department = ?";
  db.query(query, [department], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(200).json(results);
  });
});

// Get all headings
app.get("/headings", (req, res) => {
  const query = "SELECT * FROM headings";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(200).json(results);
  });
});

// Add a new heading
app.post("/headings", (req, res) => {
  const { department, section, title, heading } = req.body;
  const query =
    "INSERT INTO headings (department, section, title, heading) VALUES (?, ?, ?, ?)";
  db.query(query, [department, section, title, heading], (err, result) => {
    if (err) {
      console.error("Database insert error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(200).json({
      message: "Heading added successfully",
      headingId: result.insertId,
    });
  });
});

// Update an existing heading
app.put("/headings/:id", (req, res) => {
  const { department, section, title, heading } = req.body;
  const { id } = req.params;
  const query =
    "UPDATE headings SET department = ?, section = ?, title = ?, heading = ? WHERE id = ?";
  db.query(query, [department, section, title, heading, id], (err) => {
    if (err) {
      console.error("Database update error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(200).json({ message: "Heading updated successfully" });
  });
});

// Delete a heading
app.delete("/headings/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM headings WHERE id = ?";
  db.query(query, [id], (err) => {
    if (err) {
      console.error("Database delete error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(200).json({ message: "Heading deleted successfully" });
  });
});

// Templates APIs
app.get("/templates", (req, res) => {
  const query = "SELECT * FROM templates";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(200).json(results);
  });
});

app.post("/templates", (req, res) => {
  const { title, heading, template, questions } = req.body;
  const query =
    "INSERT INTO templates (title, heading, template, questions) VALUES (?, ?, ?, ?)";
  db.execute(
    query,
    [title, heading, template, JSON.stringify(questions)],
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        res.status(500).json({ error: "Database error" });
        return;
      }
      res
        .status(201)
        .json({ message: "Template added", templateId: results.insertId });
    }
  );
});

app.put("/templates/:id", (req, res) => {
  const { id } = req.params;
  const { title, heading, template, questions } = req.body;
  const query =
    "UPDATE templates SET title = ?, heading = ?, template = ?, questions = ? WHERE id = ?";
  db.execute(
    query,
    [title, heading, template, JSON.stringify(questions), id],
    (err) => {
      if (err) {
        console.error("Database query error:", err);
        res.status(500).json({ error: "Database error" });
        return;
      }
      res.status(200).json({ message: "Template updated" });
    }
  );
});

app.delete("/templates/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM templates WHERE id = ?";
  db.execute(query, [id], (err) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(200).json({ message: "Template deleted" });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
