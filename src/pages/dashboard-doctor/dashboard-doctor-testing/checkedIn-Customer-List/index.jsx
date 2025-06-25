import { toast } from "react-toastify";
import "./index.scss";
import { getAllAppointments } from "../../../../apis/appointmentAPI/getAllAppointmentsApi";
import { useEffect, useState } from "react";
import {
  Button,
 
  Table,

} from "antd";
import { FileTextOutlined } from "@ant-design/icons";


const CheckedInAppointmentToday = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);




  const fetchingAppointmentCheckedIn = async () => {
    setLoading(true);
    try {
      const response = await getAllAppointments();
      const responseAfterFilterCheckedIn =
        response.data.data.rowDatas
          ?.filter((item) => item.status === "CheckedIn")
          .sort((a, b) => {
            const timeA = a.appointmentTime;
            const timeB = b.appointmentTime;
            return timeA.localeCompare(timeB);
          }) || [];

      setData(responseAfterFilterCheckedIn);
    } catch (error) {
      toast.error(
        error?.response?.data?.message?.error || "Error while fetching"
      );
    }
    setLoading(false);
  };

 

  useEffect(() => {
    fetchingAppointmentCheckedIn();
  }, []);

  const columns = [
    {
      title: "No.",
      dataIndex: "appointmentId",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Patient Info",
      key: "patientInfo",
      render: (_, record) => {
        const patientCode = record?.patient?.patientCodeAtFacility || "N/A";
        const name = record?.patientName || "N/A";
        const phone = record?.patient?.account?.phoneNumber || "N/A";
        return (
          <div>
            <div>
              <strong>Name:</strong> {name}
            </div>
            <div>
              <strong>Code:</strong> {patientCode}
            </div>
            <div>
              <strong>Phone:</strong> {phone}
            </div>
          </div>
        );
      },
    },
    {
      title: "Appointment Info",
      key: "appointmentInfo",
      render: (_, record) => {
        return (
          <div>
            <div>
              <strong>Time:</strong> {record.appointmentTime}
            </div>
            <div>
              <strong>Type:</strong> {record.appointmentType}
            </div>
            <div>
              <strong>Service:</strong> {record.appointmentService}
            </div>
          </div>
        );
      },
    },
    {
      title: "Doctor",
      key: "doctor",
      render: (_, record) => {
         const fullName = record?.doctor?.account?.fullName || "N/A";
         const email = record?.doctor?.account?.email || "N/A";
         const phoneNumber = record?.doctor?.account?.phoneNumber || "N/A";
        return (
          <div>
            <div>
              <strong>Name:</strong> {fullName}
            </div>
            <div>
              <strong>Email:</strong> {email}
            </div>
              <div>
              <strong>Phone number:</strong> {phoneNumber}
            </div>
          </div>
        )
      },
    },
    {
      title: "Action",
      dataIndex: "appointmentId",
      key: "appointmentId",
      render: (text, record) => {
        return (
          <Button
            
            icon={<FileTextOutlined />}
          
          >
            Export result
          </Button>
        );
      },
    },
  ];
 ;

  


  return (
    <div className="hiv-checkedin-table">
      <h2
        style={{
          marginBottom: 0,
          color: "#000",
          fontWeight: "bold",
          fontSize: "30px",
        }}
      >
        List of Checked-In Patients (Testing)
      </h2>
      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        rowKey="appointmentId"
        pagination={false}
      />

   


    </div>
  );
};

export default CheckedInAppointmentToday;
