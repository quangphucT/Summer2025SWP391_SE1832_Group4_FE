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
      setDataAppointments(response.data.data.rowDatas);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchingAllAppointments();
  }, []);

  const columns = [
    {
      title: "Appointment ID",
      dataIndex: "appointmentId",
      key: "appointmentId",
    },
    {
      title: "Patient Name",
      dataIndex: ["patient", "account", "fullName"],
      key: "patientName",
    },
    {
      title: "Patient Code",
      dataIndex: ["patient", "patientCodeAtFacility"],
      key: "patientCode",
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
      title: "Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      render: (time) => time?.slice(0, 5),
    },
    {
      title: "Doctor",
      dataIndex: ["doctor", "account", "fullName"],
      key: "doctorName",
    },
    {
      title: "Type",
      dataIndex: "appointmentType",
      key: "appointmentType",
      render: (type) =>
        type === "InPerson" ? "In Person" : type === "Online" ? "Online" : type,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        let text = status;

        switch (status) {
          case "PendingConfirmation":
            color = "orange";
            text = "Pending Confirmation";
            break;
          case "Scheduled":
            color = "green";
            text = "Confirmed";
            break;
          case "Cancelled":
            color = "red";
            text = "Cancelled";
            break;
          default:
            color = "default";
            break;
        }

        return (
          <Tag color={color} style={{ fontWeight: 500 }}>
            {text}
          </Tag>
        );
      },
    },

  {
  title: "Action",
  key: "action",
  render: (_, record) => {
    if (record.status === "PendingConfirmation") {
      return (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            className="!bg-[#1e88e5] !text-white !font-semibold !h-[40px]"
            onClick={() => handleOpenModalConfirm(record)}
          >
            Confirm
          </Button>
          <Button
            danger
            className="!font-semibold !h-[40px]"
            onClick={() => handleOpenModalCancelConfirm(record)}
          >
            Cancel
          </Button>
        </div>
      );
    } else {
      return (
        <span style={{ color: 'green', fontWeight: 500 }}>Confirmed</span>
      );
    }
  },
}

  ];
  const handleOpenModalConfirm = (record) => {
    setSelectedAppointment(record);
    setOpenModalConfirm(true);
  };

    const handleOpenModalCancelConfirm = (record) => {
    setSelectedAppointment(record);
    setOpenModalConfirmCancel(true);
  };
  const handleCancelAppointment = async(id) =>{
         setLoading(true)
        try {
          await cancelAppointment(id)
          toast.success("Cancel success!")
          fetchingAllAppointments();
           setSelectedAppointment(null);
        } catch (error) {
          toast.error(error?.response?.data?.message)
        }
          setOpenModalConfirm(false);
        setLoading(false)
  }


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
 
  return (
    <div style={{ padding: "24px" }}>
      <Card
        bordered={false}
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
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
          <CalendarOutlined style={{ fontSize: "24px", color: "#1e88e5" }} />
          <Title level={3} style={{ margin: 0 }}>
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
        />
      </Card>

      <ConfirmAppointmentModal
        title={"Confirm"}
        open={openModalConfirm}
        onCancel={() => setOpenModalConfirm(false)}
        onConfirm={handleConfirmAppointment}
        appointmentInfo={selectedAppointment}
      />

       <ConfirmAppointmentModal
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
