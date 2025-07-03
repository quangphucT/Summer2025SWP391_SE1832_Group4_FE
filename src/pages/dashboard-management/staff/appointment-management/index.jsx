import { toast } from "react-toastify";
import "./index.scss";
import { useEffect, useState } from "react";
import { getAllAppointments } from "../../../../apis/appointmentAPI/getAllAppointmentsApi";
import { Table, Tag, Card, Typography, Button, Select, Input } from "antd";
import dayjs from "dayjs";
import { CalendarOutlined, SearchOutlined } from "@ant-design/icons";
import { confirmAppointment } from "../../../../apis/appointmentAPI/confirmAppointmentApi";
import ConfirmAppointmentModal from "../../../../components/atoms/ConfirmAppointment";
import { cancelAppointment } from "../../../../apis/appointmentAPI/cancelAppointmentApi";
import { getAllAppointmentsConsultant } from "../../../../apis/appointmentAPI/getAppointmentConsultantApi";
import { getAllAppointmentsTesting } from "../../../../apis/appointmentAPI/getAllAppointmentTestingApi";

const { Title } = Typography;

const colorMap = {
  PendingConfirmation: "orange",
  Scheduled: "green",
  Cancelled: "volcano",
  Completed: "blue",
  CancelledByPatient: "red",
  CancelledByDoctor: "red",
  CheckedIn: "cyan",
  NoShow: "magenta",
  InProgress: "gold",
};

const statusTextMap = {
  PendingConfirmation: "Pending Confirmation",
  Scheduled: "Scheduled",
  Cancelled: "Cancelled",
  Completed: "Completed",
  CancelledByPatient: "Cancelled by Patient",
  CancelledByDoctor: "Cancelled by Doctor",
  CheckedIn: "Checked In",
  NoShow: "No Show",
  InProgress: "In Progress",
};

