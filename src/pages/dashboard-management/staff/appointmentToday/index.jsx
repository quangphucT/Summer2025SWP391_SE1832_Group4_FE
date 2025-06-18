import { useEffect, useState } from "react";
import "./index.scss";
import { toast } from "react-toastify";
import { getAllAppointmentsToday } from "../../../../apis/appointmentAPI/getAllAppointmentsTodayApi";
import { searchAppointmentByPhone } from "../../../../apis/appointmentAPI/searchAppointmentByPhoneApi";
import { Table, Input } from "antd";

const { Search } = Input;

const AppointmentTodayManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
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
  ];

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
    </div>
  );
};

export default AppointmentTodayManagement;
