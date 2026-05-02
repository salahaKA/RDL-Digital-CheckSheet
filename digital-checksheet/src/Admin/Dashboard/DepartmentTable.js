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

const DepartmentTable = ({ departments, getSectionsCount }) => {
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
            <TableCell>{getSectionsCount(department.name)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DepartmentTable;
