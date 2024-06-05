import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:3001/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await axios.get("http://localhost:3001/sections");
      setSections(response.data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchSections();
  }, []);

  const addDepartment = async (department) => {
    try {
      await axios.post("http://localhost:3001/departments", department);
      fetchDepartments();
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  const addSection = async (section) => {
    try {
      await axios.post("http://localhost:3001/sections", section);
      fetchSections();
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  const updateDepartment = async (index, department) => {
    try {
      await axios.put(
        `http://localhost:3001/departments/${department.id}`,
        department
      );
      fetchDepartments();
      fetchSections(); // Fetch updated sections data
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  const updateSection = async (index, section) => {
    try {
      await axios.put(`http://localhost:3001/sections/${section.id}`, section);
      fetchSections();
    } catch (error) {
      console.error("Error updating section:", error);
    }
  };

  const removeDepartment = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/departments/${id}`);
      fetchDepartments();
    } catch (error) {
      console.error("Error removing department:", error);
    }
  };

  const removeSection = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/sections/${id}`);
      fetchSections();
    } catch (error) {
      console.error("Error removing section:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        departments,
        sections,
        fetchDepartments,
        fetchSections,
        addDepartment,
        addSection,
        updateDepartment,
        updateSection,
        removeDepartment,
        removeSection,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
