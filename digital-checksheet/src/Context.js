import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetchDepartments();
    fetchSections();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/departments"); // Adjust the URL to your backend endpoint
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await axios.get("http://localhost:5000/sections"); // Adjust the URL to your backend endpoint
      setSections(response.data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  const addDepartment = async (department) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/departments",
        department
      );
      setDepartments((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  const addSection = async (section) => {
    try {
      console.log("Sending section data:", section); // Log the data
      const response = await axios.post(
        "http://localhost:5000/sections",
        section
      );
      console.log("Response from server:", response.data); // Log the response
      setSections((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  const removeDepartment = async (department) => {
    try {
      await axios.delete(`http://localhost:5000/departments/${department.id}`);
      setDepartments((prev) => prev.filter((dep) => dep.id !== department.id));
    } catch (error) {
      console.error("Error removing department:", error);
    }
  };

  const removeSection = async (section) => {
    try {
      await axios.delete(`http://localhost:5000/sections/${section.id}`);
      setSections((prev) => prev.filter((sec) => sec.id !== section.id));
    } catch (error) {
      console.error("Error removing section:", error);
    }
  };

  const editDepartment = async (id, updatedDepartment) => {
    try {
      await axios.put(
        `http://localhost:5000/departments/${id}`,
        updatedDepartment
      );
      // Optionally update the local state with the updated department
      // Implement this based on your application's requirements
    } catch (error) {
      console.error("Error editing department:", error);
    }
  };

  const editSection = async (id, updatedSection) => {
    try {
      await axios.put(`http://localhost:5000/sections/${id}`, updatedSection);
      // Optionally update the local state with the updated section
      // This will trigger a re-render of the components consuming the context
      setSections((prevSections) =>
        prevSections.map((section) =>
          section.id === id ? { ...section, ...updatedSection } : section
        )
      );
    } catch (error) {
      console.error("Error editing section:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        departments,
        sections,
        addDepartment,
        addSection,
        removeDepartment,
        removeSection,
        editDepartment,
        editSection,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
