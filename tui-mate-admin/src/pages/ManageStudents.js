// src/pages/ManageStudents.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ManageUsers.css';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/students')
      .then(res => setStudents(res.data))
      .catch(() => alert('Failed to load students'));
  }, []);

  return (
    <div className="admin-table-container">
      <h2>Manage Students</h2>
      <input type="text" placeholder="Search Students" className="search-box" />
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Role</th><th>Email</th><th>Location</th><th>Enrolled Classes</th><th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>Student</td>
              <td>{s.email}</td>
              <td>{s.location || 'N/A'}</td>
              <td>{s.enrolledCount || '0'} classes</td>
              <td>
                <button className="edit-btn">✏️</button>
                <button className="delete-btn">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
