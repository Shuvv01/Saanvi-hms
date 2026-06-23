import React from "react";
import "./NurseDashboard.css";

function NurseDashboard() {
  return (
    <div className="nurse-dashboard">
      <div className="dashboard-header">
        <h1>Nurse Dashboard</h1>
        <p>Welcome to the Nurse Management System</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <div className="card-icon">👥</div>
          <h3>Patient Records</h3>
          <p>View and manage patient medical records</p>
          <button>View Records</button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">💊</div>
          <h3>Medications</h3>
          <p>Track and manage patient medications</p>
          <button>Manage Medications</button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📋</div>
          <h3>Vital Signs</h3>
          <p>Monitor and record patient vital signs</p>
          <button>Record Vitals</button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📞</div>
          <h3>Doctor Communication</h3>
          <p>Communicate with assigned doctors</p>
          <button>Messages</button>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Action</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>Vital Signs Recorded</td>
              <td>2:30 PM</td>
              <td><span className="status-success">Completed</span></td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>Medication Administered</td>
              <td>2:15 PM</td>
              <td><span className="status-success">Completed</span></td>
            </tr>
            <tr>
              <td>Mike Johnson</td>
              <td>Chart Update Pending</td>
              <td>1:45 PM</td>
              <td><span className="status-pending">Pending</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NurseDashboard;
