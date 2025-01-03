RDL DCS
MCA Final Year Internship Project Under RDL Technologies Pvt Ltd, Sahyadri Campus, 5th floor, Mangalore, Karnataka

Digital Checksheet Management System
This project is a Digital Checksheet Management System designed to streamline checklist creation, management, and tracking. It caters to multiple roles such as Super Admin, Admin, and Users, providing specific functionalities for each role.

--------------------------------------------
Features
Super Admin Module: Manage organizations and monitor system-wide logs.
Admin Module: Manage users, checklists, departments, and generate reports.
User Module: Access and complete assigned checklists.
Role-based dashboards and views for better data visualization.
Integration of daily, weekly, and monthly checklists.
Responsive and modern design using React and Material-UI.
-----------------------------------------------------
Directory Structure:
Root
salahaKA-RDL-Digital-CheckSheet/  
├── Backend/           # Backend server and logic  
└── digital-checksheet/ # React frontend application  

Backend
Backend/  
├── Server.js           # Main server file  
├── package.json        # Backend dependencies  
├── uploads/            # Uploaded files  
│   ├── [image files]   # Sample uploaded images  
└── .gitignore          # Ignored backend files  

Frontend
digital-checksheet/  
├── public/             # Public files (index.html, manifest, etc.)  
├── src/                # Source files  
│   ├── Admin/          # Admin-specific components and pages  
│   ├── Assests/        # Shared assets like images or icons  
│   ├── Layout/         # Layout components for consistent structure  
│   ├── SuperAdmin/     # Super Admin-specific components and pages  
│   ├── user/           # User-specific components and pages  
└── .gitignore          # Ignored frontend files  

---------------------------------------------------------------------------------------------------

Key Components
Backend (Node.js and Express)
Handles API routes for authentication, checklist management, and uploads.
Stores checklist data, user roles, and organization details in a MySQL database.
Frontend (React)
Admin Module:
Manage users (Users.js), checklists (Checklist.js), and master data (Master.js).
View reports and analytics via the dashboard (Dashboard.js).
Super Admin Module:
Manage organizations (Organization.js) and logs (Logs.js).
User Module:
Access, submit, and track checklists (UserChecklist.js).
Layout
AppLayout.js, Header.js, and MainLayout.js provide consistent structure and navigation.
-------------------------------------------------------------------------------------------------------

Technology Used:
Frontend: React.js, CSS, MUI
Backend: Express, Node.js
DB: MySql 8.0
APIs: RESTful API
Version Control: Git
IDE: VS Code Editor, postman and MySql Shell
---------------------------------------------------------

Setup Instructions
Prerequisites
Node.js and npm installed.
MySQL server configured and running.

Database Setup
Configure MySQL database and import the necessary tables for users, checklists, and organizations.

Access the Application
Frontend: http://localhost:3000
Backend API: http://localhost:3001
--------------------------------------------------------------------
License
This project is licensed under the MIT License.

-------------------------------------------------------------------
Auther
https://github.com/salahaKA
