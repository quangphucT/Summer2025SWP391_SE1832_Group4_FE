import { useEffect, useState } from "react";
import "./index.scss";
import { toast } from "react-toastify";
import { getAllAppointmentsToday } from "../../../../apis/appointmentAPI/getAllAppointmentsTodayApi";
import { searchAppointmentByPhone } from "../../../../apis/appointmentAPI/searchAppointmentByPhoneApi";
import { Table, Input, Modal, Button } from "antd";
import { CheckCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { checkInAppointment } from "../../../../apis/appointmentAPI/checkInAppointmentApi";

const { Search } = Input;

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
    },
    {
      title: "Patient Name",
      dataIndex: "patientName",
      key: "patientName",
    },
    {
      title: "Patient Code",
      dataIndex: ["patient", "patientCodeAtFacility"],
      key: "patientCode",
    },
    {
      title: "Phone",
      dataIndex: ["patient", "account", "phoneNumber"],
      key: "phoneNumber",
    },
    {
      title: "Schedule",
      key: "schedule",
      render: (_, record) => (
        <div style={{ lineHeight: "1.6" }}>
          <div>
            <strong>Time:</strong> {record.appointmentTime}
          </div>
          <div>
            <strong>Doctor Name:</strong>{" "}
            {record.doctor?.account?.fullName || "N/A"}
          </div>
          <div>
            <strong>Type:</strong> {record.appointmentType}
          </div>
        </div>
      ),
    },
    {
      title: "Service",
      dataIndex: "appointmentService",
      key: "appointmentService",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        let color = "blue";
        if (text === "Scheduled") color = "green";
        if (text === "Cancelled") color = "red";
        return <span style={{ color }}>{text}</span>;
      },
    },
    {
    title: "Check-In",
    dataIndex: "appointmentId",
    key: "appointmentId",
    render: (appointmentId) => {

      return (
        <Button type="primary" onClick={() => {handleOpenModalConfirmCheckIn(appointmentId)}}>
          Check-In
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
    <div>
      <h2 className="font-bold text-[30px] mb-3 text-[#1976d2]">
        Today's Appointments
      </h2>
      <Search
        placeholder="Enter phone number"
        allowClear
        enterButton="Search"
        size="large"
      
        onSearch={(value) => handleSearch(value.trim())}
        style={{ maxWidth: 300, marginBottom: 20 }}
      />

      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        rowKey="appointmentId"
        bordered
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 5 }}
      />
   <Modal
  title={
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
      <span style={{ fontWeight: 'bold' }}>Check-In Confirmation</span>
    </div>
  }
  open={openModalConfirmCheckIn}
  onCancel={() => setOpenModalConfirmCheckIn(false)}
  footer={[
    <Button
      key="cancel"
      icon={<CloseOutlined />}
      onClick={() => setOpenModalConfirmCheckIn(false)}
      style={{ borderColor: '#d9d9d9' }}
    >
      Cancel
    </Button>,
    <Button
      key="ok"
      type="primary"
      icon={<CheckCircleOutlined />}
      loading={loading}
      onClick={handleConfirmCheckInAppointment}
      style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
    >
      Confirm
    </Button>,
  ]}
>
  <p style={{ fontSize: 16 }}>
    Are you sure you want to <strong>check in</strong> this appointment?
  </p>
</Modal>
    </div>
  );
};

export default AppointmentTodayManagement;
