import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ApproveTutors.css';

export default function ApproveTutors() {
  const [tutors, setTutors] = useState([]);
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    fetchPendingTutors();
  }, []);

  const fetchPendingTutors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/pending-tutors');
      setTutors(res.data);
    } catch (err) {
      alert('Failed to fetch tutors');
    }
  };

  const approveTutor = async (id) => {
    try {
      setApprovingId(id);
      const res = await axios.put(`http://localhost:5000/api/admin/approve-tutor/${id}`);
      alert(res.data.message || 'Tutor approved!');
      fetchPendingTutors();
    } catch (err) {
      alert('Approval failed');
    } finally {
      setApprovingId(null);
    }
  };
  
  

  return (
    <div className="approve-tutors-container">
      <h2>Pending Tutor Requests</h2>
      {tutors.length === 0 ? (
        <p>No pending tutors</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>NIC</th>
              <th>Subjects</th>
              <th>NIC Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tutors.map((tutor) => (
              <tr key={tutor._id}>
                <td>{tutor.name}</td>
                <td>{tutor.email}</td>
                <td>{tutor.nic}</td>
                <td>{tutor.subjects.join(', ')}</td>
                <td>
                  <a href={`http://localhost:5000/${tutor.nicImage}`} target="_blank" rel="noreferrer">View</a>
                </td>
                <td>
                <button onClick={() => approveTutor(tutor._id)} disabled={approvingId === tutor._id}>
  {approvingId === tutor._id ? 'Approving...' : 'Approve'}
</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
