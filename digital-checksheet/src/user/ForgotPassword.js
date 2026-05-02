// // ForgotPassword.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

// function ForgotPassword() {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axios.post('http://localhost:8081/forgot-password', { email })
//       .then(res => {
//         if (res.data.message === 'Password reset email sent successfully') {
//           setMessage('Password reset link sent to your email.');
//           setTimeout(() => {
//             navigate('/login');
//           }, 3000);
//         } else {
//           setMessage(res.data.message);
//         }
//       })
//       .catch(err => {
//         console.error(err);
//         setMessage('An error occurred. Please try again.');
//       });
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
//       <div className="bg-white p-4 rounded w-25">
//         <h4>Forgot Password</h4>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label htmlFor="email" className="form-label">
//               <strong>Email</strong>
//             </label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               name="email"
//               className="form-control"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit" className="btn btn-primary w-100">
//             Send Reset Link
//           </button>
//         </form>
//         {message && <p className="mt-3 text-center">{message}</p>}
//       </div>
//     </div>
//   );
// }

// export default ForgotPassword;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FiMail } from 'react-icons/fi'; // Import React icon for email
import { MdErrorOutline } from 'react-icons/md'; // Import error icon

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ email: 'Please enter a valid email address.' });
      return;
    } else {
      setErrors({}); // Clear any previous errors
    }

    axios.post('http://localhost:3001/forgot-password', { email })
      .then(res => {
        if (res.data.message === 'Password reset email sent successfully') {
          alert('Password reset link sent to your email.'); // Display message immediately
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          alert(res.data.message); // Show any error message received
        }
      })
      .catch(err => {
        console.error(err);
        alert('An error occurred. Please try again.'); // Alert for any unexpected errors
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-primary">
      <div className="bg-white p-4 rounded w-25">
        <h4 className="text-center mb-2" style={{ borderBottom: '2px solid white', paddingBottom: '8px' }}>
          <strong style={{ textDecoration: 'underline' }}>Forgot Password</strong>
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              <strong>Email</strong>
            </label>
            <div className="input-group">
              <span className="input-group-text"><FiMail /></span>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {errors.email && (
              <small className="text-danger d-block mt-1">
                <MdErrorOutline className="mb-1" /> {errors.email}
              </small>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-100">
            <strong>Send Reset Link</strong>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;


