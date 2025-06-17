import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getAllStandardARVRegimen,
  CreateStandardARVRegimen,
  updateStandardARVRegimenById,
  deleteStandardARVRegimenById,
} from "../../../../apis/standardARVRegimen";
import "./arvstandard-management.scss";

const ArvManagement = () => {
  const [regimens, setRegimens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegimen, setEditingRegimen] = useState(null);
  const [filters, setFilters] = useState({
    pageNumber: 1,
    pageSize: 20,
    sortBy: "",
    sortDesc: false,
    regimenName: "",
    targetPopulation: "",
  });
  const [formData, setFormData] = useState({
    regimenName: "",
    detailedDescription: "",
    targetPopulation: "",
    standardDosage: "",
    contraindications: "",
    commonSideEffects: "",
  });

  useEffect(() => {
    fetchRegimens();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]:
        name === "pageNumber" || name === "pageSize"
          ? Number(value)
          : value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function fetchRegimens(customFilters = filters) {
    setLoading(true);
    setError(null);
    try {
      const cleanFilters = {};
      Object.entries(customFilters).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
          cleanFilters[key] = value.toString().trim();
        }
      });

      const params = new URLSearchParams(cleanFilters);
      const queryString = params.toString();

      const data = await getAllStandardARVRegimen(queryString);
      setRegimens(data);
    } catch (err) {
      console.error("[ERROR] Failed to fetch regimens:", err);
      toast.error("Failed to fetch regimens: " + (err.message || "Unknown error"));
      setError(err.message);
      setRegimens([]);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRegimens({ ...filters, pageNumber: 1 }); // Reset to first page on new search
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
      if (editingRegimen) {
        await updateStandardARVRegimenById(editingRegimen.regimenId || editingRegimen.id, formData);
        toast.success("Regimen updated successfully");
      } else {
        await CreateStandardARVRegimen(formData);
        toast.success("Regimen created successfully");
      }
      setIsModalOpen(false);
      setEditingRegimen(null);
      setFormData({
        regimenName: "",
        detailedDescription: "",
        targetPopulation: "",
        standardDosage: "",
        contraindications: "",
        commonSideEffects: "",
      });
      fetchRegimens();
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleEdit = (regimen) => {
    setEditingRegimen(regimen);
    setFormData(regimen);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this regimen?")) {
      try {
        await deleteStandardARVRegimenById(id);
        toast.success("Regimen deleted successfully");
        fetchRegimens();
      } catch (error) {
        toast.error(error.message || "Failed to delete regimen");
      }
    }
  };

  return (
    <div className="arv-mgmt-root">
      <h2 className="arv-mgmt-title">Standard ARV Regimen Management</h2>

      <form onSubmit={handleSearch} className="arv-mgmt-form">
        <input
          name="regimenName"
          value={filters.regimenName}
          onChange={handleFilterChange}
          placeholder="Regimen Name"
        />
        <input
          name="targetPopulation"
          value={filters.targetPopulation}
          onChange={handleFilterChange}
          placeholder="Target Population"
        />
        <input
          name="pageSize"
          type="number"
          value={filters.pageSize}
          onChange={handleFilterChange}
          placeholder="Page Size"
          min="1"
        />
        <select
          name="sortDesc"
          value={filters.sortDesc}
          onChange={handleFilterChange}
        >
          <option value={false}>Ascending</option>
          <option value={true}>Descending</option>
        </select>
        {/* <button type="submit">Search</button> */}
        <button
          type="button"
          onClick={() => {
            setIsModalOpen(true);
            setEditingRegimen(null);
            setFormData({
              regimenName: "",
              detailedDescription: "",
              targetPopulation: "",
              standardDosage: "",
              contraindications: "",
              commonSideEffects: "",
            });
          }}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            marginLeft: 'auto',
            height: '40px',
            alignSelf: 'flex-end',
          }}
        >
          Add New Regimen
        </button>
      </form>

      {loading && <p style={{ margin: "8px 24px" }}>Loading regimens...</p>}
      {error && (
        <p style={{ margin: "8px 24px", color: "red" }}>Error: {error}</p>
      )}

      {!loading && !error && (
       
          <table className="arv-mgmt-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('regimenName')}>
                  Regimen Name {
                    filters.sortBy === 'regimenName' &&
                    (filters.sortDesc ? '↓' : '↑')
                  }
                </th>
                <th onClick={() => handleSort('targetPopulation')}>
                  Target Population {
                    filters.sortBy === 'targetPopulation' &&
                    (filters.sortDesc ? '↓' : '↑')
                  }
                </th>
                <th onClick={() => handleSort('standardDosage')}>
                  Standard Dosage {
                    filters.sortBy === 'standardDosage' &&
                    (filters.sortDesc ? '↓' : '↑')
                  }
                </th>
                <th>Detailed Description</th>
                <th>Contraindications</th>
                <th>Common Side Effects</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {regimens.map((regimen) => (
                <tr key={regimen.regimenId || regimen.id}>
                  <td>{regimen.regimenName}</td>
                  <td>{regimen.targetPopulation}</td>
                  <td>{regimen.standardDosage}</td>
                  <td>{regimen.detailedDescription}</td>
                  <td>{regimen.contraindications}</td>
                  <td>{regimen.commonSideEffects}</td>
                  <td>
                    <button
                      className="arv-mgmt-btn edit"
                      onClick={() => handleEdit(regimen)}
                    >
                      Edit
                    </button>
                    <button
                      className="arv-mgmt-btn delete"
                      onClick={() => handleDelete(regimen.regimenId || regimen.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {regimens.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: "center", padding: "1rem" }}
                  >
                    No regimens found.
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
          disabled={regimens.length < filters.pageSize}
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingRegimen ? "Edit Regimen" : "Add New Regimen"}</h2>
            <form onSubmit={handleSubmit} className="arv-mgmt-form-modal">
              <label>Regimen Name</label>
              <input
                type="text"
                name="regimenName"
                value={formData.regimenName}
                onChange={handleInputChange}
                placeholder="Regimen Name"
                required
              />
              <label>Detailed Description</label>
              <textarea
                name="detailedDescription"
                value={formData.detailedDescription}
                onChange={handleInputChange}
                placeholder="Detailed Description"
                required
              />
              <label>Target Population</label>
              <input
                type="text"
                name="targetPopulation"
                value={formData.targetPopulation}
                onChange={handleInputChange}
                placeholder="Target Population"
                required
              />
              <label>Standard Dosage</label>
              <input
                type="text"
                name="standardDosage"
                value={formData.standardDosage}
                onChange={handleInputChange}
                placeholder="Standard Dosage"
                required
              />
              <label>Contraindications</label>
              <textarea
                name="contraindications"
                value={formData.contraindications}
                onChange={handleInputChange}
                placeholder="Contraindications"
                required
              />
              <label>Common Side Effects</label>
              <textarea
                name="commonSideEffects"
                value={formData.commonSideEffects}
                onChange={handleInputChange}
                placeholder="Common Side Effects"
                required
              />
              <div className="modal-actions" style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="arv-mgmt-btn save">
                  {editingRegimen ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="arv-mgmt-btn cancel"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingRegimen(null);
                    setFormData({
                      regimenName: "",
                      detailedDescription: "",
                      targetPopulation: "",
                      standardDosage: "",
                      contraindications: "",
                      commonSideEffects: "",
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArvManagement;