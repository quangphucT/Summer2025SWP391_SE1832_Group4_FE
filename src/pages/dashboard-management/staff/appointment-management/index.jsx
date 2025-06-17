import { toast } from "react-toastify";
import "./index.scss";
import { useEffect, useState } from "react";
import { getAllAppointments } from "../../../../apis/appointmentAPI/getAllAppointmentsApi";
import { Table, Tag, Card, Typography, Button } from "antd";
import dayjs from "dayjs";
import { CalendarOutlined } from "@ant-design/icons";
import { confirmAppointment } from "../../../../apis/appointmentAPI/confirmAppointmentApi";
import ConfirmAppointmentModal from "../../../../components/atoms/ConfirmAppointment";
import { cancelAppointment } from "../../../../apis/appointmentAPI/cancelAppointmentApi";

const { Title } = Typography;

const colorMap = {
  PendingConfirmation: "orange",
  Scheduled: "green",
  Cancelled: "volcano",
};

const statusTextMap = {
  PendingConfirmation: "Pending Confirmation",
  Scheduled: "Confirmed",
  Cancelled: "Cancelled",
};

const AppointmentManagement = () => {
  const [dataAppointments, setDataAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalConfirmCancel, setOpenModalConfirmCancel] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchingAllAppointments = async () => {
    setLoading(true);
    try {
      const response = await getAllAppointments();
     const sortedData =  (response.data.data.rowDatas).sort((a,b) => b.appointmentId - a.appointmentId);
     setDataAppointments(sortedData)
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchingAllAppointments();
  }, []);

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
    setOpenModalConfirm(false);
    setLoading(false);
  };

  const handleConfirmAppointment = async () => {
    setLoading(true);
    try {
      await confirmAppointment(selectedAppointment.appointmentId);
      toast.success("Confirm Success!");
      fetchingAllAppointments();
      setSelectedAppointment(null);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setOpenModalConfirm(false);
    setLoading(false);
  };

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
        const type =
          record.appointmentType === "InPerson"
            ? "In Person"
            : record.appointmentType === "Online"
            ? "Online"
            : "N/A";

        return (
          <div>
            <div>
              <strong>Time:</strong> {time}
            </div>
            <div>
              <strong>Doctor Name:</strong> {doctor}
            </div>
            <div>
              <strong>Type:</strong> {type} (Offline)
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
          <Title level={3} style={{ color: "#1976d2", fontWeight: '650', fontSize: '30px' }}>
            Appointment Management
          </Title>
        </div>

        <Table
          loading={loading}
          columns={columns}
          dataSource={dataAppointments}
          rowKey="appointmentId"
          pagination={{ pageSize: 8 }}
          scroll={{ x: "max-content" }}
          bordered
          size="middle"
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
