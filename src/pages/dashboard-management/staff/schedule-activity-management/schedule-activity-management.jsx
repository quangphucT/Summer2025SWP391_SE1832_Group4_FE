import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getAllScheduledActivities,
  createScheduledActivity,
  updateScheduledActivityById,
  deleteScheduledActivityById,
} from "../../../../apis/scheduledActivities/scheduledActivities";
import "./schedule-activity-management.scss";

const ScheduleActivityManagement = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [filters, setFilters] = useState({
    patientId: '',
    activityType: '',
  });
  const [formData, setFormData] = useState({
    patientId: '',
    createdByStaffId: '',
    scheduledDate: '',
    activityType: '',
    description: '',
    status: '',
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    fetchActivities();

  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function fetchActivities(customFilters = filters) {
    setLoading(true);
    setError(null);
    try {
      const cleanFilters = {};
      if (customFilters.patientId) cleanFilters.patientId = customFilters.patientId;
      if (customFilters.activityType) cleanFilters.activityType = customFilters.activityType;
      const params = new URLSearchParams(cleanFilters);
      const queryString = params.toString();
      const data = await getAllScheduledActivities(queryString);
      setActivities(data);
    } catch (err) {
      toast.error("Failed to fetch activities: " + (err.message || "Unknown error"));
      setError(err.message);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    fetchActivities({ ...filters, pageNumber: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      pageNumber: newPage,
    }));
  };

  const handleSort = (field) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortDesc: prev.sortBy === field ? !prev.sortDesc : false,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        patientId: formData.patientId,
        createdByStaffId: formData.createdByStaffId,
        scheduledDate: formData.scheduledDate,
        activityType: formData.activityType,
        description: formData.description,
        status: formData.status,
      };
      if (editingActivity) {
        await updateScheduledActivityById(editingActivity.scheduledActivityId || editingActivity.id, submitData);
        toast.success("Activity updated successfully");
      } else {
        await createScheduledActivity(submitData);
        toast.success("Activity created successfully");
      }
      setIsModalOpen(false);
      setEditingActivity(null);
      setFormData({
        patientId: '',
        createdByStaffId: '',
        scheduledDate: '',
        activityType: '',
        description: '',
        status: '',
      });
      fetchActivities();
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setFormData({
      patientId: activity.patientId,
      createdByStaffId: activity.createdByStaffId,
      scheduledDate: activity.scheduledDate,
      activityType: activity.activityType,
      description: activity.description,
      status: activity.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteConfirmed = async (id) => {
    try {
      await deleteScheduledActivityById(id);
      toast.success("Activity deleted successfully");
      fetchActivities();
    } catch (error) {
      toast.error(error.message || "Failed to delete activity");
    } finally {
      setConfirmDeleteId(null);
      setConfirmDeleteOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
    setConfirmDeleteOpen(false);
  };

  return (
    <div className="schedule-activity-mgmt-root">
      <h2 className="schedule-activity-mgmt-title">Scheduled Activity Management</h2>
      <form onSubmit={handleSearch} className="schedule-activity-mgmt-form">
        <input
          name="patientId"
          type="number"
          value={filters.patientId}
          onChange={handleFilterChange}
          placeholder="Patient ID"
        />
        <select
          name="activityType"
          value={filters.activityType}
          onChange={handleFilterChange}
        >
          <option value="">-- All Activity Types --</option>
          <option value="ReExamination">ReExamination</option>
          <option value="LabTest">LabTest</option>
          <option value="MedicationPickup">MedicationPickup</option>
        </select>
        {/* <button
          type="submit"
          style={{
            backgroundColor: '#1976d2',
            color: 'white',
            marginLeft: 'auto',
            height: '40px',
            alignSelf: 'flex-end',
          }}
        >
          Search
        </button> */}
        <button
          type="button"
          onClick={() => {
            setIsModalOpen(true);
            setEditingActivity(null);
            setFormData({
              patientId: '',
              createdByStaffId: '',
              scheduledDate: '',
              activityType: '',
              description: '',
              status: '',
            });
          }}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            marginLeft: 12,
            height: '40px',
            alignSelf: 'flex-end',
          }}
        >
          Add New Activity
        </button>
      </form>

      {loading && <p style={{ margin: "8px 24px" }}>Loading activities...</p>}
      {error && (
        <p style={{ margin: "8px 24px", color: "red" }}>Error: {error}</p>
      )}

      {!loading && !error && (
        <table className="schedule-activity-mgmt-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient ID</th>
              <th>Created By Staff ID</th>
              <th onClick={() => handleSort('scheduledDate')}>
                Scheduled Date {filters.sortBy === 'scheduledDate' && (filters.sortDesc ? '↓' : '↑')}
              </th>
              <th>Activity Type</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.scheduledActivityId || activity.id}>
                <td>{activity.scheduledActivityId}</td>
                <td>{activity.patientId}</td>
                <td>{activity.createdByStaffId}</td>
                <td>{activity.scheduledDate ? new Date(activity.scheduledDate).toLocaleString() : ''}</td>
                <td>{activity.activityType}</td>
                <td>{activity.description}</td>
                <td>{activity.status}</td>
                <td>{activity.createdAt ? new Date(activity.createdAt).toLocaleString() : ''}</td>
                <td>
                  <button
                    className="schedule-activity-mgmt-btn edit"
                    onClick={() => handleEdit(activity)}
                  >
                    Edit
                  </button>
                  <button
                    className="schedule-activity-mgmt-btn delete"
                    onClick={() => handleDelete(activity.scheduledActivityId || activity.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {activities.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "1rem" }}>
                  No activities found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button
          onClick={() => handlePageChange(filters.pageNumber - 1)}
          disabled={filters.pageNumber === 1}
        >
          Previous
        </button>
        <span>Page {filters.pageNumber}</span>
        <button
          onClick={() => handlePageChange(filters.pageNumber + 1)}
          disabled={activities.length < filters.pageSize}
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingActivity ? "Edit Activity" : "Add New Activity"}</h2>
            <form onSubmit={handleSubmit} className="schedule-activity-mgmt-form-modal">
              <label>Patient ID</label>
              <input
                type="number"
                name="patientId"
                value={formData.patientId || ''}
                onChange={handleInputChange}
                placeholder="Patient ID"
                required
              />
              <label>Created By Staff ID</label>
              <input
                type="number"
                name="createdByStaffId"
                value={formData.createdByStaffId || ''}
                onChange={handleInputChange}
                placeholder="Created By Staff ID"
                required
              />
              <label>Scheduled Date</label>
              <input
                type="datetime-local"
                name="scheduledDate"
                value={formData.scheduledDate ? formData.scheduledDate.slice(0, 16) : ''}
                onChange={handleInputChange}
                required
              />
              <label>Activity Type</label>
              <select
                name="activityType"
                value={formData.activityType || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Select Activity Type --</option>
                <option value="ReExamination">ReExamination</option>
                <option value="LabTest">LabTest</option>
                <option value="MedicationPickup">MedicationPickup</option>
              </select>
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                placeholder="Description"
                required
              />
              <label>Status</label>
              <select
                name="status"
                value={formData.status || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Select Status --</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Canceled">Canceled</option>
              </select>
              <div className="modal-actions" style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="schedule-activity-mgmt-btn save">
                  {editingActivity ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="schedule-activity-mgmt-btn cancel"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingActivity(null);
                    setFormData({
                      patientId: '',
                      createdByStaffId: '',
                      scheduledDate: '',
                      activityType: '',
                      description: '',
                      status: '',
                    });
                  }}
                >
                  Cancel
                </button>
                {/* Nút tạo schedule với payload mẫu */}
                <button
                  type="button"
                  style={{ background: '#1976d2', color: 'white', borderRadius: 4, padding: '8px 16px' }}
                  onClick={async () => {
                    try {
                      const examplePayload = {
                        patientId: 0,
                        createdByStaffId: 0,
                        scheduledDate: '2025-07-30T18:48:23.992Z',
                        activityType: 'ReExamination',
                        description: 'string',
                        status: 'Scheduled',
                      };
                      await createScheduledActivity(examplePayload);
                      toast.success('Created schedule with example payload!');
                      setIsModalOpen(false);
                      setEditingActivity(null);
                      setFormData({
                        patientId: '',
                        createdByStaffId: '',
                        scheduledDate: '',
                        activityType: '',
                        description: '',
                        status: '',
                      });
                      fetchActivities();
                    } catch {
                      toast.error('Failed to create schedule with example payload!');
                    }
                  }}
                >
                  Create Schedule (API Example)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Custom Confirm Delete Modal */}
      {confirmDeleteOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: '32px 32px 24px 32px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            minWidth: 320,
            textAlign: 'center',
            maxWidth: '90vw',
          }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Are you sure you want to delete this activity?</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button
                style={{
                  background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 32px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(25,118,210,0.08)'
                }}
                onClick={() => handleDeleteConfirmed(confirmDeleteId)}
              >OK</button>
              <button
                style={{
                  background: '#f5f8fa', color: '#1976d2', border: '1.5px solid #1976d2', borderRadius: 6, padding: '8px 32px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(25,118,210,0.04)'
                }}
                onClick={handleCancelDelete}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleActivityManagement;
