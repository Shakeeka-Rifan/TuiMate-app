// src/pages/ManageTutors.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ManageUsers.css';

export default function ManageTutors() {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/tutors')
      .then(res => setTutors(res.data))
      .catch(() => alert('Failed to load tutors'));
  }, []);

  return (
    <div className="admin-table-container">
      <h2>Manage Tutors</h2>
      <input type="text" placeholder="Search Tutors" className="search-box" />
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Role</th><th>Email</th><th>Subject</th><th>Students</th><th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {tutors.map((t) => (
            <tr key={t._id}>
              <td>{t.name}</td>
              <td>Tutor</td>
              <td>{t.email}</td>
              <td>{t.subjects?.join(', ') || 'N/A'}</td>
              <td>{t.studentCount || '0'} students</td>
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
