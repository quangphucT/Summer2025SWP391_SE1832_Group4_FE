import { useEffect, useState } from "react";
import "./index.scss";
import { toast } from "react-toastify";
import { getAllAppointmentsToday } from "../../../../apis/appointmentAPI/getAllAppointmentsTodayApi";
import { searchAppointmentByPhone } from "../../../../apis/appointmentAPI/searchAppointmentByPhoneApi";
import { Table, Input, Modal, Button, Card, Typography, Tag } from "antd";
import { CheckCircleOutlined, CloseOutlined, CalendarOutlined, SearchOutlined, PhoneOutlined } from "@ant-design/icons";
import { checkInAppointment } from "../../../../apis/appointmentAPI/checkInAppointmentApi";

const { Search } = Input;
const { Title } = Typography;

const AppointmentTodayManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [idAppointment, setIdAppointment] = useState(null)
  const [openModalConfirmCheckIn, setOpenModalConfirmCheckIn] = useState(false)
  const fetchingData = async () => {
    setLoading(true);
    try {
      const response = await getAllAppointmentsToday();
      setData(response.data.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message?.error || "Error while fetching data"
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchingData();
  }, []);

  const columns = [
    {
      title: "Appointment ID",
      dataIndex: "appointmentId",
      key: "appointmentId",
      width: 120,
      render: (id) => (
        <span style={{ fontWeight: 600, color: "#1976d2" }}>#{id}</span>
      ),
    },
    {
      title: "Patient Information",
      key: "patient",
      width: 250,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "#1976d2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            {record.patientName?.charAt(0)?.toUpperCase() || "P"}
          </div>
          <div>
            <div style={{ fontWeight: 500, fontSize: "14px" }}>
              {record.patientName || "N/A"}
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>
              Code: {record.patient?.patientCodeAtFacility || "N/A"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      width: 150,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <PhoneOutlined style={{ color: "#1976d2" }} />
          <span>{record.patient?.account?.phoneNumber || "N/A"}</span>
        </div>
      ),
    },
    {
      title: "Schedule Details",
      key: "schedule",
      width: 280,
      render: (_, record) => (
        <div
          style={{
            backgroundColor: "#f8fafc",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ marginBottom: 4 }}>
            <strong style={{ color: "#1976d2" }}>Time:</strong>{" "}
            <span style={{ fontWeight: 500 }}>
              {record.appointmentTime?.slice(0, 5) || "N/A"}
            </span>
          </div>
          <div style={{ marginBottom: 4 }}>
            <strong style={{ color: "#1976d2" }}>Doctor:</strong>{" "}
            <span>{record.doctor?.account?.fullName || "N/A"}</span>
          </div>
          <div>
            <strong style={{ color: "#1976d2" }}>Type:</strong>{" "}
            <Tag color="blue">{record.appointmentType || "N/A"}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Service",
      dataIndex: "appointmentService",
      key: "appointmentService",
      width: 130,
      render: (service) => (
        <Tag color="green" style={{ fontWeight: 500 }}>
          {service === "HIVTesting" ? "HIV Testing" : service || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const statusConfig = {
          Scheduled: { color: "green", text: "Scheduled" },
          Cancelled: { color: "red", text: "Cancelled" },
          CheckedIn: { color: "blue", text: "Checked In" },
          Completed: { color: "purple", text: "Completed" },
          InProgress: { color: "orange", text: "In Progress" },
        };
        
        const config = statusConfig[status] || { color: "default", text: status };
        
        return (
          <Tag color={config.color} style={{ fontWeight: 500, borderRadius: 6 }}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => {
        const isDisabled = record.status === "CheckedIn" || record.status === "Completed";
        
        return (
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleOpenModalConfirmCheckIn(record.appointmentId)}
            disabled={isDisabled}
            style={{
              backgroundColor: isDisabled ? "#f5f5f5" : "#52c41a",
              borderColor: isDisabled ? "#d9d9d9" : "#52c41a",
              fontWeight: 500,
              borderRadius: 6,
            }}
          >
            {isDisabled ? "Checked" : "Check-In"}
          </Button>
        );
      },
    },
  ];
 const handleOpenModalConfirmCheckIn = (id) =>{
  setIdAppointment(id)
  setOpenModalConfirmCheckIn(true)
  }
  const handleSearch = async (value) => {
    if (!value) {
      fetchingData();
      return;
    }
    setLoading(true);
    try {
      const response = await searchAppointmentByPhone(value);
      setData(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message?.error || "Search failed");
    }
    setLoading(false);
  };
  const handleConfirmCheckInAppointment = async() =>{
    setLoading(true)
    try {
       await checkInAppointment(idAppointment);
       toast.success("Checked successfully!!");
       setIdAppointment(null);
       setOpenModalConfirmCheckIn(false)
       fetchingData();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Error while handling logic!!")
    }
    setLoading(false)
  }
  return (
    <div style={{ padding: "24px", marginTop: "-84px" }}>
      <Card
        bordered={false}
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <CalendarOutlined style={{ fontSize: "40px", color: "#1976d2" }} />
          <Title
            level={2}
            style={{
              color: "#1976d2",
              fontWeight: "650",
              fontSize: "30px",
              margin: 0,
            }}
          >
            Today's Appointments
          </Title>
        </div>

        {/* Search Section */}
        <div
          style={{
            marginBottom: "24px",
            padding: "16px",
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <SearchOutlined style={{ color: "#1976d2", fontSize: "16px" }} />
            <span style={{ fontWeight: "600", color: "#1976d2", fontSize: "16px" }}>
              Search by Phone Number:
            </span>
          </div>
          <Search
            placeholder="Enter patient's phone number..."
            allowClear
            enterButton={
              <Button type="primary" style={{ backgroundColor: "#1976d2" }}>
                Search
              </Button>
            }
            size="large"
            onSearch={(value) => handleSearch(value.trim())}
            style={{ maxWidth: 400 }}
          />
        </div>

        {/* Table Section */}
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          rowKey="appointmentId"
          bordered
        
         
          className="custom-table"
          style={{
            '--header-bg': '#1976d2',
            '--header-color': 'white'
          }}
        />
      </Card>

      {/* Check-in Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
            <span style={{ fontWeight: 'bold', color: '#1976d2' }}>Check-In Confirmation</span>
          </div>
        }
        open={openModalConfirmCheckIn}
        onCancel={() => setOpenModalConfirmCheckIn(false)}
        footer={[
          <Button
            key="cancel"
            icon={<CloseOutlined />}
            onClick={() => setOpenModalConfirmCheckIn(false)}
            style={{ 
              borderColor: '#d9d9d9',
              height: '40px',
              fontWeight: 500
            }}
          >
            Cancel
          </Button>,
          <Button
            key="ok"
            type="primary"
            icon={<CheckCircleOutlined />}
            loading={loading}
            onClick={handleConfirmCheckInAppointment}
            style={{ 
              backgroundColor: '#52c41a', 
              borderColor: '#52c41a',
              height: '40px',
              fontWeight: 500
            }}
          >
            Confirm Check-In
          </Button>,
        ]}
        width={500}
      >
        <div style={{ padding: '16px 0' }}>
          <p style={{ fontSize: 16, lineHeight: 1.6 }}>
            Are you sure you want to <strong style={{ color: '#52c41a' }}>check in</strong> this appointment?
          </p>
          <div style={{ 
            backgroundColor: '#f6ffed', 
            border: '1px solid #b7eb8f',
            borderRadius: '6px',
            padding: '12px',
            marginTop: '12px'
          }}>
            <p style={{ margin: 0, fontSize: 14, color: '#389e0d' }}>
              ✓ This action will mark the patient as checked in and ready for consultation.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AppointmentTodayManagement;
