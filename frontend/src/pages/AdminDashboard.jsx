import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DashboardLayout from "../layouts/DashboardLayout";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:5000/api/admin";
const emptyDoctorForm = {
  fullname: "",
  email: "",
  phone: "",
  password: "",
};
const emptyPatientForm = {
  fullname: "",
  email: "",
  phone: "",
  password: "",
};
const emptyAppointmentForm = {
  patientName: "",
  patientEmail: "",
  doctorId: "",
  appointmentDate: "",
};
const chartColors = ["#0d6efd", "#20c997", "#ffc107", "#dc3545"];

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctorForm, setDoctorForm] = useState(emptyDoctorForm);
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [patientForm, setPatientForm] = useState(emptyPatientForm);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState(emptyAppointmentForm);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [appointmentStatus, setAppointmentStatus] = useState("all");

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    }),
    []
  );

  const fetchAppointments = useCallback(async () => {
    const response = await axios.get(`${API_BASE}/appointments`, {
      headers,
      params: {
        search: appointmentSearch,
        status: appointmentStatus,
      },
    });

    setAppointments(response.data);
  }, [appointmentSearch, appointmentStatus, headers]);

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);

      const [
        summaryResponse,
        usersResponse,
        doctorsResponse,
        patientsResponse,
        appointmentsResponse,
      ] = await Promise.all([
        axios.get(`${API_BASE}/summary`, { headers }),
        axios.get(`${API_BASE}/users`, { headers }),
        axios.get(`${API_BASE}/doctors`, { headers }),
        axios.get(`${API_BASE}/patients`, { headers }),
        axios.get(`${API_BASE}/appointments`, {
          headers,
          params: {
            search: appointmentSearch,
            status: appointmentStatus,
          },
        }),
      ]);

      setSummary(summaryResponse.data);
      setUsers(usersResponse.data);
      setDoctors(doctorsResponse.data);
      setPatients(patientsResponse.data);
      setAppointments(appointmentsResponse.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, [appointmentSearch, appointmentStatus, headers]);

  useEffect(() => {
    if (user?.role === "admin") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchAdminData();
    }
  }, [fetchAdminData, user?.role]);

  const filteredUsers = useMemo(() => {
    return users.filter((account) => {
      const query = userSearch.toLowerCase();
      const matchesQuery =
        account.fullname.toLowerCase().includes(query) ||
        account.email.toLowerCase().includes(query) ||
        account.phone.toLowerCase().includes(query);
      const matchesRole =
        userRoleFilter === "all" || account.role === userRoleFilter;

      return matchesQuery && matchesRole;
    });
  }, [users, userSearch, userRoleFilter]);

  const patientAppointmentCounts = useMemo(() => {
    return appointments.reduce((counts, appointment) => {
      counts[appointment.patientEmail] =
        (counts[appointment.patientEmail] || 0) + 1;
      return counts;
    }, {});
  }, [appointments]);

  const resetDoctorForm = () => {
    setDoctorForm(emptyDoctorForm);
    setEditingDoctorId(null);
  };

  const handleDoctorSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingDoctorId) {
        await axios.put(`${API_BASE}/doctors/${editingDoctorId}`, doctorForm, {
          headers,
        });
        toast.success("Doctor updated successfully");
      } else {
        await axios.post(`${API_BASE}/doctors`, doctorForm, { headers });
        toast.success("Doctor created successfully");
      }

      resetDoctorForm();
      await fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Doctor action failed");
    }
  };

  const startDoctorEdit = (doctor) => {
    setEditingDoctorId(doctor.id);
    setDoctorForm({
      fullname: doctor.fullname,
      email: doctor.email,
      phone: doctor.phone,
      password: "",
    });
    setSearchParams({ tab: "doctors" });
  };

  const deleteDoctor = async (doctorId) => {
    if (!window.confirm("Delete this doctor and related appointments?")) return;

    try {
      await axios.delete(`${API_BASE}/doctors/${doctorId}`, { headers });
      toast.success("Doctor deleted successfully");
      await fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete doctor");
    }
  };

  const deleteUser = async (account) => {
    if (!window.confirm(`Delete ${account.fullname}?`)) return;

    try {
      await axios.delete(`${API_BASE}/users/${account.id}`, { headers });
      toast.success("User deleted successfully");
      await fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const resetPatientForm = () => {
    setPatientForm(emptyPatientForm);
    setEditingPatientId(null);
  };

  const handlePatientSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingPatientId) {
        await axios.put(`${API_BASE}/patients/${editingPatientId}`, patientForm, { headers });
        toast.success("Patient updated successfully");
      } else {
        await axios.post(`${API_BASE}/patients`, patientForm, { headers });
        toast.success("Patient created successfully");
      }
      resetPatientForm();
      await fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Patient action failed");
    }
  };

  const startPatientEdit = (patient) => {
    setEditingPatientId(patient.id);
    setPatientForm({ fullname: patient.fullname, email: patient.email, phone: patient.phone, password: "" });
    setSearchParams({ tab: "patients" });
  };

  const handleAppointmentSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${API_BASE}/appointments`, appointmentForm, { headers });
      toast.success("Appointment created");
      setAppointmentForm(emptyAppointmentForm);
      await fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create appointment");
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await axios.delete(`${API_BASE}/appointments/${id}`, { headers });
      toast.success("Appointment deleted");
      await fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete appointment");
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      await axios.put(
        `${API_BASE}/appointments/${appointmentId}/status`,
        { status },
        { headers }
      );
      toast.success("Appointment status updated");
      await fetchAppointments();
      const summaryResponse = await axios.get(`${API_BASE}/summary`, {
        headers,
      });
      setSummary(summaryResponse.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update appointment"
      );
    }
  };

  if (!user) {
    return (
      <div className="container mt-5">
        <h3>Unauthorized Access</h3>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="container mt-5">
        <h3>Access Denied - Admin Only</h3>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Users",
      value: summary?.totals?.users ?? users.length,
      icon: "bi-people",
      tone: "primary",
    },
    {
      label: "Doctors",
      value: summary?.totals?.doctors ?? doctors.length,
      icon: "bi-heart-pulse",
      tone: "success",
    },
    {
      label: "Patients",
      value: summary?.totals?.patients ?? patients.length,
      icon: "bi-person-vcard",
      tone: "info",
    },
    {
      label: "Appointments",
      value: summary?.totals?.appointments ?? appointments.length,
      icon: "bi-calendar2-check",
      tone: "warning",
    },
  ];

  return (
    <DashboardLayout role="Admin">
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Hospital administration</p>
            <h1>Admin Dashboard</h1>
            <p className="text-muted">
              Manage staff, patients, appointments, and operational health.
            </p>
          </div>
          <div className="admin-profile">
            <span className="admin-avatar">
              {user.fullname?.charAt(0)?.toUpperCase() || "A"}
            </span>
            <div>
              <strong>{user.fullname}</strong>
              <small>{user.email || "Administrator"}</small>
            </div>
          </div>
        </div>

        <div className="dashboard-tabs" aria-label="Admin dashboard modules">
          {[
            ["overview", "Overview", "bi-grid-1x2"],
            ["doctors", "Doctors", "bi-heart-pulse"],
            ["users", "Users", "bi-people"],
            ["patients", "Patients", "bi-person-vcard"],
            ["appointments", "Appointments", "bi-calendar2-week"],
          ].map(([id, label, icon]) => (
            <button
              key={id}
              type="button"
              className={activeTab === id ? "active" : ""}
              onClick={() =>
                id === "overview"
                  ? setSearchParams({})
                  : setSearchParams({ tab: id })
              }
            >
              <i className={`bi ${icon}`} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="empty-state">Loading admin workspace...</div>
        ) : (
          <>
            {activeTab === "overview" && (
              <section className="dashboard-section">
                <div className="stat-grid">
                  {stats.map((stat) => (
                    <article className="metric-card" key={stat.label}>
                      <span className={`metric-icon text-${stat.tone}`}>
                        <i className={`bi ${stat.icon}`} aria-hidden="true" />
                      </span>
                      <div>
                        <small>{stat.label}</small>
                        <strong>{stat.value}</strong>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="analytics-grid">
                  <article className="panel">
                    <div className="panel-heading">
                      <h2>Appointment Status</h2>
                      <span className="badge text-bg-light">Live</span>
                    </div>
                    <div className="chart-box">
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={summary?.appointmentStatus || []}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {(summary?.appointmentStatus || []).map(
                              (entry, index) => (
                                <Cell
                                  key={entry.name}
                                  fill={chartColors[index % chartColors.length]}
                                />
                              )
                            )}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </article>

                  <article className="panel">
                    <div className="panel-heading">
                      <h2>User Mix</h2>
                      <span className="badge text-bg-light">Roles</span>
                    </div>
                    <div className="chart-box">
                      <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                          <Pie
                            data={summary?.roleDistribution || []}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={90}
                            label
                          >
                            {(summary?.roleDistribution || []).map(
                              (entry, index) => (
                                <Cell
                                  key={entry.name}
                                  fill={chartColors[index % chartColors.length]}
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </article>
                </div>
              </section>
            )}

            {activeTab === "doctors" && (
              <section className="dashboard-section">
                <div className="module-grid">
                  <article className="panel doctor-form-panel">
                    <div className="panel-heading">
                      <h2>{editingDoctorId ? "Edit Doctor" : "Create Doctor"}</h2>
                      {editingDoctorId && (
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          type="button"
                          onClick={resetDoctorForm}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                    <form className="stack-form" onSubmit={handleDoctorSubmit}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Full name"
                        value={doctorForm.fullname}
                        onChange={(event) =>
                          setDoctorForm({
                            ...doctorForm,
                            fullname: event.target.value,
                          })
                        }
                        required
                      />
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email address"
                        value={doctorForm.email}
                        onChange={(event) =>
                          setDoctorForm({
                            ...doctorForm,
                            email: event.target.value,
                          })
                        }
                        required
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Phone number"
                        value={doctorForm.phone}
                        onChange={(event) =>
                          setDoctorForm({
                            ...doctorForm,
                            phone: event.target.value,
                          })
                        }
                        required
                      />
                      <input
                        type="password"
                        className="form-control"
                        placeholder={
                          editingDoctorId
                            ? "New password (optional)"
                            : "Password"
                        }
                        value={doctorForm.password}
                        onChange={(event) =>
                          setDoctorForm({
                            ...doctorForm,
                            password: event.target.value,
                          })
                        }
                        required={!editingDoctorId}
                      />
                      <button className="btn btn-primary" type="submit">
                        <i className="bi bi-save" aria-hidden="true" />
                        {editingDoctorId ? "Update Doctor" : "Create Doctor"}
                      </button>
                    </form>
                  </article>

                  <article className="panel">
                    <div className="panel-heading">
                      <h2>Doctor Management</h2>
                      <span className="badge text-bg-primary">
                        {doctors.length} doctors
                      </span>
                    </div>
                    <DataTable
                      headers={["Name", "Email", "Phone", "Actions"]}
                      emptyText="No doctors found"
                    >
                      {doctors.map((doctor) => (
                        <tr key={doctor.id}>
                          <td>{doctor.fullname}</td>
                          <td>{doctor.email}</td>
                          <td>{doctor.phone}</td>
                          <td>
                            <div className="table-actions">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                type="button"
                                onClick={() => startDoctorEdit(doctor)}
                              >
                                <i className="bi bi-pencil" />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                type="button"
                                onClick={() => deleteDoctor(doctor.id)}
                              >
                                <i className="bi bi-trash" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </DataTable>
                  </article>
                </div>
              </section>
            )}

            {activeTab === "users" && (
              <section className="dashboard-section">
                <article className="panel">
                  <div className="panel-heading">
                    <h2>User Management</h2>
                    <span className="badge text-bg-light">
                      {filteredUsers.length} shown
                    </span>
                  </div>
                  <div className="toolbar">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search name, email, or phone"
                      value={userSearch}
                      onChange={(event) => setUserSearch(event.target.value)}
                    />
                    <select
                      className="form-select"
                      value={userRoleFilter}
                      onChange={(event) => setUserRoleFilter(event.target.value)}
                    >
                      <option value="all">All roles</option>
                      <option value="admin">Admins</option>
                      <option value="doctor">Doctors</option>
                      <option value="patient">Patients</option>
                    </select>
                  </div>
                  <DataTable
                    headers={["Name", "Email", "Phone", "Role", "Actions"]}
                    emptyText="No users match your filters"
                  >
                    {filteredUsers.map((account) => (
                      <tr key={account.id}>
                        <td>{account.fullname}</td>
                        <td>{account.email}</td>
                        <td>{account.phone}</td>
                        <td>
                          <RoleBadge role={account.role} />
                        </td>
                        <td>
                          {account.role === "admin" ? (
                            <span className="text-muted">Protected</span>
                          ) : (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              type="button"
                              onClick={() => deleteUser(account)}
                            >
                              <i className="bi bi-trash" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </DataTable>
                </article>
              </section>
            )}

            {activeTab === "patients" && (
              <section className="dashboard-section">
                <div className="module-grid">
                  <article className="panel">
                    <div className="panel-heading">
                      <h2>{editingPatientId ? "Edit Patient" : "Create Patient"}</h2>
                      {editingPatientId && (
                        <button className="btn btn-sm btn-outline-secondary" type="button" onClick={resetPatientForm}>
                          Cancel
                        </button>
                      )}
                    </div>
                    <form className="stack-form" onSubmit={handlePatientSubmit}>
                      <input type="text" className="form-control" placeholder="Full name" value={patientForm.fullname} onChange={(e) => setPatientForm({ ...patientForm, fullname: e.target.value })} required />
                      <input type="email" className="form-control" placeholder="Email" value={patientForm.email} onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })} required />
                      <input type="text" className="form-control" placeholder="Phone" value={patientForm.phone} onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })} required />
                      <input type="password" className="form-control" placeholder={editingPatientId ? "New password (leave empty to keep)" : "Password"} value={patientForm.password} onChange={(e) => setPatientForm({ ...patientForm, password: e.target.value })} required={!editingPatientId} />
                      <button className="btn btn-primary" type="submit">{editingPatientId ? "Update" : "Create"}</button>
                    </form>
                  </article>

                  <article className="panel">
                    <div className="panel-heading">
                      <h2>Patient List</h2>
                      <span className="badge text-bg-light">{patients.length} total</span>
                    </div>
                    <DataTable
                      headers={["Patient", "Email", "Phone", "Appointments", "Actions"]}
                      emptyText="No patients found"
                    >
                      {patients.map((patient) => (
                        <tr key={patient.id}>
                          <td>{patient.fullname}</td>
                          <td>{patient.email}</td>
                          <td>{patient.phone}</td>
                          <td>{patientAppointmentCounts[patient.email] || 0}</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => startPatientEdit(patient)}>
                              <i className="bi bi-pencil" />
                            </button>
                            {" "}
                            <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => deleteUser(patient)}>
                              <i className="bi bi-trash" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </DataTable>
                  </article>
                </div>
              </section>
            )}

            {activeTab === "appointments" && (
              <section className="dashboard-section">
                <article className="panel">
                  <div className="panel-heading">
                    <h2>Appointment Search And Filtering</h2>
                    <span className="badge text-bg-light">
                      {appointments.length} results
                    </span>
                  </div>
                  <div className="toolbar">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search patient, doctor, email, or YYYY-MM-DD"
                      value={appointmentSearch}
                      onChange={(event) =>
                        setAppointmentSearch(event.target.value)
                      }
                    />
                    <select
                      className="form-select"
                      value={appointmentStatus}
                      onChange={(event) =>
                        setAppointmentStatus(event.target.value)
                      }
                    >
                      <option value="all">All statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <button
                      className="btn btn-outline-primary"
                      type="button"
                      onClick={fetchAppointments}
                    >
                      <i className="bi bi-search" />
                      Search
                    </button>
                  </div>

                  <div className="mb-4">
                    <h3 className="mb-3">Create Appointment</h3>
                    <form className="stack-form" onSubmit={handleAppointmentSubmit}>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Patient name" 
                        value={appointmentForm.patientName} 
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, patientName: e.target.value })} 
                        required 
                      />
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="Patient email" 
                        value={appointmentForm.patientEmail} 
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, patientEmail: e.target.value })} 
                        required 
                      />
                      <select 
                        className="form-select" 
                        value={appointmentForm.doctorId} 
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, doctorId: e.target.value })} 
                        required
                      >
                        <option value="">Select doctor</option>
                        {doctors.map((d) => (
                          <option key={d.id} value={d.id}>{d.fullname}</option>
                        ))}
                      </select>
                      <input 
                        type="date" 
                        className="form-control" 
                        value={appointmentForm.appointmentDate} 
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, appointmentDate: e.target.value })} 
                        required 
                      />
                      <button className="btn btn-primary" type="submit"><i className="bi bi-plus" /> Create Appointment</button>
                    </form>
                  </div>

                  <DataTable
                    headers={[
                      "Patient",
                      "Doctor",
                      "Email",
                      "Date",
                      "Status",
                      "Actions",
                    ]}
                    emptyText="No appointments found"
                  >
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.patientName}</td>
                        <td>{appointment.doctorName}</td>
                        <td>{appointment.patientEmail}</td>
                        <td>{appointment.appointmentDate}</td>
                        <td>
                          <StatusBadge status={appointment.status} />
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm status-select"
                            value={appointment.status}
                            onChange={(event) =>
                              updateAppointmentStatus(
                                appointment.id,
                                event.target.value
                              )
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                          {" "}
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            type="button" 
                            onClick={() => deleteAppointment(appointment.id)}
                          >
                            <i className="bi bi-trash" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </DataTable>
                </article>
              </section>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function DataTable({ headers, children, emptyText }) {
  const rows = Array.isArray(children) ? children.filter(Boolean) : children;
  const isEmpty = Array.isArray(rows) && rows.length === 0;

  return (
    <div className="table-responsive">
      <table className="table align-middle admin-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan={headers.length} className="empty-cell">
                {emptyText}
              </td>
            </tr>
          ) : (
            rows
          )}
        </tbody>
      </table>
    </div>
  );
}

function RoleBadge({ role }) {
  const className =
    role === "admin"
      ? "text-bg-danger"
      : role === "doctor"
        ? "text-bg-success"
        : "text-bg-primary";

  return <span className={`badge ${className}`}>{role}</span>;
}

function StatusBadge({ status }) {
  const className =
    status === "Approved"
      ? "text-bg-success"
      : status === "Rejected"
        ? "text-bg-danger"
        : "text-bg-warning";

  return <span className={`badge ${className}`}>{status}</span>;
}

export default AdminDashboard;
