
import { Table, Tag, Button, Avatar, Select, Input, Card, Typography } from "antd";
import { CalendarOutlined, UserOutlined, PhoneOutlined, MedicineBoxOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./index.scss";


import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { getAllAppointmentsFollowingDoctor } from "../../../../apis/appointmentAPI/getAppointmentFollowingDoctorApi";


const { Title } = Typography;

const AppointmentListByDoctorTestingAccountId = () => {
    const accountID = useSelector((store) => store?.user?.accountID);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Filter states
    const [statusFilter, setStatusFilter] = useState("All");
    const [serviceFilter, setServiceFilter] = useState("All");
    const [searchPatientName, setSearchPatientName] = useState("");
     const handleStartConsultation = (record) => {
        console.log("Starting consultation for:", record);
        toast.success(`Starting consultation for ${record.patientName}`);
        // Add your consultation logic here
    };

    const fetchingAppointmentsFollowingDoctor = useCallback(async () => {
    setLoading(true);
        try {
            const response = await getAllAppointmentsFollowingDoctor(accountID);
            setData(response?.data?.data?.rowDatas || []);
        } catch (error) {
            toast.error(
                error?.response?.data?.message?.error || "Error fetching appointments"
            );
        }
        setLoading(false);
   }, [accountID])
   useEffect(() => {
    fetchingAppointmentsFollowingDoctor();
   },[fetchingAppointmentsFollowingDoctor])

    // Filter data based on status, service and patient name
    const filteredData = data.filter(appointment => {
        const statusMatch = statusFilter === "All" || appointment.status === statusFilter;
        const serviceMatch = serviceFilter === "All" || appointment.appointmentService === serviceFilter;
        const nameMatch = !searchPatientName || 
            appointment?.patient?.account?.fullName?.toLowerCase().includes(searchPatientName.toLowerCase()) ||
            appointment?.patient?.patientCodeAtFacility?.toLowerCase().includes(searchPatientName.toLowerCase());
        
        return statusMatch && serviceMatch && nameMatch;
    });
    const columns = [
        {
            title: 'Patient Information',
            key: 'patient',
            width: 280,
            render: (_, record) => {
                const fullName = record?.patient?.account?.fullName || record.patientName || "Unknown";
                const patientCode = record?.patient?.patientCodeAtFacility || "N/A";
                const imageUrl = record?.patient?.account?.profileImageUrl;

                return (
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Avatar
                            size={50}
                            src={imageUrl}
                            icon={!imageUrl && <UserOutlined />}
                            style={{
                                backgroundColor: "#1976d2",
                                border: "2px solid #f0f0f0"
                            }}
                        />
                        <div>
                            <div style={{ 
                                fontWeight: 600, 
                                fontSize: "15px",
                                color: "#1976d2",
                                marginBottom: "2px"
                            }}>
                                {fullName}
                            </div>
                            <div style={{ 
                                fontSize: 12, 
                                color: "#666",
                                background: "#f5f5f5",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                display: "inline-block"
                            }}>
                                Code: {patientCode}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            title: 'Contact Info',
            key: 'contact',
            width: 150,
            render: (_, record) => {
                const phone = record?.patient?.account?.phoneNumber;
                const email = record?.patient?.account?.email;

                return (
                    <div>
                        {phone && (
                            <div style={{ 
                                display: "flex", 
                                alignItems: "center", 
                                gap: 6,
                                marginBottom: "4px"
                            }}>
                                <PhoneOutlined style={{ color: "#1976d2", fontSize: "12px" }} />
                                <span style={{ fontSize: "13px" }}>{phone}</span>
                            </div>
                        )}
                        {email && (
                            <div style={{ 
                                fontSize: "12px", 
                                color: "#666",
                                wordBreak: "break-word"
                            }}>
                                {email}
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'Appointment Details',
            key: 'appointment',
            width: 220,
            render: (_, record) => {
                const date = dayjs(record.appointmentDate).format("DD/MM/YYYY");
                const time = record.appointmentTime?.slice(0, 5) || "N/A";
                
                return (
                    <div style={{
                        background: "#f8fafc",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0"
                    }}>
                        <div style={{ marginBottom: "6px" }}>
                            <CalendarOutlined style={{ color: "#1976d2", marginRight: "6px" }} />
                            <strong style={{ color: "#1976d2" }}>Date:</strong>
                            <span style={{ marginLeft: "4px", fontWeight: "500" }}>{date}</span>
                        </div>
                        <div style={{ marginBottom: "6px" }}>
                            <strong style={{ color: "#1976d2" }}>Time:</strong>
                            <span style={{ marginLeft: "4px", fontWeight: "500" }}>{time}</span>
                        </div>
                        <div>
                            <strong style={{ color: "#1976d2" }}>Type:</strong>
                            <Tag color="blue" style={{ marginLeft: "4px" }}>
                                {record.appointmentType}
                            </Tag>
                        </div>
                    </div>
                );
            },
        },
        {
            title: 'Service',
            dataIndex: 'appointmentService',
            key: 'appointmentService',
            width: 160,
            render: (service) => {
                const serviceMap = {
                    'PreTestCounseling': { text: 'Pre-Test Counseling', color: 'blue' },
                    'PostTestCounseling': { text: 'Post-Test Counseling', color: 'green' },
                    'HIVTesting': { text: 'HIV Testing', color: 'orange' },
                    'Consultation': { text: 'Consultation', color: 'purple' },
                };
                
                const serviceInfo = serviceMap[service] || { text: service, color: 'default' };
                
                return (
                    <Tag 
                        color={serviceInfo.color} 
                        style={{ 
                            fontWeight: 500, 
                            borderRadius: 6,
                            padding: "4px 8px"
                        }}
                    >
                        <MedicineBoxOutlined style={{ marginRight: "4px" }} />
                        {serviceInfo.text}
                    </Tag>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 130,
            render: (status) => {
                const statusConfig = {
                    'Scheduled': { color: 'blue', text: 'Scheduled' },
                    'CheckedIn': { color: 'green', text: 'Checked In' },
                    'InProgress': { color: 'orange', text: 'In Progress' },
                    'Completed': { color: 'purple', text: 'Completed' },
                    'Cancelled': { color: 'red', text: 'Cancelled' },
                    'NoShow': { color: 'default', text: 'No Show' },
                };
                
                const config = statusConfig[status] || { color: 'default', text: status };
                
                return (
                    <Tag 
                        color={config.color} 
                        style={{ 
                            fontWeight: 600, 
                            borderRadius: 8,
                            padding: "6px 12px",
                            fontSize: "12px"
                        }}
                    >
                        {config.text}
                    </Tag>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_, record) => {
                const canStartConsultation = record.status === 'CheckedIn';
                
                return (
                    <div style={{ display: "flex", gap: "8px" }}>
                        <Button
                            type={canStartConsultation ? "primary" : "default"}
                            size="small"
                            disabled={!canStartConsultation}
                            style={{
                                borderRadius: "6px",
                                fontWeight: "500",
                                backgroundColor: canStartConsultation ? "#1976d2" : undefined
                            }}
                            onClick={() => handleStartConsultation(record)}
                        >
                            {canStartConsultation ? "Start" : "Waiting"}
                        </Button>
                    </div>
                );
            },
        },
    ];

   
  return (
    <div style={{ padding: "16px" }}>
      <Card
        bordered={false}
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CalendarOutlined style={{ fontSize: "28px", color: "#1976d2" }} />
          <Title
            level={4}
            style={{ color: "#1976d2", fontWeight: "600", margin: 0 }}
          >
            My Appointments (Testing HIV)
          </Title>
        </div>

        {/* Filter Section */}
        <div 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "16px", 
            marginBottom: '20px',
            padding: "12px",
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            flexWrap: "wrap"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FilterOutlined style={{ color: "#1976d2", fontSize: "16px" }} />
            <span 
              style={{ 
                fontWeight: "600", 
                color: "#1976d2",
                fontSize: "14px",
                minWidth: "50px"
              }}
            >
              Status:
            </span>
            <Select
              style={{ 
                width: 160, 
                height: "36px"
              }}
              placeholder="Filter by Status"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              allowClear
            >
              <Select.Option value="All">📋 All Status</Select.Option>
              <Select.Option value="Scheduled">✅ Scheduled</Select.Option>
              <Select.Option value="CheckedIn">🏥 Checked In</Select.Option>
              <Select.Option value="InProgress">⚡ In Progress</Select.Option>
              <Select.Option value="Completed">🎯 Completed</Select.Option>
              <Select.Option value="Cancelled">❌ Cancelled</Select.Option>
              <Select.Option value="NoShow">👻 No Show</Select.Option>
            </Select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span 
              style={{ 
                fontWeight: "600", 
                color: "#1976d2",
                fontSize: "14px",
                minWidth: "55px"
              }}
            >
              Service:
            </span>
            <Select
              style={{ 
                width: 180, 
                height: "36px"
              }}
              placeholder="Filter by Service"
              value={serviceFilter}
              onChange={(value) => setServiceFilter(value)}
              allowClear
            >
              <Select.Option value="All">🗂️ All Services</Select.Option>
              <Select.Option value="Consultation">👨‍⚕️ Consultation</Select.Option>
              <Select.Option value="PreTestCounseling">🔍 Pre-Test Counseling</Select.Option>
              <Select.Option value="PostTestCounseling">✔️ Post-Test Counseling</Select.Option>
              <Select.Option value="HIVTesting">🧪 HIV Testing</Select.Option>
            </Select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span 
              style={{ 
                fontWeight: "600", 
                color: "#1976d2",
                fontSize: "14px",
                minWidth: "55px"
              }}
            >
              Patient:
            </span>
            <Input
              style={{ 
                width: 200, 
                height: "36px"
              }}
              placeholder="Search patient name or code..."
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
       
          pagination={{
            pageSize:3,
          }}
        />
      </Card>
    </div>
  )
}

export default AppointmentListByDoctorTestingAccountId
