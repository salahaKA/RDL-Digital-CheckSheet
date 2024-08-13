import React, { useState, useEffect } from "react";
import axios from "axios";
import { RiEdit2Fill, RiDeleteBinFill } from 'react-icons/ri';
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    organizationId: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const API_URL = "http://localhost:3001";

  useEffect(() => {
    fetchUsers();
    fetchUnverifiedUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user_login`);
      setUsers(response.data.filter(user => user.verified));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchUnverifiedUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user_login/unverified`);
      setUnverifiedUsers(response.data);
    } catch (error) {
      console.error("Error fetching unverified users:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const editUser = async () => {
    if (validateForm()) {
      try {
        await axios.put(`${API_URL}/api/user_login/${currentUserId}`, newUser);
        fetchUsers();
        resetForm();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  const validateForm = () => {
    return true;
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentUserId(null);
    setNewUser({
      firstName: "",
      lastName: "",
      phone: "",
      organizationId: "",
      email: "",
      password: "",
    });
    setErrors({});
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setCurrentUserId(user.id);
    setNewUser({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      organizationId: user.organization_id,
      email: user.email,
      password: "",
    });
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_URL}/api/user_login/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const verifyUser = async (userId) => {
    try {
      await axios.put(`${API_URL}/api/user_login/verify/${userId}`);
      fetchUnverifiedUsers();
      fetchUsers();
      alert("User verified successfully.");
    } catch (error) {
      console.error("Error verifying user:", error);
      alert("Failed to verify user. Please try again.");
    }
  };
  
  
  
  return (
    <div className="users-container">
      <div className="users-header">
        <h2>Users Management</h2>
      </div>

      {isEditing ? (
        <div className="users-form">
          <h3>Edit User</h3>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={newUser.firstName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={newUser.lastName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={newUser.phone}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="organizationId"
            placeholder="Organization ID"
            value={newUser.organizationId}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleInputChange}
          />

          <div className="form-buttons">
            <button className="update-btn" onClick={editUser}>
              Update User
            </button>
            <button className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="unverified-users">
            <h3>Unverified Users</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {unverifiedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                      <button onClick={() => verifyUser(user.id)}>Verify</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="users-list">
            <h3>All Verified Users</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Phone</th>
                  <th>Organization ID</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.phone}</td>
                    <td>{user.organization_id}</td>
                    <td>{user.email}</td>
                    <td>
                      <button onClick={() => handleEdit(user)}><RiEdit2Fill /></button>
                      <button onClick={() => handleDelete(user.id)}><RiDeleteBinFill /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Users;
