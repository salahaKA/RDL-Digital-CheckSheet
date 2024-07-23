// // Header.js
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FiUser, FiLogOut } from 'react-icons/fi';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const Header = () => {
//   const navigate = useNavigate();
//   const [userName, setUserName] = useState('');

//   useEffect(() => {
//     axios.get('http://localhost:3001/', { withCredentials: true })
//       .then(response => {
//         if (response.data.Status === 'Success') {
//           setUserName(response.data.name);
//         } else {
//           navigate('/login');
//         }
//       })
//       .catch(error => {
//         console.error('Session Check Error:', error);
//         navigate('/login');
//       });
//   }, [navigate]);

//   const handleLogout = () => {
//     axios.get('http://localhost:3001/logout', { withCredentials: true })
//       .then(response => {
//         if (response.data.Status === 'Success') {
//           localStorage.removeItem('userName');
//           localStorage.removeItem('userToken');
//           navigate('/');
//         }
//       })
//       .catch(error => {
//         console.error('Logout Error:', error);
//       });
//   };

//   return (
//     <header className="d-flex justify-content-between align-items-center p-3 bg-primary text-white w-100" style={{ height: '56px' }}>
//       <div className="d-flex align-items-center">
//         <FiUser className="me-2" />
//         <span>Welcome, {userName}</span>
//       </div>
//       <button className="btn btn-outline-light d-flex align-items-center" onClick={handleLogout}>
//         <FiLogOut className="me-1" /> Logout
//       </button>
//     </header>
//   );
// };

// export default Header;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiLogOut } from 'react-icons/fi';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/', { withCredentials: true })
      .then(response => {
        if (response.data.Status === 'Success') {
          setUserName(response.data.name);
        } else {
          navigate('/login');
        }
      })
      .catch(error => {
        console.error('Session Check Error:', error);
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    axios.get('http://localhost:3001/logout', { withCredentials: true })
      .then(response => {
        if (response.data.Status === 'Success') {
          localStorage.removeItem('userName');
          localStorage.removeItem('userToken');
          navigate('/');
        }
      })
      .catch(error => {
        console.error('Logout Error:', error);
      });
  };

  return (
    <header className="d-flex justify-content-between align-items-center p-3 bg-primary text-white fixed-top" style={{ height: '56px', zIndex: '1030' }}>
      <div className="d-flex align-items-center">
        <FiUser className="me-2" />
        <span>Welcome, {userName}</span>
      </div>
      <button className="btn btn-outline-light d-flex align-items-center" onClick={handleLogout}>
        <FiLogOut className="me-1" /> Logout
      </button>
    </header>
  );
};

export default Header;
