import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    organizationId: "",
    email: "",
    password: "",
    image: null
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    organizationId: "",
    email: "",
    password: "",
    image: ""
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const API_URL = "http://localhost:3001"; // Replace with your backend server URL

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
    validateField(name, value);
  };
  
  const handleFileChange = (e) => {
    setNewUser({ ...newUser, image: e.target.files[0] });
    setErrors({ ...errors, image: "" });
  };

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
      case "lastName":
      case "address":
        if (!value.trim()) {
          setErrors({ ...errors, [name]: `${name} cannot be empty` });
        } else {
          setErrors({ ...errors, [name]: "" });
        }
        break;
      case "phone":
        if (!/^\d{10}$/.test(value)) {
          setErrors({ ...errors, phone: "Phone number must be a 10-digit number" });
        } else {
          setErrors({ ...errors, phone: "" });
        }
        break;
      case "email":
        if (!/^\S+@\S+\.\S+$/.test(value)) {
          setErrors({ ...errors, email: "Email must be a valid email address" });
        } else {
          setErrors({ ...errors, email: "" });
        }
        break;
      case "password":
        if (!value.trim()) {
          setErrors({ ...errors, password: "Password cannot be empty" });
        } else {
          setErrors({ ...errors, password: "" });
        }
        break;
      case "organizationId":
        if (!value.trim()) {
          setErrors({ ...errors, organizationId: "Organization ID cannot be empty" });
        } else {
          setErrors({ ...errors, organizationId: "" });
        }
        break;
      case "image":
        if (!value) {
          setErrors({ ...errors, image: "Image is required" });
        } else {
          setErrors({ ...errors, image: "" });
        }
        break;
      default:
        break;
    }
  };

  const addUser = async () => {
    if (validateForm()) {
      const formData = new FormData();
      formData.append("firstName", newUser.firstName);
      formData.append("lastName", newUser.lastName);
      formData.append("address", newUser.address);
      formData.append("phone", newUser.phone);
      formData.append("organizationId", newUser.organizationId);
      formData.append("email", newUser.email);
      formData.append("password", newUser.password);
      formData.append("image", newUser.image);

      try {
        await axios.post(`${API_URL}/api/users`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        fetchUsers();
        resetForm();
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }
  };

  const editUser = async () => {
    if (validateForm()) {
      const formData = new FormData();
      formData.append("firstName", newUser.firstName);
      formData.append("lastName", newUser.lastName);
      formData.append("address", newUser.address);
      formData.append("phone", newUser.phone);
      formData.append("organizationId", newUser.organizationId);
      formData.append("email", newUser.email);
      formData.append("password", newUser.password);
      formData.append("image", newUser.image);

      try {
        await axios.put(`${API_URL}/api/users/${currentUserId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        fetchUsers();
        resetForm();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  const validateForm = () => {
    const requiredFields = ["firstName", "lastName", "address", "phone", "organizationId", "email", "password", "image"];
    let isValid = true;
    requiredFields.forEach((field) => {
      if (field === "image") {
        if (!newUser[field]) {
          setErrors({ ...errors, [field]: "Image is required" });
          isValid = false;
        }
      } else {
        if (!newUser[field]?.trim()) {
          setErrors({ ...errors, [field]: `${field} cannot be empty` });
          isValid = false;
        }
      }
    });
    return isValid;
  };

  const resetForm = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentUserId(null);
    setNewUser({
      firstName: "",
      lastName: "",
      address: "",
      phone: "",
      organizationId: "",
      email: "",
      password: "",
      image: null
    });
    setErrors({
      firstName: "",
      lastName: "",
      address: "",
      phone: "",
      organizationId: "",
      email: "",
      password: "",
      image: ""
    });
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setIsAdding(false);
    setCurrentUserId(user.id);
    setNewUser({
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      phone: user.phone,
      organizationId: user.organizationId,
      email: user.email,
      password: "", // Password should not be pre-filled for security reasons
      image: user.image,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
    }
  };

  return (
  <div className="users-container">
    <div className="users-header">
      <h2>USERS</h2>
      {!isAdding && !isEditing && (
        <button className="add-btn" onClick={() => setIsAdding(true)}>
          Add User
        </button>
      )}
    </div>
    {isAdding || isEditing ? (
      <div className="users-form">
        <h3>{isEditing ? "Edit User" : "Add New User"}</h3>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={newUser.firstName}
          onChange={handleInputChange}
        />
        {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={newUser.lastName}
          onChange={handleInputChange}
        />
        {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={newUser.address}
          onChange={handleInputChange}
        />
        {errors.address && <span className="error-message">{errors.address}</span>}
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={newUser.phone}
          onChange={handleInputChange}
        />
        {errors.phone && <span className="error-message">{errors.phone}</span>}
        <input
          type="text"
          name="organizationId"
          placeholder="Organization ID"
          value={newUser.organizationId}
          onChange={handleInputChange}
        />
        {errors.organizationId && <span className="error-message">{errors.organizationId}</span>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleInputChange}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={newUser.password}
          onChange={handleInputChange}
        />
        {errors.password && <span className="error-message">{errors.password}</span>}
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
        />
        {errors.image && <span className="error-message">{errors.image}</span>}
        
        <div className="form-buttons">
          <button className="add-btn" onClick={isEditing ? editUser : addUser}>
            {isEditing ? "Update User" : "Add User"}
          </button>
          <button className="cancel-btn" onClick={resetForm}>Cancel</button>
        </div>
      </div>
    ) : (
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Organization ID</th>
            <th>Email</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.address}</td>
              <td>{user.phone}</td>
              <td>{user.organizationId}</td>
              <td>{user.email}</td>
              <td><img src={`http://localhost:3001/${user.image}`} alt="User" width="50" height="50" /></td>
              <td className="users-actions">
                <button className="edit-btn" onClick={() => handleEdit(user)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

}

export default Users;
