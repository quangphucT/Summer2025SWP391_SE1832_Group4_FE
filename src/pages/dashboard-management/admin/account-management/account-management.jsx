import React, { useEffect, useState } from "react";
import {
  getAllAccounts,
  updateAccountById,
  deleteAccountById,
} from "../../../../apis/accountsApi";

const getStatusLabel = (status) => {
  if (status === 0 || status === "Active" || status === "Acitve") return "Active";
  if (status === 1 || status === "Inactive") return "Inactive";
  if (status === 2 || status === "Pending") return "Pending";
  return "Pending";
};

const getStatusClass = (status) => {
  if (status === 0 || status === "Active" || status === "Acitve") return "active";
  if (status === 1 || status === "Inactive") return "inactive";
  if (status === 2 || status === "Pending") return "pending";
  return "pending";
};

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    username: "",
    email: "",
    accountStatus: "",
    roleId: "",
    pageNumber: "",
    pageSize: "",
    sortBy: "",
    sortDescending: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    fullName: "",
    accountStatus: 0,
    roleId: 0,
    profileImageUrl: "",
  });

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      // Nếu chỉnh pageNumber, cập nhật riêng
      pageNumber: name === "pageNumber" ? value : prev.pageNumber,
    }));
  }

  async function fetchAccounts(customFilters = filters) {
    setLoading(true);
    setError(null);
    try {
      // Làm sạch các filter: loại bỏ giá trị rỗng, undefined, null
      const cleanFilters = {};
      Object.entries(customFilters).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
          cleanFilters[key] = value.toString().trim();
        }
      });
      const params = new URLSearchParams(cleanFilters);
      const queryString = params.toString();
      console.log("[DEBUG] Query string:", queryString);

      const response = await getAllAccounts(queryString);
      if (Array.isArray(response)) {
        setAccounts(response);
      } else if (response?.data?.accounts) {
        setAccounts(response.data.accounts);
      } else if (response?.data) {
        setAccounts(Array.isArray(response.data) ? response.data : []);
      } else {
        console.warn("[WARNING] Unexpected response format:", response);
        setAccounts([]);
      }
    } catch (err) {
      console.error("[ERROR] Failed to fetch accounts:", err);
      setError(err.message);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    console.log("[DEBUG] Searching with filters:", filters);
    fetchAccounts(filters);
  }

  async function handleDelete(id) {
    if (!window.confirm("Bạn có chắc muốn xóa account này?")) return;
    try {
      await deleteAccountById(id);
      fetchAccounts();
    } catch (err) {
      console.error("Lỗi khi xóa account:", err);
      alert("Xóa không thành công: " + err.message);
    }
  }

  function startEdit(acc) {
    setEditingId(acc.accountId ?? acc.id);
    setEditForm({
      username: acc.username || "",
      email: acc.email || "",
      phoneNumber: acc.phoneNumber || "",
      fullName: acc.fullName || "",
      accountStatus: acc.accountStatus ?? 0,
      roleId: acc.roleId ?? 0,
      profileImageUrl: acc.profileImageUrl || "",
    });
  }

  function handleEditFormChange(e) {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]:
        name === "accountStatus" || name === "roleId"
          ? Number(value)
          : value,
    }));
  }

  async function handleEditSave(id) {
    try {
      await updateAccountById(id, {
        ...editForm,
        // accountStatus và roleId đã là number sau handleEditFormChange
      });
      alert("Cập nhật thành công!");
      setEditingId(null);
      fetchAccounts();
    } catch (err) {
      console.error("Lỗi khi cập nhật account:", err);
      alert("Cập nhật không thành công: " + err.message);
    }
  }

  function handleEditCancel() {
    setEditingId(null);
  }

  return (
    <div className="account-mgmt-root">
      <style>{`
        /* --- Đảm bảo cha (AppLayout) đã có height:100vh & display:flex --- */
        /* Ở đây chỉ cần styling cho phần AccountManagement sao cho chiếm */
        /* toàn không gian bên phải của sidebar và scroll nội bộ.        */

        /* Box-sizing toàn phần */
        *, *::before, *::after {
          box-sizing: border-box;
        }

        /* Phần gốc của AccountManagement */
        .account-mgmt-root {
          flex: 1;                     /* chiếm hết không gian còn lại của parent flex */
          display: flex;
          flex-direction: column;
          height: 100%;                /* 100% so với .app-layout (đã là 100vh) */
          background: #ffffff;
          font-family: 'Segoe UI', Arial, sans-serif;
          overflow: hidden;            /* Ẩn overflow bên ngoài, chỉ internal scroll ở table-wrap */
        }

        .account-mgmt-title {
          font-size: 2rem;
          font-weight: 700;
          margin: 16px 24px 8px;
          color: #1976d2;
          letter-spacing: 1px;
        }

        /* Form filter cố định trên đầu vùng content */
        .account-mgmt-form {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          padding: 12px 24px;
          background: #f5f8fa;
          border-bottom: 1px solid #d0d0d0;
        }
        .account-mgmt-form input,
        .account-mgmt-form select {
          flex: 1 1 200px;
          min-width: 140px;
          padding: 8px 10px;
          border: 1px solid #cfd8dc;
          border-radius: 6px;
          font-size: 1rem;
          background: #ffffff;
          transition: border-color 0.2s;
        }
        .account-mgmt-form input:focus,
        .account-mgmt-form select:focus {
          outline: none;
          border-color: #1976d2;
          border-width: 1.5px;
        }
        .account-mgmt-form button {
          flex: 0 0 auto;
          padding: 8px 24px;
          background: #1976d2;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          height: 40px;
          align-self: flex-end;
          transition: background-color 0.2s;
        }
        .account-mgmt-form button:hover {
          background: #1251a3;
        }

        /* Phần table-wrap chiếm phần còn lại và cho phép scroll */
        .account-mgmt-table-wrap {
          flex: 1;              /* chiếm toàn bộ vùng còn lại dưới form */
          overflow: auto;       /* scroll dọc + ngang nếu nội dung quá lớn */
          padding: 0 24px 24px;
          background: #ffffff;
        }
        .account-mgmt-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          font-size: 1rem;
          min-width: 800px;     /* nếu không đủ, sẽ cuộn ngang */
        }
        .account-mgmt-table th {
          position: sticky;
          top: 0;
          background: #e3eafc;
          color: #1976d2;
          font-weight: 700;
          padding: 12px 8px;
          border-bottom: 2px solid #b6c6e3;
          z-index: 10;
          text-align: left;
        }
        .account-mgmt-table td {
          padding: 10px 8px;
          border-bottom: 1px solid #f0f0f0;
          vertical-align: middle;
        }
        .account-mgmt-table tr:nth-child(even) {
          background: #f8fafc;
        }
        .account-mgmt-table tr:hover {
          background: #e3eafc33;
        }

        .account-mgmt-btn {
          padding: 6px 14px;
          border-radius: 5px;
          border: none;
          font-size: 0.95rem;
          font-weight: 500;
          margin-right: 6px;
          cursor: pointer;
          transition: background-color 0.2s, color 0.2s;
        }
        .account-mgmt-btn.edit {
          background: #e3eafc;
          color: #1976d2;
        }
        .account-mgmt-btn.edit:hover {
          background: #1976d2;
          color: #ffffff;
        }
        .account-mgmt-btn.delete {
          background: #ffeaea;
          color: #d32f2f;
        }
        .account-mgmt-btn.delete:hover {
          background: #d32f2f;
          color: #ffffff;
        }
        .account-mgmt-btn.save {
          background: #43a047;
          color: #ffffff;
        }
        .account-mgmt-btn.save:hover {
          background: #2e7031;
        }
        .account-mgmt-btn.cancel {
          background: #bdbdbd;
          color: #ffffff;
        }
        .account-mgmt-btn.cancel:hover {
          background: #757575;
        }

        .account-mgmt-status {
          display: inline-block;
          padding: 3px 12px;
          border-radius: 12px;
          font-size: 0.95em;
          font-weight: 600;
        }
        .account-mgmt-status.active {
          background: #e8f5e9;
          color: #388e3c;
        }
        .account-mgmt-status.inactive {
          background: #fbe9e7;
          color: #b71c1c;
        }
        .account-mgmt-status.pending {
          background: #fff8e1;
          color: #f57f17;
        }

        .account-mgmt-profile-img {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 50%;
          border: 2px solid #e3eafc;
          background: #f5f8fa;
        }

        /* --- Responsive: khi viewport < 900px --- */
        @media (max-width: 900px) {
          .account-mgmt-form {
            gap: 8px;
            padding: 8px 16px;
          }
          .account-mgmt-form input,
          .account-mgmt-form select {
            flex: 1 1 100%;
            min-width: 0;
          }
          .account-mgmt-form button {
            width: 100%;
            margin-top: 4px;
          }
          .account-mgmt-table th,
          .account-mgmt-table td {
            font-size: 0.9rem;
            padding: 6px 4px;
          }
          .account-mgmt-table {
            min-width: 600px;
          }
        }
      `}</style>

      <h2 className="account-mgmt-title">Account Management</h2>

      {/* Filter/Search Form */}
      <form onSubmit={handleSearch} className="account-mgmt-form">
        <input
          name="username"
          value={filters.username}
          onChange={handleFilterChange}
          placeholder="Username"
        />
        <input
          name="email"
          value={filters.email}
          onChange={handleFilterChange}
          placeholder="Email"
        />

        {/* Dropdown cho 3 trạng thái: 0, 1, 2 */}
        <select
          name="accountStatus"
          value={filters.accountStatus}
          onChange={handleFilterChange}
        >
          <option value="">AccountStatus</option>
          <option value="0">Active</option>
          <option value="1">Inactive</option>
          <option value="2">Pending</option>
        </select>

        <input
          name="roleId"
          value={filters.roleId}
          onChange={handleFilterChange}
          placeholder="RoleId"
        />
        <input
          name="pageNumber"
          value={filters.pageNumber}
          onChange={handleFilterChange}
          placeholder="PageNumber"
        />
        <input
          name="pageSize"
          value={filters.pageSize}
          onChange={handleFilterChange}
          placeholder="PageSize"
        />
        <input
          name="sortBy"
          value={filters.sortBy}
          onChange={handleFilterChange}
          placeholder="SortBy"
        />
        <select
          name="sortDescending"
          value={filters.sortDescending}
          onChange={handleFilterChange}
        >
          <option value="">SortDescending</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <button type="submit">Search</button>
      </form>

      {/* Loading / Error */}
      {loading && <p style={{ margin: "8px 24px" }}>Đang tải dữ liệu...</p>}
      {error && (
        <p style={{ margin: "8px 24px", color: "red" }}>Lỗi: {error}</p>
      )}

      {/* Table dữ liệu, nằm trong vùng cuộn riêng */}
      {!loading && !error && (
        
          <table
            className="account-mgmt-table"
            border="0"
            cellPadding="0"
            cellSpacing="0"
          >
            <thead>
              <tr>
                <th style={{ minWidth: 90 }}>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Full Name</th>
                <th>Status</th>
                <th>Role ID</th>
                <th>Created At</th>
                <th>Last Login</th>
                <th>Phone</th>
                <th>Profile Image</th>
                <th style={{ minWidth: 180 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => (
                <tr key={acc.accountId ?? acc.id}>
                  {editingId === (acc.accountId ?? acc.id) ? (
                    <>
                      {/* Nếu đang ở chế độ edit row */}
                      <td>{acc.accountId ?? acc.id}</td>
                      <td>
                        <input
                          name="username"
                          value={editForm.username}
                          onChange={handleEditFormChange}
                        />
                      </td>
                      <td>
                        <input
                          name="email"
                          value={editForm.email}
                          onChange={handleEditFormChange}
                        />
                      </td>
                      <td>
                        <input
                          name="fullName"
                          value={editForm.fullName}
                          onChange={handleEditFormChange}
                        />
                      </td>
                      <td>
                        <select
                          name="accountStatus"
                          value={editForm.accountStatus}
                          onChange={handleEditFormChange}
                        >
                          <option value={0}>Active</option>
                          <option value={1}>Inactive</option>
                          <option value={2}>Pending</option>
                        </select>
                      </td>
                      <td>
                        <input
                          name="roleId"
                          type="number"
                          value={editForm.roleId}
                          onChange={handleEditFormChange}
                        />
                      </td>
                      <td>
                        {acc.createdAt
                          ? new Date(acc.createdAt).toLocaleString()
                          : ""}
                      </td>
                      <td>
                        {acc.lastLoginAt
                          ? new Date(acc.lastLoginAt).toLocaleString()
                          : ""}
                      </td>
                      <td>
                        <input
                          name="phoneNumber"
                          value={editForm.phoneNumber}
                          onChange={handleEditFormChange}
                        />
                      </td>
                      <td>
                        <input
                          name="profileImageUrl"
                          value={editForm.profileImageUrl}
                          onChange={handleEditFormChange}
                        />
                      </td>
                      <td>
                        <button
                          className="account-mgmt-btn save"
                          onClick={() =>
                            handleEditSave(acc.accountId ?? acc.id)
                          }
                        >
                          Save
                        </button>
                        <button
                          className="account-mgmt-btn cancel"
                          onClick={handleEditCancel}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    
                    <>
                      {/* Chế độ hiển thị thông thường */}
                      <td>{acc.accountId ?? acc.id}</td>
                      <td>{acc.username}</td>
                      <td>{acc.email}</td>
                      <td>{acc.fullName || ""}</td>
                      <td>
                        <span
                          className={`account-mgmt-status ${getStatusClass(acc.accountStatus)}`}
                        >
                          {getStatusLabel(acc.accountStatus)}
                        </span>
                      </td>
                      <td>{acc.roleId ?? ""}</td>
                      <td>
                        {acc.createdAt
                          ? new Date(acc.createdAt).toLocaleString()
                          : ""}
                      </td>
                      <td>
                        {acc.lastLoginAt
                          ? new Date(acc.lastLoginAt).toLocaleString()
                          : ""}
                      </td>
                      <td>{acc.phoneNumber}</td>
                      <td>
                        {acc.profileImageUrl ? (
                          <img
                            src={acc.profileImageUrl}
                            alt="Profile"
                            className="account-mgmt-profile-img"
                          />
                        ) : (
                          <span style={{ color: "#aaa" }}>No image</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="account-mgmt-btn edit"
                          onClick={() => startEdit(acc)}
                        >
                          Edit
                        </button>
                        <button
                          className="account-mgmt-btn delete"
                          onClick={() =>
                            handleDelete(acc.accountId ?? acc.id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {accounts.length === 0 && (
                <tr>
                  <td
                    colSpan="11"
                    style={{ textAlign: "center", padding: "1rem" }}
                  >
                    Không có account nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
       
      )}
    </div>
  );
};

export default AccountManagement;
