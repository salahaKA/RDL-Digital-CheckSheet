const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const session = require("express-session");


const app = express();
const port = 3001;

// Database configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Kska@07root",
  database: "mydatabase",
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Test the MySQL connection
function testConnection() {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection failed:", err);
      if (connection) {
        connection.release();
      }
      return;
    }
    console.log("Connected to the database");
    connection.release();
  });
}

testConnection(); // Test the connection when the server starts

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Ensure to create this 'uploads' directory in your project
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize MySQL tables and insert super admin credentials
function initDatabase() {
  const organizationsTable = `
        CREATE TABLE IF NOT EXISTS organizations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            address VARCHAR(255) NOT NULL,
            phone_number VARCHAR(50) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            person_name VARCHAR(255) NOT NULL,
            logo VARCHAR(255) NOT NULL
        );
    `;

  const loginTable = `
        CREATE TABLE IF NOT EXISTS login (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        );
    `;

  const admin_LoginTable = `
        CREATE TABLE IF NOT EXISTS admin_login (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        );
    `;

  pool.query(organizationsTable, (err, results) => {
    if (err) {
      console.error("Error creating organizations table:", err);
    } else {
      console.log("Organizations table created or already exists");
    }
  });

  pool.query(loginTable, (err, results) => {
    if (err) {
      console.error("Error creating login table:", err);
    } else {
      console.log("Login table created or already exists");
      // Insert super admin credentials if they do not exist
      const superAdminEmail = "rdltech@gmail.com";
      const superAdminPassword = "rdltech987";
      const hashedPassword = bcrypt.hashSync(superAdminPassword, 10); // Synchronous hashing for simplicity
      const query = `
                INSERT INTO login (email, password)
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE email=email
            `;
      pool.query(query, [superAdminEmail, hashedPassword], (err, results) => {
        if (err) {
          console.error("Error inserting super admin credentials:", err);
        } else {
          console.log("Super admin credentials inserted or already exist");
        }
      });
    }
  });

  pool.query(admin_LoginTable, (err, results) => {
    if (err) {
      console.error("Error creating admin_login table:", err);
    } else {
      console.log("Admin login table created or already exists");
    }
  });
}

initDatabase(); // Initialize the database

// Default route for testing server
app.get("/", (req, res) => {
  res.send("Backend server is running");
});



// Middleware to log admin activities
function logAdminActivity(email, action) {
  if (action === "login") {
      // Exclude logging for super admin login
      if (email === "rdltech@gmail.com") {
          return; // Skip logging for super admin login
      }

      // Fetch organization name based on email
      const getOrgQuery = "SELECT name FROM organizations WHERE email = ?";
      pool.query(getOrgQuery, [email], (err, results) => {
          if (err) {
              console.error(Error `fetching organization name for ${email}:`, err);
              return;
          }

          if (results.length > 0) {
              const { name } = results[0];

              // Log admin login with organization name
              const logQuery = `
                  INSERT INTO logs (name, email, login_time, status)
                  VALUES (?, ?, CURRENT_TIMESTAMP, ?)
              `;
              pool.query(logQuery, [name, email, "logged in"], (err, results) => {
                  if (err) {
                      console.error(`Error logging ${action} activity for ${email}:`, err);
                  } else {
                      console.log(`${action} activity logged for ${email}`);
                  }
              });
          } else {
              console.error(`Organization not found for email: ${email}`);
          }
      });
  } else if (action === "logout") {
      // Log admin logout
      const logQuery = `
          UPDATE logs
          SET logout_time = CURRENT_TIMESTAMP, status = 'logged out'
          WHERE email = ? AND logout_time IS NULL
      `;
      pool.query(logQuery, [email], (err, results) => {
          if (err) {
              console.error(Error `logging ${action} activity for ${email}:`, err);
          } else {
              console.log(`${action} activity logged for ${email}`);
          }
      });
  }
}

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  // Explicitly check for rdltech super admin credentials (if needed)
  if (email === "rdltech@gmail.com" && password === "rdltech987") {
    logAdminActivity(email, "login"); // Log login activity
    return res
      .status(200)
      .json({ message: "Logged in successfully", role: "super_admin" });
  }

  // Check if user exists in the login table (super admin)
  let query = "SELECT * FROM login WHERE email = ?";
  pool.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Error fetching login:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      // If login exists, compare passwords
      const superAdmin = results[0];
      const match = await bcrypt.compare(password, superAdmin.password);
      if (match) {
        logAdminActivity(email, "login"); // Log login activity
        return res
          .status(200)
          .json({ message: "Logged in successfully", role: "super_admin" });
      } else {
        return res.status(400).json({ error: "Invalid credentials" });
      }
    } else {
      // Check if user exists in the admin_login table (admin)
      query = "SELECT * FROM admin_login WHERE email = ?";
      pool.query(query, [email], async (err, results) => {
        if (err) {
          console.error("Error fetching admin login:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length > 0) {
          const admin = results[0];
          const match = await bcrypt.compare(password, admin.password);
          if (match) {
            logAdminActivity(email, "login"); // Log login activity
            return res
              .status(200)
              .json({ message: "Logged in successfully", role: "admin" });
          } else {
            return res.status(400).json({ error: "Invalid credentials" });
          }
        } else {
          // Check if user exists in the user_login table (user)
          query = "SELECT * FROM user_login WHERE email = ?";
          pool.query(query, [email], async (err, results) => {
            if (err) {
              console.error("Error fetching user login:", err);
              return res.status(500).json({ error: "Internal server error" });
            }

            if (results.length > 0) {
              const user = results[0];
              const match = await bcrypt.compare(password, user.password);
              
              // Check if user is verified
              if (!user.verified) {
                return res.status(403).json({ error: "User not verified" });
              }
              
              if (match) {
                return res
                  .status(200)
                  .json({ message: "Logged in successfully", role: "user" });
              } else {
                return res.status(400).json({ error: "Invalid credentials" });
              }
            } else {
              return res.status(400).json({ error: "Invalid credentials" });
            }
          });
        }
      });
    }
  });
});