const AppointmentManagement = () => {
  const [dataAppointments, setDataAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalConfirmCancel, setOpenModalConfirmCancel] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);


  const [appointmentTypeFilter, setAppointmentTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchPatientName, setSearchPatientName] = useState("");

  // Load all appointments when component mounts
  useEffect(() => {
    fetchingAllAppointments();
  }, []);

  // get All Appointment Consultant
  const fetchingAllAppointmentsConsultant = async () => {
    setLoading(true);
    try {
      const response = await getAllAppointmentsConsultant();
      setDataAppointments([])
    setDataAppointments(response.data.data.rowDatas)
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setLoading(false);
  };

  // get All Appointment Testing
  const fetchingAllAppointmentsTesting = async () => {
    setLoading(true);
    try {
      const response = await getAllAppointmentsTesting();
      setDataAppointments([])
    setDataAppointments(response.data.data.rowDatas)
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setLoading(false);
  };
  // get All Appointment
  const fetchingAllAppointments = async () => {
    setLoading(true);
    try {
      const response = await getAllAppointments();
      const sortedData = response.data.data.rowDatas
      setDataAppointments(sortedData);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setLoading(false);
  };

  const handleOpenModalConfirm = (record) => {
    setSelectedAppointment(record);
    setOpenModalConfirm(true);
  };

  const handleOpenModalCancelConfirm = (record) => {
    setSelectedAppointment(record);
    setOpenModalConfirmCancel(true);
  };

  const handleCancelAppointment = async () => {
    setLoading(true);
    try {
      await cancelAppointment(selectedAppointment.appointmentId);
      toast.success("Cancel Appointment Successfully!");
      fetchingAllAppointments();
      setSelectedAppointment(null);
      setOpenModalConfirmCancel(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setLoading(false);
  };

  const handleConfirmAppointment = async () => {

    setLoading(true);
    try {
      await confirmAppointment(selectedAppointment.appointmentId);
      toast.success("Confirm Success!");
      // Refresh data based on current filter
      if (appointmentTypeFilter === "Consultation") {
        fetchingAllAppointmentsConsultant();
      } else if (appointmentTypeFilter === "Testing") {
        fetchingAllAppointmentsTesting();
      } else {
        fetchingAllAppointments();
      }
      setSelectedAppointment(null);
      setOpenModalConfirm(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setLoading(false);
  };

  // Filter data based on status and patient name
  const filteredData = dataAppointments.filter(appointment => {
    const statusMatch = statusFilter === "All" || appointment.status === statusFilter;
    const nameMatch = !searchPatientName || 
      appointment?.patient?.account?.fullName?.toLowerCase().includes(searchPatientName.toLowerCase()) ||
      appointment?.patient?.patientCodeAtFacility?.toLowerCase().includes(searchPatientName.toLowerCase());
    
    return statusMatch && nameMatch;
  });

  const columns = [
    {
      title: "Appointment ID",
      dataIndex: "appointmentId",
      key: "appointmentId",
    },
    {
      title: "Patient",
      key: "patient",
      render: (_, record) => {
        const fullName = record?.patient?.account?.fullName || "Unknown";
        const patientCode = record?.patient?.patientCodeAtFacility || "N/A";
        const imageUrl = record?.patient?.account?.profileImageUrl;

        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img
              src={imageUrl || "https://via.placeholder.com/40"}
              alt="avatar"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div>
              <div style={{ fontWeight: 500 }}>{fullName}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{patientCode}</div>
            </div>
          </div>
        );
      },
    },

    {
      title: "Service",
      dataIndex: "appointmentService",
      key: "appointmentService",
      render: (service) => (service === "HIVTesting" ? "HIV Testing" : service),
    },
    {
      title: "Appointment Date",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Schedule",
      key: "schedule",
      render: (_, record) => {
        const time = record.appointmentTime?.slice(0, 5) || "--:--";
        const doctor = record?.doctor?.account?.fullName || "Unknown";
        const appointmentType = record.appointmentType || "Unknown";
        return (
          <div>
            <div>
              <strong>Time:</strong> {time}
            </div>
            <div>
              <strong>Doctor Name:</strong> {doctor}
            </div>
             <div>
              <strong>Appointent Type:</strong> {appointmentType}
            </div>
          </div>
        );
      },
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={colorMap[status] || "default"}
          style={{ fontWeight: 500, borderRadius: 6 }}
        >
          {statusTextMap[status] || status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        if (record.status === "PendingConfirmation") {
          return (
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                style={{
                  height: 40,
                  fontWeight: 600,
                  backgroundColor: "#1976d2", // Xanh dương y tế
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
                onClick={() => handleOpenModalConfirm(record)}
              >
                Confirm
              </Button>

              <Button
                style={{
                  height: 40,
                  fontWeight: 600,
                  backgroundColor: "#fddede", // Nền đỏ nhạt
                  color: "#d32f2f", // Đỏ y tế
                  border: "1px solid #d32f2f",
                  borderRadius: 8,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                }}
                onClick={() => handleOpenModalCancelConfirm(record)}
              >
                Cancel
              </Button>
            </div>
          );
        } else {
          return (
            <span style={{ color: "green", fontWeight: 500 }}>Confirmed</span>
          );
        }
      },
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card
        bordered={false}
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CalendarOutlined style={{ fontSize: "40px", color: "#1e88e5" }} />
          <Title
            level={3}
            style={{ color: "#1976d2", fontWeight: "650", fontSize: "30px" }}
          >
            Appointment Management
          </Title>
        </div>
        <div 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "24px", 
            marginBottom: '24px',
            padding: "16px",
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            flexWrap: "wrap"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span 
              style={{ 
                fontWeight: "600", 
                color: "#1976d2",
                fontSize: "16px",
                minWidth: "140px"
              }}
            >
              Appointment Type:
            </span>
            <Select
              style={{ 
                width: 220, 
                height: "40px"
              }}
              placeholder="Filter by Appointment Type"
              value={appointmentTypeFilter}
              onChange={(value) => {
                setAppointmentTypeFilter(value);
                if (value === "Consultation") {
                  fetchingAllAppointmentsConsultant();
                } else if (value === "Testing") {
                  fetchingAllAppointmentsTesting();
                } else if(value === "Therapy"){
                  toast.info("Therapy appointments are not implemented yet.");
                } else if (value === "All") {
                  fetchingAllAppointments();
                }
              }}
              allowClear
            >
              <Select.Option value="All">🗂️ All Appointments</Select.Option>
              <Select.Option value="Consultation">👨‍⚕️ Consultation</Select.Option>
              <Select.Option value="Testing">🧪 Testing</Select.Option>
              <Select.Option value="Therapy">💊 Therapy</Select.Option>
            </Select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span 
              style={{ 
                fontWeight: "600", 
                color: "#1976d2",
                fontSize: "16px",
                minWidth: "100px"
              }}
            >
              Status:
            </span>
            <Select
              style={{ 
                width: 200, 
                height: "40px"
              }}
              placeholder="Filter by Status"
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
              }}
              allowClear
            >
              <Select.Option value="All">📋 All Status</Select.Option>
              <Select.Option value="PendingConfirmation">⏳ Pending Confirmation</Select.Option>
              <Select.Option value="Scheduled">✅ Scheduled</Select.Option>
              <Select.Option value="Completed">🎯 Completed</Select.Option>
              <Select.Option value="CheckedIn">🏥 Checked In</Select.Option>
              <Select.Option value="InProgress">⚡ In Progress</Select.Option>
              <Select.Option value="CancelledByPatient">❌ Cancelled by Patient</Select.Option>
              <Select.Option value="CancelledByDoctor">🚫 Cancelled by Doctor</Select.Option>
              <Select.Option value="NoShow">👻 No Show</Select.Option>
            </Select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span 
              style={{ 
                fontWeight: "600", 
                color: "#1976d2",
                fontSize: "16px",
                minWidth: "120px"
              }}
            >
              Search Patient:
            </span>
            <Input
              style={{ 
                width: 250, 
                height: "40px"
              }}
              placeholder="Search by patient name or code..."
              prefix={<SearchOutlined style={{ color: "#1976d2" }} />}
              value={searchPatientName}
              onChange={(e) => setSearchPatientName(e.target.value)}
              allowClear
            />
          </div>
        </div>

        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredData}
          rowKey="appointmentId"
          pagination={{ pageSize: 8 }}
    
          bordered
          size="middle"
          className="custom-table"
          style={{
            '--header-bg': '#1976d2',
            '--header-color': 'white'
          }}
        />
      </Card>

      <ConfirmAppointmentModal
        loading={loading}
        title={"Confirm"}
        open={openModalConfirm}
        onCancel={() => setOpenModalConfirm(false)}
        onConfirm={handleConfirmAppointment}
        appointmentInfo={selectedAppointment}
      />

      <ConfirmAppointmentModal
        loading={loading}
        title={"Cancel"}
        open={openModalConfirmCancel}
        onCancel={() => setOpenModalConfirmCancel(false)}
        onConfirm={handleCancelAppointment}
        appointmentInfo={selectedAppointment}
      />
    </div>
  );
};

export default AppointmentManagement;
