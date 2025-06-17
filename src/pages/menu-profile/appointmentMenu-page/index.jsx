import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Table, Tag, Typography, Spin } from "antd";
import dayjs from "dayjs";
import "./index.scss";
import { getAllAppointmentsOfCustomer } from "../../../apis/appointmentAPI/getAllAppointmentsOfCustomerApi";

const { Title } = Typography;

const AppointmentMenuPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchingDataAppointmentCustomer = async () => {
    setLoading(true);
    try {
      const response = await getAllAppointmentsOfCustomer();
    const sortedData =  (response.data.data || []).sort((a,b ) => b.appointmentId - a.appointmentId);
    setData(sortedData)
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error loading appointments"
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchingDataAppointmentCustomer();
  }, []);

  const columns = [
    {
      title: "Appointment ID",
      dataIndex: "appointmentId",
      key: "appointmentId",
    },
    {
      title: "Service",
      dataIndex: "appointmentService",
      key: "appointmentService",
    },
    {
      title: "Date",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      render: (text) => text?.slice(0, 5),
    },
    {
      title: "Type",
      dataIndex: "appointmentType",
      key: "appointmentType",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "PendingConfirmation") color = "orange";
        else if (status === "Scheduled") color = "green";
        else if (status === "Cancelled") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Doctor Info",
      key: "doctor",
      render: (_, record) => {
        const doctor = record.doctor?.account;
        return (
          <div>
            <strong>{doctor?.fullName}</strong>
            <div>Email: {doctor?.email}</div>
            <div>Phone: {doctor?.phoneNumber}</div>
          </div>
        );
      },
    },
    {
      title: "Patient Info",
      key: "patient",
      render: (_, record) => {
        const patient = record.patient?.account;
        return (
          <div>
            <strong>{patient?.fullName}</strong>
            <div>Email: {patient?.email}</div>
            <div>Phone: {patient?.phoneNumber}</div>
            <div>Code: {record.patient?.patientCodeAtFacility}</div>
          </div>
        );
      },
    },
  ];

  return (
    <div
      style={{ backgroundColor: "#e0e7ff", minHeight: "100vh", padding: 24 }}
    >
      {loading ? (
        <Spin
          size="large"
          style={{ display: "flex", justifyContent: "center", marginTop: 100 }}
        />
      ) : (
        <div style={{ background: "#fff", padding: 16, borderRadius: 28 }}>
          <Title
            level={3}
            style={{
              color: "#1e3a8a",
              textAlign: "center",
              fontSize: "30px",
              fontWeight: "700",
            }}
          >
            Appointment List History
          </Title>

            <Table
              rowKey="appointmentId"
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 3 }}
            />
         
        </div>
      )}
    </div>
  );
};

export default AppointmentMenuPage;