// Admin logout endpoint
app.post("/api/logout", async (req, res) => {
  const { email } = req.body;

  logAdminActivity(email, "logout"); // Log admin activity
  return res.status(200).json({ message: "Logged out successfully" });
});

// Department APIs

// Get all departments
app.get("/departments", (req, res) => {
  const query = "SELECT * FROM department";
  pool.execute(query, (err, results) => {
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
  pool.execute(query, [name, description], (err, results) => {
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
  pool.execute(query, [name, description, id], (err) => {
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
  pool.query(query, (err, results) => {
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
  pool.execute(query, [id], (err) => {
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
  pool.query(query, (err, results) => {
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
  pool.query(query, [department, section, description], (err, result) => {
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
  pool.query(query, [department, section, description, id], (err) => {
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
  pool.query(query, [id], (err) => {
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
  pool.query(query, (err, results) => {
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
  pool.execute(query, [department, section, title], (err, results) => {
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
  pool.query(query, (err, results) => {
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
  pool.execute(query, [id], (err) => {
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
  pool.query(query, [title, department, section, id], (err) => {
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
  pool.query(query, [id], (err, results) => {
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



app.post("/headings", (req, res) => {
  console.log("Request received:", req.body);
  const { department, section, title, heading, label_number, labels } = req.body;
  const query = `
    INSERT INTO headings (department, section, title, heading, label_number, labels) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  pool.execute(query, [department, section, title, heading, label_number, labels], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(201).json({ message: "Heading added", headingId: results.insertId });
  });
});

app.get("/headings", (req, res) => {
  const query = "SELECT * FROM headings";
  pool.query(query, (err, results) => {
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
  pool.query(query, [heading, title, department, section, id], (err) => {
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
  pool.execute(query, [id], (err) => {
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
  pool.query(query, (err, results) => {
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
      SELECT t.*, h.department, h.section, h.labels, h.label_number AS labelnumber
      FROM templates t
      LEFT JOIN headings h ON t.title = h.title 
      WHERE t.id = ?`;

  pool.execute(query, [id], (err, results) => {
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
  pool.execute(
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
  pool.execute(
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
  pool.execute(query, [id], (err) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.status(200).json({ message: "Template deleted" });
  });
});

// ------------SUPER ADMIN--------------

// Add organization
app.post("/api/organizations", upload.single("logo"), async (req, res) => {
  const { name, address, phone_number, email, password, person_name } =
    req.body;
  const logo = req.file ? req.file.path : ""; // Assuming logo path is stored in the 'uploads' directory

  try {
    // Insert into organizations table with plaintext password
    const query1 = `INSERT INTO organizations (name, address, phone_number, email, password, person_name, logo)
                      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    pool.query(
      query1,
      [name, address, phone_number, email, password, person_name, logo],
      async (err, results) => {
        if (err) {
          console.error("Error adding organization:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        // Insert into admin_login table with hashed password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
        const query2 = `INSERT INTO admin_login (email, password)
                          VALUES (?, ?)`;
        pool.query(query2, [email, hashedPassword], (err, results) => {
          if (err) {
            console.error("Error adding admin login:", err);
            return res.status(500).json({ error: "Internal server error" });
          }
          console.log("Organization and admin login added successfully");
          res.status(200).json({
            message: "Organization and admin login added successfully",
          });
        });
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update organization
app.put("/api/organizations/:id", upload.single("logo"), (req, res) => {
  const { id } = req.params;
  const { name, address, phone_number, email, password, person_name } =
    req.body;
  const logo = req.file ? req.file.path : ""; // Assuming logo path is stored in the 'uploads' directory
  const query = `UPDATE organizations
                 SET name=?, address=?, phone_number=?, email=?, password=?, person_name=?, logo=?
                 WHERE id=?`;
  pool.query(
    query,
    [name, address, phone_number, email, password, person_name, logo, id],
    (err, results) => {
      if (err) {
        console.error("Error updating organization:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      console.log("Organization updated successfully");
      res.status(200).json({ message: "Organization updated successfully" });
    }
  );
});

// Delete organization
app.delete("/api/organizations/:id", (req, res) => {
  const { id } = req.params;

  // First, fetch the email associated with the organization
  const getEmailQuery = "SELECT email FROM organizations WHERE id=?";
  pool.query(getEmailQuery, [id], (err, results) => {
    if (err) {
      console.error("Error fetching organization for deletion:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Organization not found" });
    }

    const email = results[0].email;

    // Delete from organizations table
    const deleteOrgQuery = "DELETE FROM organizations WHERE id=?";
    pool.query(deleteOrgQuery, [id], (err, results) => {
      if (err) {
        console.error("Error deleting organization:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Delete from admin_login table
      const deleteAdminQuery = "DELETE FROM admin_login WHERE email=?";
      pool.query(deleteAdminQuery, [email], (err, results) => {
        if (err) {
          console.error("Error deleting admin login:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        console.log(
          "Organization and associated admin login deleted successfully"
        );
        res.status(200).json({
          message:
            "Organization and associated admin login deleted successfully",
        });
      });
    });
  });
});

// Fetch organizations
app.get("/api/organizations", (req, res) => {
  const query = "SELECT * FROM organizations";
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching organizations:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json(results);
  });
});

// Fetch logs
app.get('/api/logs', (req, res) => {
  const query = "SELECT * FROM logs ORDER BY date DESC";
  pool.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching logs:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }
      res.status(200).json(results);
  });
});

// Fetch today's login count
app.get('/api/today-logins', (req, res) => {
  // Assuming you have a 'logs' table where login activities are logged
  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

  const query = 'SELECT COUNT(*) AS count FROM logs WHERE DATE(date) = ?';
  pool.query(query, [today], (err, results) => {
      if (err) {
          console.error('Error fetching today\'s logins:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length > 0) {
          const { count } = results[0];
          res.status(200).json({ count });
      } else {
          res.status(200).json({ count: 0 }); // Return 0 if no logins found today
      }
  });
});

// File upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res
    .status(200)
    .json({ message: "File uploaded successfully", filePath: req.file.path });
});




// Admin User creation
app.post('/api/users', upload.single('image'), async (req, res) => {
  try {
    const { firstName, lastName, phone, organizationId, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const image = req.file.path;

    const query = 'INSERT INTO users (firstName, lastName, phone, organization_id, email, password, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [firstName, lastName, phone, organizationId, email, hashedPassword, image];

    connection.query(query, values, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error adding user' });
      }
      res.status(201).json({ message: 'User added successfully', userId: results.insertId });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
//---------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------


app.get('/api/departments', (req, res) => {
  pool.query('SELECT id, name FROM department', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});




app.post('/api/user_login/register', (req, res) => {
  const { firstName, lastName, phone, departmentId, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const query = 'INSERT INTO user_login (firstName, lastName, phone, department_id, email, password) VALUES (?, ?, ?, ?, ?, ?)';
  
  pool.query(query, [firstName, lastName, phone, departmentId, email, hashedPassword], (err, results) => {
    if (err) {
      console.error('Database Error:', err);  // Log the error details
      res.status(500).json({ error: 'Database error' });
      return;
    }
    res.status(201).json({ message: 'User registered successfully' });
  });
});

app.get('/templates', async (req, res) => {
  const departmentId = req.query.departmentId;

  try {
    // Fetch templates filtered by departmentId
    const templates = await db.query(
      'SELECT * FROM templates WHERE department_id = ?',
      [departmentId]
    );

    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).send('Error fetching templates');
  }
});


app.get('/templates', (req, res) => {
  const { department } = req.query;
  const query = `
    SELECT t.*
    FROM templates t
    JOIN headings h ON t.heading = h.heading
    WHERE h.department = ?`;
  connection.query(query, [department], (error, results) => {
    if (error) {
      console.error('Error fetching templates:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

//take department for template
app.get("/departments", (req, res) => {
  const query = "SELECT DISTINCT department FROM headings";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching departments:", err);
      res.status(500).send("Error fetching departments");
      return;
    }
    res.json(results);
  });
});


// Endpoint to check if a heading corresponding to a selected department exists in the templates table
app.get('/check-heading', (req, res) => {
  const { department } = req.query;

  if (!department) {
    return res.status(400).json({ message: 'Department is required' });
  }

  // Query for the heading in the headings table based on the selected department
  pool.query(
    'SELECT heading FROM headings WHERE department = ? LIMIT 1',
    [department],
    (err, headingResults) => {
      if (err) {
        console.error("Error fetching heading:", err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (headingResults.length === 0) {
        return res.status(404).json({ message: 'No heading found for the selected department' });
      }

      const heading = headingResults[0].heading;

      // Check if the heading exists in the templates table
      pool.query(
        'SELECT * FROM templates WHERE heading = ?',
        [heading],
        (err, templateResults) => {
          if (err) {
            console.error("Error checking templates:", err);
            return res.status(500).json({ message: 'Internal server error' });
          }

          if (templateResults.length === 0) {
            return res.status(404).json({ message: 'Heading not found in templates table' });
          }

          res.status(200).json({ message: 'Heading found in templates table', templates: templateResults });
        }
      );
    }
  );
});


app.get('/checklists', (req, res) => {
  const { department } = req.query;

  if (!department) {
    return res.status(400).json({ message: 'Department is required' });
  }

  // Query for templates based on the department
  pool.query(
    'SELECT t.* FROM templates t JOIN headings h ON t.heading = h.heading WHERE h.department = ?',
    [department],
    (err, results) => {
      if (err) {
        console.error("Error fetching checklists:", err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'No checklists available for the selected department' });
      }

      res.status(200).json(results);
    }
  );
});

app.get('/api/user_login', (req, res) => {
  const query = 'SELECT * FROM user_login';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Database error' });
      return;
    }
    res.json(results);
  });
});



//-------------------------------------------------------------------------------------------
//admin_user


app.get('/api/user_login/unverified', (req, res) => {
  const query = 'SELECT * FROM user_login WHERE verified = FALSE';
  
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching unverified users:', err);
      res.status(500).json({ error: 'Database error' });
      return;
    }
    res.json(results);
  });
});


app.get('/api/user_login', (req, res) => {
  const query = 'SELECT * FROM user_login WHERE verified = TRUE';
  
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Database error' });
      return;
    }
    res.json(results);
  });
});

app.put('/api/user_login/verify/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'UPDATE user_login SET verified = TRUE WHERE id = ?';

  pool.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error verifying user:', err);
      return res.status(500).json({ error: 'Database error during verification' });
    }

    res.json({ message: 'User verified successfully' });
  });
});


//Checklist backend
app.get('/templates', (req, res) => {
  pool.query('SELECT * FROM templates', (err, results) => {
    if (err) {
      console.error('Error fetching templates:', err);
      return res.status(500).json({ error: 'Failed to fetch templates' });
    }
    res.json(results);
  });
});

app.post('/api/submit-checklist', async (req, res) => {
  const { userId, templateId, responseData, date, deptId } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO response (user_id, template_id, response_data, created_at, dept_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, templateId, responseData, date, deptId]
    );
    res.status(201).json({ message: 'Checklist submitted successfully' });
  } catch (error) {
    console.error("Error submitting checklist:", error);
    res.status(500).json({ error: 'Failed to submit checklist' });
  }
});

// User response
// Assuming you have express set up
app.post('/submit-checklist', (req, res) => {
  const { user_id, department, responses } = req.body;

  // Convert responses object to JSON string
  const response_data = JSON.stringify(responses);

  const sql = 'INSERT INTO response (user_id, template_id, response_data) VALUES (?, ?, ?)';
  
  Object.keys(responses).forEach(templateId => {
    db.query(sql, [user_id, templateId, response_data], (err, result) => {
      if (err) {
        console.error('Error inserting response:', err);
        return res.status(500).json({ error: 'Failed to save response' });
      }
    });
  });

  res.json({ message: 'Response saved successfully' });
});

app.get('/get-responses', (req, res) => {
  const sql = 'SELECT * FROM response';
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching responses:', err);
      return res.status(500).json({ error: 'Failed to fetch responses' });
    }
    
    res.json(results);
  });
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
