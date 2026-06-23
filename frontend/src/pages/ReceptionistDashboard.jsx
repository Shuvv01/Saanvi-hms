import React from "react";
import "./ReceptionistDashboard.css";

function ReceptionistDashboard() {
  return (
    <div className="receptionist-dashboard">
      <div className="dashboard-header">
        <h1>Receptionist Dashboard</h1>
        <p>Welcome to the Receptionist Management System</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <div className="card-icon">📅</div>
          <h3>Appointments</h3>
          <p>Schedule and manage patient appointments</p>
          <button>View Appointments</button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">👤</div>
          <h3>Patient Registration</h3>
          <p>Register new patients and update records</p>
          <button>Register Patient</button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">💳</div>
          <h3>Billing & Payments</h3>
          <p>Process payments and manage billing</p>
          <button>Manage Billing</button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📞</div>
          <h3>Patient Inquiries</h3>
          <p>Handle patient calls and inquiries</p>
          <button>View Inquiries</button>
        </div>
      </div>

      <div className="upcoming-appointments">
        <h2>Today's Appointments</h2>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Patient Name</th>
              <th>Doctor</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>9:00 AM</td>
              <td>John Doe</td>
              <td>Dr. Smith</td>
              <td><span className="status-confirmed">Confirmed</span></td>
              <td><button>Check In</button></td>
            </tr>
            <tr>
              <td>10:30 AM</td>
              <td>Jane Smith</td>
              <td>Dr. Johnson</td>
              <td><span className="status-confirmed">Confirmed</span></td>
              <td><button>Check In</button></td>
            </tr>
            <tr>
              <td>1:00 PM</td>
              <td>Mike Johnson</td>
              <td>Dr. Williams</td>
              <td><span className="status-pending">Pending</span></td>
              <td><button>Confirm</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="quick-stats">
        <div className="stat-box">
          <h3>Today's Appointments</h3>
          <p className="stat-number">12</p>
        </div>
        <div className="stat-box">
          <h3>New Registrations</h3>
          <p className="stat-number">5</p>
        </div>
        <div className="stat-box">
          <h3>Pending Follow-ups</h3>
          <p className="stat-number">3</p>
        </div>
      </div>
    </div>
  );
}

export default ReceptionistDashboard;
