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

//-----------------------------------------------------------------------------------------------------------------------------------------------
// Login API
// Admin credentials----------------------------------------------------------------------------------------------------------------------------
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
    res.status(200).json({ message: "Department updated" });
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

// Add a new title
// Add a new title
app.post("/titles", (req, res) => {
  console.log("Request received:", req.body); // Add this line
  const { department, section, title } = req.body;
  const query =
    "INSERT INTO titles (department, section, title) VALUES (?, ?, ?)";
  db.execute(query, [department, section, title], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(201).json({ message: "Title added", titleId: results.insertId });
  });
});

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

// Delete a title
app.delete("/titles/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM titles WHERE id = ?";
  db.execute(query, [id], (err) => {
    if (err) {
      console.error("Database delete error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(200).json({ message: "Title deleted successfully" });
  });
});

// Update a title
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

// Get a single title for editing
app.get("/titles/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM titles WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: "Title not found" });
      return;
    }
    res.status(200).json(results[0]); // Send the first (and only) result as JSON
  });
});

//heading
app.post("/headings", (req, res) => {
  console.log("Request received:", req.body); // Add this line
  const { department, section, title, heading } = req.body;
  const query =
    "INSERT INTO headings (department, section, title ,heading) VALUES (?, ?, ? ,?)";
  db.execute(query, [department, section, title, heading], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res
      .status(201)
      .json({ message: "heading added", titleId: results.insertId });
  });
});

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

app.put("/headings/:id", (req, res) => {
  const { heading, title, department, section } = req.body;
  const id = parseInt(req.params.id); // Convert id to a number

  // Check if all necessary fields are provided
  if (!title || !department || !section || !heading) {
    res
      .status(400)
      .json({ error: "heading,Title, department, and section are required" });
    return;
  }

  const query =
    "UPDATE headings SET heading = ?, title = ?, department = ?, section = ? WHERE id = ?";
  db.query(query, [heading, title, department, section, id], (err) => {
    if (err) {
      console.error("Database update error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(200).json({ message: "Title updated successfully" });
  });
});

app.delete("/headings/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM headings WHERE id = ?";
  db.execute(query, [id], (err) => {
    if (err) {
      console.error("Database delete error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(200).json({ message: "heading deleted successfully" });
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

app.get("/api/template/:id", (req, res) => {
  const { id } = req.params;
  const query = `
      SELECT t.*, h.department, h.section 
      FROM templates t
      LEFT JOIN headings h ON t.title = h.title 
      WHERE t.id = ?`;

  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }

    if (results.length > 0) {
      const template = results[0];
      try {
        // Validate and parse the questions field
        if (typeof template.questions === "string") {
          template.questions = JSON.parse(template.questions);
        }
        res.status(200).json(template);
      } catch (parseError) {
        console.error("Error parsing questions JSON:", parseError);
        res.status(500).json({ error: "Invalid format for questions" });
      }
    } else {
      res.status(404).json({ error: "Template not found" });
    }
  });
});

app.post("/templates", (req, res) => {
  const {
    title,
    heading,
    template,
    question_type,
    question_number,
    questions,
  } = req.body;

  if (!Array.isArray(questions)) {
    return res.status(400).json({ error: "Questions should be an array" });
  }

  if (question_type === "mcq") {
    for (const question of questions) {
      if (!question.options || !Array.isArray(question.options)) {
        return res
          .status(400)
          .json({ error: "MCQ questions should have an options array" });
      }
    }
  }

  const query =
    "INSERT INTO templates (title, heading, template, question_type, question_number, questions) VALUES (?, ?, ?, ?, ?, ?)";
  db.execute(
    query,
    [
      title,
      heading,
      template,
      question_type,
      question_number,
      JSON.stringify(questions),
    ],
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
  const {
    title,
    heading,
    template,
    question_type,
    question_number,
    questions,
  } = req.body;

  if (!Array.isArray(questions)) {
    return res
      .status(400)
      .json({ error: "Invalid format for questions. It should be an array." });
  }

  const query =
    "UPDATE templates SET title = ?, heading = ?, template = ?, question_type = ?, question_number = ?, questions = ? WHERE id = ?";
  db.execute(
    query,
    [
      title,
      heading,
      template,
      question_type,
      question_number,
      JSON.stringify(questions),
      id,
    ],
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

//---------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
