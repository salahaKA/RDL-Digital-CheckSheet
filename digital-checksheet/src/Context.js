import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);

  const addDepartment = (department) => {
    setDepartments((prev) => [...prev, department]);
  };

  const addSection = (section) => {
    setSections((prev) => [...prev, section]);
  };

  const removeDepartment = (department) => {
    setDepartments((prev) => prev.filter((dep) => dep !== department));
  };

  const removeSection = (section) => {
    setSections((prev) => prev.filter((sec) => sec !== section));
  };

  return (
    <AppContext.Provider value={{ departments, sections, addDepartment, addSection, removeDepartment, removeSection }}>
      {children}
    </AppContext.Provider>
  );
};
