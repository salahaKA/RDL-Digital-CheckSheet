// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Tab, Nav, Card, Spinner } from 'react-bootstrap';
// import { FiCheckSquare } from 'react-icons/fi';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const Checklist = ({ userOrganizationId }) => {
//   const [dailyTemplates, setDailyTemplates] = useState([]);
//   const [weeklyTemplates, setWeeklyTemplates] = useState([]);
//   const [monthlyTemplates, setMonthlyTemplates] = useState([]);
//   const [loading, setLoading] = useState(true); // State to manage loading state

//   useEffect(() => {
//     fetchTemplates('daily', userOrganizationId);
//     fetchTemplates('weekly', userOrganizationId);
//     fetchTemplates('monthly', userOrganizationId);
//   }, [userOrganizationId]);

//   const fetchTemplates = (type, organizationId) => {
//     fetch(`http://localhost:3001/templates?type=${type}&organization_id=${organizationId}`, {
//       method: 'GET',
//       credentials: 'include', // Include credentials for CORS
//     })
//       .then(response => response.json())
//       .then(data => {
//         switch (type) {
//           case 'daily':
//             setDailyTemplates(data);
//             break;
//           case 'weekly':
//             setWeeklyTemplates(data);
//             break;
//           case 'monthly':
//             setMonthlyTemplates(data);
//             break;
//           default:
//             break;
//         }
//         setLoading(false); // Update loading state after fetching data
//       })
//       .catch(error => {
//         console.error('Error fetching templates:', error);
//         setLoading(false); // Update loading state in case of error
//       });
//   };

//   const renderTemplates = (templates, type) => {
//     if (!Array.isArray(templates)) {
//       console.error(`Expected an array but got: ${typeof templates}`);
//       return null;
//     }
//     if (templates.length === 0) {
//       return (
//         <Col md={12} className="text-center mt-3">
//           <p>No {type} templates available.</p>
//         </Col>
//       );
//     }
//     return templates.map(template => (
//       <Col md={4} sm={6} key={template.id}>
//         <Card className="mb-4">
//           <Card.Body>
//             <Card.Title>{template.title}</Card.Title>
//             {/* Render different components based on template type */}
//           </Card.Body>
//         </Card>
//       </Col>
//     ));
//   };

//   const headingContainerStyle = {
//     display: 'flex',
//     alignItems: 'center',
//     marginBottom: '1rem',
//   };

//   const headingIconStyle = {
//     marginRight: '0.5rem',
//     color: '#007bff',
//   };

//   const headingTextStyle = {
//     fontSize: '2rem',
//     fontWeight: 'bold',
//     color: '#007bff',
//   };

//   return (
//     <div style={{ marginTop: '70px', marginLeft: '220px', padding: '20px', maxWidth: 'calc(100% - 240px)', overflowX: 'hidden' }}>
//       <div style={headingContainerStyle}>
//         <FiCheckSquare size={40} style={headingIconStyle} />
//         <h1 style={headingTextStyle}>CHECKLIST</h1>
//       </div>
//       <Container>
//         <Tab.Container defaultActiveKey="daily">
//           <Nav variant="tabs" className="mb-3">
//             <Nav.Item>
//               <Nav.Link eventKey="daily">Daily</Nav.Link>
//             </Nav.Item>
//             <Nav.Item>
//               <Nav.Link eventKey="weekly">Weekly</Nav.Link>
//             </Nav.Item>
//             <Nav.Item>
//               <Nav.Link eventKey="monthly">Monthly</Nav.Link>
//             </Nav.Item>
//           </Nav>
//           <Tab.Content>
//             <Tab.Pane eventKey="daily">
//               {loading ? (
//                 <div className="text-center mt-5">
//                   <Spinner animation="border" role="status">
//                     <span className="sr-only">Loading...</span>
//                   </Spinner>
//                 </div>
//               ) : (
//                 <Row>{renderTemplates(dailyTemplates, 'daily')}</Row>
//               )}
//             </Tab.Pane>
//             <Tab.Pane eventKey="weekly">
//               {loading ? (
//                 <div className="text-center mt-5">
//                   <Spinner animation="border" role="status">
//                     <span className="sr-only">Loading...</span>
//                   </Spinner>
//                 </div>
//               ) : (
//                 <Row>{renderTemplates(weeklyTemplates, 'weekly')}</Row>
//               )}
//             </Tab.Pane>
//             <Tab.Pane eventKey="monthly">
//               {loading ? (
//                 <div className="text-center mt-5">
//                   <Spinner animation="border" role="status">
//                     <span className="sr-only">Loading...</span>
//                   </Spinner>
//                 </div>
//               ) : (
//                 <Row>{renderTemplates(monthlyTemplates, 'monthly')}</Row>
//               )}
//             </Tab.Pane>
//           </Tab.Content>
//         </Tab.Container>
//       </Container>
//     </div>
//   );
// };

// export default Checklist;


import React from 'react'

function ChecklistUser() {
  return (
    <div>ChecklistUser</div>
  )
}

export default ChecklistUser
