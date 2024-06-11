// DepartmentTable.js
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import "./DepartmentTable.css";

const DepartmentTable = ({ departments }) => {
  console.log("Departments prop:", departments);
  const safeGetSectionsLength = (department) => {
    return Array.isArray(department.sections) ? department.sections.length : 0;
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Department Name</TableCell>
          <TableCell>Number of Sections</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {departments.map((department) => (
          <TableRow key={department.id}>
            <TableCell>{department.name}</TableCell>
            <TableCell>{safeGetSectionsLength(department)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DepartmentTable;
