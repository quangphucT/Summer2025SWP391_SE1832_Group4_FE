
import { Table, Tag, Button, Avatar, Select, Input, Card, Typography, Modal, Form, Row, Col, Divider, Tooltip } from "antd";
import { CalendarOutlined, UserOutlined, PhoneOutlined, MedicineBoxOutlined, SearchOutlined, FilterOutlined, ExperimentOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./index.scss";


import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { getAllAppointmentsFollowingDoctor } from "../../../../apis/appointmentAPI/getAppointmentFollowingDoctorApi";
import { createResultAfterTest } from "../../../../apis/doctorTestingAPI/createResultAfterTestApi";


const { Title } = Typography;

const AppointmentListByDoctorTestingAccountId = () => {
    const accountID = useSelector((store) => store?.user?.accountID);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingCreateResult, setLoadingCreateResult] = useState(false);
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Filter states
    const [statusFilter, setStatusFilter] = useState("All");
    const [serviceFilter, setServiceFilter] = useState("All");
    const [searchPatientName, setSearchPatientName] = useState("");
     // create result handling
    const handleCreateResult = (record) => {
        console.log("Value record: ", record);
        setIsModalOpen(true);
        form.setFieldsValue({
            appointmentId: record.appointmentId,
            patientName: record?.patient?.account?.fullName || record.patientName,
            patientCode: record?.patient?.patientCodeAtFacility,
            appointmentTime: record.appointmentTime,
            appointmentType: record.appointmentType,
            appointmentService: record.appointmentService,
            doctorName: record.doctor?.account?.fullName,
        });
    };

    // Auto-determine test result based on CD4 and Viral Load values
    const determineTestResult = (cd4Count, viralLoad) => {
        // Convert values to numbers for comparison
        const cd4 = parseInt(cd4Count) || 0;
        const viral = parseInt(viralLoad) || 0;

        // Standard HIV test result criteria:
        if (cd4 >= 500 && viral <= 1000) {
            return "Negative";
        } else {
            return "Positive";
        }
    };

    const onFinish = async (values) => {
        setLoadingCreateResult(true);
        try {
            if (values.appointmentService === "RapidTest") {
                const payloadForRapidTest = {
                    appointmentId: values.appointmentId,
                    testType: values.appointmentService,
                    labName: values.labName,
                    doctorComments: values.doctorComments,
                    testResults: values.testResults,
                };
                await createResultAfterTest(payloadForRapidTest);
            } else {
                // Auto-determine result for PCR/ELISA tests
                const autoTestResult = determineTestResult(
                    values.cD4Count,
                    values.hivViralLoadValue
                );

                const payloadFor2Remaining = {
                    appointmentId: values.appointmentId,
                    testType: values.appointmentService,
                    cD4Count: values.cD4Count,
                    hivViralLoadValue: values.hivViralLoadValue,
                    labName: values.labName,
                    doctorComments: values.doctorComments,
                    testResults: autoTestResult, // Use auto-determined result
                };
                await createResultAfterTest(payloadFor2Remaining);
            }
            toast.success("✅ HIV test result created successfully!");
            setIsModalOpen(false);
            fetchingAppointmentsFollowingDoctor();
            form.resetFields();
        } catch (error) {
            toast.error(
                error?.response?.data?.message?.error || "Error while creating result"
            );
        }
        setLoadingCreateResult(false);
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
            width: 150,
            render: (_, record) => {
                return (
                    <div style={{ display: "flex", gap: "8px" }}>
                        <Button
                            type="primary"
                            size="small"
                            style={{
                                borderRadius: "6px",
                                fontWeight: "500",
                                backgroundColor: "#1976d2"
                            }}
                            onClick={() => handleCreateResult(record)}
                        >
                            Create Result
                        </Button>
                    </div>
                );
            },
        },
    ];

   
  return (
    <div  style={{ padding: "16px", height: "100%" }}>
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
            pageSize:2
          }}
        />
      </Card>

      {/* Modal for Creating Test Result */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ExperimentOutlined style={{ color: "#d32f2f" }} />
            HIV Test Result
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        width={700}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsModalOpen(false);
              form.resetFields();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loadingCreateResult}
            onClick={() => form.submit()}
          >
            Save Result
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Patient & Appointment Info */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Appointment ID" name="appointmentId">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Patient Name" name="patientName">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Patient Code" name="patientCode">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Test Results</Divider>

          {/* Test Information */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Test Type"
                name="appointmentService"
                rules={[
                  {
                    required: true,
                    message: "Please select test type!",
                  },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Lab Name"
                name="labName"
                rules={[
                  {
                    required: true,
                    message: "Please input lab name!",
                  },
                ]}
              >
                <Input placeholder="Enter laboratory name" />
              </Form.Item>
            </Col>
          </Row>

          {/* Test Values */}
          <Row gutter={16}>
            {form.getFieldValue("appointmentService") === "RapidTest" ? (
              // For RapidTest, show manual Test Result selection
              <Col span={12}>
                <Form.Item
                  label="Test Result"
                  name="testResults"
                  rules={[
                    {
                      required: true,
                      message: "Please select test result!",
                    },
                  ]}
                >
                  <Select placeholder="Select test result">
                    <Select.Option value="Positive">Positive</Select.Option>
                    <Select.Option value="Negative">Negative</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            ) : (
              <>
                <Col span={8}>
                  <Form.Item label="CD4 Count" name="cD4Count">
                    <Input
                      type="number"
                      placeholder="CD4 count"
                      addonAfter="cells/mm³"
                      onChange={(e) => {
                        const cd4Value = e.target.value;
                        const viralValue =
                          form.getFieldValue("hivViralLoadValue");
                        if (cd4Value || viralValue) {
                          const autoResult = determineTestResult(
                            cd4Value,
                            viralValue
                          );
                          form.setFieldsValue({ testResults: autoResult });
                        }
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="Viral Load Value" name="hivViralLoadValue">
                    <Input
                      placeholder="Viral load value"
                      addonAfter="copies/mL"
                      onChange={(e) => {
                        const viralValue = e.target.value;
                        const cd4Value = form.getFieldValue("cD4Count");
                        if (cd4Value || viralValue) {
                          const autoResult = determineTestResult(
                            cd4Value,
                            viralValue
                          );
                          form.setFieldsValue({ testResults: autoResult });
                        }
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="Auto-Determined Result" name="testResults">
                    <Input
                      disabled
                      placeholder="Result will be auto-determined"
                      style={{
                        backgroundColor:
                          form.getFieldValue("testResults") === "Positive"
                            ? "#ffebee"
                            : "#e8f5e8",
                        color:
                          form.getFieldValue("testResults") === "Positive"
                            ? "#d32f2f"
                            : "#2e7d32",
                        fontWeight: "bold",
                      }}
                    />
                  </Form.Item>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#666",
                      marginTop: "-16px",
                    }}
                  >
                    📋 Auto-determined based on:
                    <br />
                    • CD4 &lt; 200 or Viral Load &gt; 1000 = Positive
                    <br />• CD4 ≥ 500 and Viral Load &lt; 50 = Negative
                  </div>
                </Col>
              </>
            )}
          </Row>

          {/* Comments */}
          <Form.Item label="Doctor's Comments" name="doctorComments">
            <Input.TextArea
              rows={3}
              placeholder="Enter medical notes or recommendations..."
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AppointmentListByDoctorTestingAccountId
