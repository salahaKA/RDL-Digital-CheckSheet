import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Organization.css";

function Organization() {
  const [organizations, setOrganizations] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOrgId, setCurrentOrgId] = useState(null);
  const [newOrg, setNewOrg] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    person: "",
    logo: null,
  });
  const [errors, setErrors] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    person: "",
    logo: "",
  });

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const API_URL = "http://localhost:3001"; // Replace with your backend server URL

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/organizations`);
      setOrganizations(response.data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrg({ ...newOrg, [name]: value });
    validateField(name, value);
  };

  const handleFileChange = (e) => {
    setNewOrg({ ...newOrg, logo: e.target.files[0] });
    setErrors({ ...errors, logo: "" }); // Clear the error message for the logo field
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
      case "address":
      case "person":
        if (!value.trim()) {
          setErrors({ ...errors, [name]: `${name} cannot be empty ` });
        } else {
          setErrors({ ...errors, [name]: "" });
        }
        break;
      case "phone":
        if (!/^\d{10}$/.test(value)) {
          setErrors({
            ...errors,
            [name]: "Phone number must be a 10-digit number",
          });
        } else {
          setErrors({ ...errors, [name]: "" });
        }
        break;
      case "email":
        if (!/^\S+@\S+\.\S+$/.test(value)) {
          setErrors({
            ...errors,
            [name]: "Email must be a valid email address",
          });
        } else {
          setErrors({ ...errors, [name]: "" });
        }
        break;
      case "password":
        if (!value.trim()) {
          setErrors({ ...errors, [name]: "Password cannot be empty" });
        } else {
          setErrors({ ...errors, [name]: "" });
        }
        break;
      case "logo":
        if (!value) {
          // Check if logo file input is empty
          setErrors({ ...errors, [name]: "Logo is required" });
        } else {
          setErrors({ ...errors, [name]: "" });
        }
        break;
      default:
        break;
    }
  };

  const addOrganization = async () => {
    if (validateForm()) {
      const formData = new FormData();
      formData.append("name", newOrg.name);
      formData.append("address", newOrg.address);
      formData.append("phone_number", newOrg.phone);
      formData.append("email", newOrg.email);
      formData.append("password", newOrg.password);
      formData.append("person_name", newOrg.person);
      formData.append("logo", newOrg.logo);

      try {
        await axios.post(`${API_URL}/api/organizations`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        fetchOrganizations();
        resetForm();
      } catch (error) {
        console.error("Error adding organization:", error);
      }
    }
  };

  const editOrganization = async () => {
    if (validateForm()) {
      const formData = new FormData();
      formData.append("name", newOrg.name);
      formData.append("address", newOrg.address);
      formData.append("phone_number", newOrg.phone);
      formData.append("email", newOrg.email);
      formData.append("password", newOrg.password);
      formData.append("person_name", newOrg.person);
      formData.append("logo", newOrg.logo);

      try {
        await axios.put(
          `${API_URL}/api/organizations/${currentOrgId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        fetchOrganizations();
        resetForm();
      } catch (error) {
        console.error("Error updating organization:", error);
      }
    }
  };

  const validateForm = () => {
    const requiredFields = [
      "name",
      "address",
      "phone",
      "email",
      "password",
      "person",
      "logo",
    ];
    let isValid = true;
    requiredFields.forEach((field) => {
      if (field === "logo") {
        if (!newOrg[field]) {
          setErrors({ ...errors, [field]: "Logo is required" });
          isValid = false;
        }
      } else {
        if (!newOrg[field]?.trim()) {
          // Use optional chaining to avoid accessing trim on undefined
          setErrors({ ...errors, [field]: `${field} cannot be empty ` });
          isValid = false;
        }
      }
    });
    return isValid;
  };

  const resetForm = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentOrgId(null);
    setNewOrg({
      name: "",
      address: "",
      phone: "",
      email: "",
      password: "",
      person: "",
      logo: null,
    });
    setErrors({
      name: "",
      address: "",
      phone: "",
      email: "",
      password: "",
      person: "",
      logo: "",
    });
  };

  const deleteOrganization = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/organizations/${id}`);
      fetchOrganizations();
    } catch (error) {
      console.error("Error deleting organization:", error);
    }
  };

  const startEditing = (org) => {
    setIsEditing(true);
    setIsAdding(false);
    setCurrentOrgId(org.id);
    setNewOrg({
      name: org.name,
      address: org.address,
      phone: org.phone_number,
      email: org.email,
      password: "", // Password should not be pre-filled for security reasons
      person: org.person_name,
      logo: null,
    });
  };

  return (
    <div className="organization">
      <div className="organization-header">
        <h2>ORGANIZATIONS</h2>
        {!isAdding && !isEditing && (
          <button className="add-btn" onClick={() => setIsAdding(true)}>
            Add Organization
          </button>
        )}
      </div>

      {isAdding || isEditing ? (
        <div className="organization-form">
          <h3>{isEditing ? "Edit Organization" : "Add New Organization"}</h3>
          <input
            type="text"
            name="name"
            placeholder="Organization Name"
            value={newOrg.name}
            onChange={handleInputChange}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
          <input
            type="text"
            name="address"
            placeholder="Organization Address"
            value={newOrg.address}
            onChange={handleInputChange}
          />
          {errors.address && (
            <span className="error-message">{errors.address}</span>
          )}
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={newOrg.phone}
            onChange={handleInputChange}
          />
          {errors.phone && (
            <span className="error-message">{errors.phone}</span>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newOrg.email}
            onChange={handleInputChange}
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newOrg.password}
            onChange={handleInputChange}
          />
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
          <input
            type="text"
            name="person"
            placeholder="Person Name"
            value={newOrg.person}
            onChange={handleInputChange}
          />
          {errors.person && (
            <span className="error-message">{errors.person}</span>
          )}
          <input type="file" name="logo" onChange={handleFileChange} />
          {errors.logo && (
            <span className="error-message" style={{ color: "red" }}>
              {errors.logo}
            </span>
          )}

          <div className="form-buttons">
            <button
              className="add-btn"
              onClick={isEditing ? editOrganization : addOrganization}
            >
              {isEditing ? "Update" : "Add"}
            </button>
            <button className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <table className="organization-table">
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Organization Name</th>
              <th>Organization Address</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Person Name</th>
              <th>Logo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org, index) => (
              <tr key={org.id}>
                <td>{index + 1}</td>
                <td>{org.name}</td>
                <td>{org.address}</td>
                <td>{org.phone_number}</td>
                <td>{org.email}</td>
                <td>{org.person_name}</td>
                <td>
                  <img
                    src={`${API_URL}/${org.logo}`}
                    alt="Logo"
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td className="organization-actions">
                  <button
                    className="edit-btn"
                    onClick={() => startEditing(org)}
                  >
                    EDIT
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteOrganization(org.id)}
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Organization;
