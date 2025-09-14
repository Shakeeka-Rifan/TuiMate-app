import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import ApproveTutors from './pages/ApproveTutors';
import Dashboard from './pages/Dashboard';
import ManageStudent from './pages/ManageStudents';
import ManageTutors from './pages/ManageTutors';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/approve-tutors" element={<ApproveTutors />} />
        <Route path="/dashboard/" element={<Dashboard />} />
          <Route path="/manageTutor/" element={<ManageTutors />} />
              <Route path="/manageStudent/" element={<ManageStudent />} />
      </Routes>
    </Router>
  );
}

export default App;
