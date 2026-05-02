import React, { useEffect, useState } from "react";
import axios from "axios";

function Report() {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    // Replace with your actual user_id and template_id
    const user_id = 1;
    const template_id = 5;

    axios
  .get('/api/responses', {
    params: { user_id, template_id },
  })
  .then((response) => {
    setResponses(response.data);
  })
  .catch((error) => {
    if (error.response) {
      console.error('Error response:', error.response);
      // Handle different status codes
      if (error.response.status === 404) {
        console.error('Responses not found!');
      } else {
        console.error('Something went wrong on the server!');
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
  });
  }, []);

  return (
    <div>
      <h2>User Responses</h2>
      {responses.length === 0 ? (
        <p>No responses found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Template ID</th>
              <th>Response Data</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((response) => (
              <tr key={response.id}>
                <td>{response.id}</td>
                <td>{response.user_id}</td>
                <td>{response.template_id}</td>
                <td>
                  {Object.entries(response.response_data).map(
                    ([day, status]) => (
                      <div key={day}>
                        {day}: {status}
                      </div>
                    )
                  )}
                </td>
                <td>{new Date(response.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Report;
