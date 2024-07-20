import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Logs.css';

function Logs() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/logs');
            console.log('Fetched logs:', response.data); // Check fetched data
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    console.log('Logs state:', logs); // Check logs state

    return (
        <div className="logs">
            <div className="logs-header">
                <h2>ADMIN LOGS</h2>
            </div>
            <table className="logs-table">
                <thead>
                    <tr>
                        <th>Sl No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Date</th>
                        <th>Login Time</th>
                        <th>Logout Time</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log, index) => (
                        <tr key={log.id}>
                            <td>{index + 1}</td>
                            <td>{log.name}</td>
                            <td>{log.email}</td>
                            <td>{new Date(log.date).toLocaleDateString()}</td>
                            <td>{log.login_time ? new Date(log.login_time).toLocaleTimeString() : '-'}</td>
                            <td>{log.logout_time ? new Date(log.logout_time).toLocaleTimeString() : '-'}</td>
                            <td>{log.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Logs;