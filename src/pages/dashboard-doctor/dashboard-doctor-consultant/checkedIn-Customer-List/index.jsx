import { toast } from "react-toastify";
import "./index.scss";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  TimePicker,
  Tag,
  Avatar,
  Card,
  Descriptions,
  Divider,
  Typography,
  Empty,
  Spin,
} from "antd";
import { 
  FileTextOutlined,
  UserOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
 
  IdcardOutlined,
} from "@ant-design/icons";
import { createAppointmentTest } from "../../../../apis/appointmentAPI/createAppointmentTestApi";
import { getAvailableSchedulesDoctorsTesting } from "../../../../apis/doctorApi/getAvailableSchedulesDoctorTestingApi";
import { getAllAppointmentsFollowingDoctor } from "../../../../apis/appointmentAPI/getAppointmentFollowingDoctorApi";
import { useSelector } from "react-redux";
import { updateAppointmentCompleted } from "../../../../apis/appointmentAPI/updateAppointmentCompletedApi";
import { getTestResultByPatientId } from "../../../../apis/Results/getTestResultByPatientIdAPI";

const { Title, Text } = Typography;

const CheckedInAppointmentToday = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFormCreateTest, setLoadingFormCreateTest] = useState(false);
  const [openModalFormAdvice, setOpenModalFormAdvice] = useState(false);
  const [openModalTestResult, setOpenModalTestResult] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [loadingTestResults, setLoadingTestResults] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  const accountID = useSelector((store) => store?.user?.accountID);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableDoctors, setAvailableDoctors] = useState([]);
   
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      if (!accountID) return;
      
      setLoading(true);
      try {
        const response = await getAllAppointmentsFollowingDoctor(accountID);
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

    fetchData();
  }, [accountID]);

  const fetchAvailableDoctors = async (date, time) => {
    try {
      const payload = {
        appointmentDate: date.format("YYYY-MM-DD"),
        appointmentTime: time.format("HH:mm:ss"),
      };
      const res = await getAvailableSchedulesDoctorsTesting(payload);
      setAvailableDoctors(res.data.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message?.error || "Error fetching doctors"
      );
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "appointmentId",
      key: "index",
      width: 70,
      align: "center",
      render: (text, record, index) => (
        <div className="index-number">{index + 1}</div>
      ),
    },
    {
      title: "Patient Information",
      key: "patientInfo",
      width: 250,
      render: (_, record) => {
        const patientCode = record?.patient?.patientCodeAtFacility || "N/A";
        const name = record?.patientName || "N/A";
        const phone = record?.patient?.account?.phoneNumber || "N/A";
        const patientId = record?.patient?.patientId || "N/A";
        return (
          <div className="patient-info">
            <div className="patient-row">
              <UserOutlined className="info-icon" />
              <span className="patient-name">{name}</span>
            </div>
            <div className="patient-row">
              <IdcardOutlined className="info-icon" />
              <span>Mã: {patientCode}</span>
            </div>
            <div className="patient-row">
              <PhoneOutlined className="info-icon" />
              <span>{phone}</span>
            </div>
             <div className="patient-row">
              <IdcardOutlined className="info-icon" />
              <span>Patient ID: <strong>{patientId}</strong></span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Appointment Info",
      key: "appointmentInfo",
      width: 200,
      render: (_, record) => {
        return (
          <div className="appointment-info">
            <div className="appointment-row">
              <ClockCircleOutlined className="info-icon" />
              <span>{record.appointmentTime}</span>
            </div>
            <div className="appointment-row">
              <Tag color="blue" className="appointment-tag">
                {record.appointmentType}
              </Tag>
            </div>
            <div className="appointment-row">
              <Tag color="green" className="appointment-tag">
                {record.appointmentService}
              </Tag>
            </div>
          </div>
        );
      },
    },
    {
      title: "Doctor Information",
      key: "doctor",
      width: 180,
      render: (_, record) => {
        const doctorName = record?.doctor?.account?.fullName || "N/A";
        return (
          <div className="doctor-info">
            <Avatar 
              size={28} 
           
              className="doctor-avatar"
            />
            <span className="doctor-name">{doctorName}</span>
          </div>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      align: "center",
      render: () => (
        <Tag color="success" className="status-tag">
          CheckedIn
        </Tag>
      ),
    },
    {
      title: "Action",
      dataIndex: "appointmentId",
      key: "appointmentId",
      width: 150,
      align: "center",
      render: (text, record) => {
        return (
        <>

          { record?.appointmentService === "PreTestCounseling" ? (
            <>
              <Button
            onClick={() => {
              handleOpenFormAdvise(record);
            }}
            type="primary"
            icon={<FileTextOutlined />}
            className="action-button"
            size="small"
          >
            Medical Advice & Register Test
          </Button>
            </>
          ) : (
            <div className="flex space-x-2.5">
              <Button
            onClick={() => {
              handleOpenFormAdvise(record);
            }}
            type="primary"
            icon={<FileTextOutlined />}
            className="action-button"
            size="small"
          >
            Medical Advice & Register Test
          </Button>
             <Button
            onClick={() => {handleOpenTestResult(record)}}
            type="primary"
            icon={<FileTextOutlined />}
            className="action-button"
            size="small"
          >
            View Result Test
          </Button>
            </div>
          ) }
          

         
        </>
        );
      },
    },
  ];

  // handle open test result
  const handleOpenTestResult = async (record) => {
    setLoadingTestResults(true);
    setOpenModalTestResult(true);
    const patientId = record?.patient?.patientId;
    
    try {
      const response = await getTestResultByPatientId(patientId);
      const testResults = response.data.data || [];
      setTestResults(testResults);

      
    } catch {
      toast.error("Error fetching test results");
      setTestResults([]);
    }
    setLoadingTestResults(false);
  };   

  const handleOpenFormAdvise = (record) => {
    setSelectedRecord(record);
    setOpenModalFormAdvice(true);
  };

  const handleFinish = async (values) => {
    setLoadingFormCreateTest(true);

    try {
      const formatted = {
        doctorId: values.doctorId,
        patientId: selectedRecord?.patient?.patientId,
        appointmentDate: values.appointmentDate?.format("YYYY-MM-DD"),
        appointmentTime: values.appointmentTime?.format("HH:mm:ss"),
        appointmentType: "Testing",
        appointmentService: values.hivTestType,
        appointmentNotes: values.medicalNote,
      };
      console.log("Formatted:", formatted);
      await createAppointmentTest(formatted);
      await updateAppointmentCompleted(selectedRecord.appointmentId);
      toast.success("Created successfuly");
      form.resetFields();
      setAvailableDoctors([]);
      setSelectedRecord(null);
      setOpenModalFormAdvice(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error while handling logic!"
      );
    }
    setLoadingFormCreateTest(false);
  };

  
  return (
    <div className="checked-in-appointment-table">
      <h2
        style={{
          marginBottom: 0,
          color: "#000",
          fontWeight: "bold",
          fontSize: "30px",
        }}
      >
        List of Checked-In Patients (Consultant)
      </h2>
      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        rowKey="appointmentId"
        pagination={{
          pageSize: 4,
    
        }}
    
        className="modern-table"
      />

      <Modal
        width={900}
        open={openModalFormAdvice}
        footer={[
          <Button
            onClick={() => {
              form.resetFields();
              setOpenModalFormAdvice(false);
              setSelectedRecord(null);
            }}
          >
            Cancel
          </Button>,
          <Button
            loading={loadingFormCreateTest}
            onClick={() => {
              form.submit();
            }}
          >
            Submit
          </Button>,
        ]}
        onCancel={() => {
          form.resetFields();
          setOpenModalFormAdvice(false);
          setSelectedRecord(null);
        }}
        onOk={() => form.submit()}
        title="Medical Advice & HIV Test Registration"
        okText="Submit"
        cancelText="Cancel"
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Medical Advice / Notes"
            name="medicalNote"
            rules={[{ required: true, message: "Please enter advice or note" }]}
          >
            <Input.TextArea
              rows={5}
              placeholder="E.g., recommend HIV test, explain procedure..."
            />
          </Form.Item>

          <div
            style={{
              border: "1px solid #eee",
              padding: 16,
              borderRadius: 8,
              marginTop: 12,
              backgroundColor: "#f9f9f9",
            }}
          >
            <h4 style={{ color: "#2968a7" }}>HIV Test Registration</h4>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Test Date"
                  name="appointmentDate"
                  rules={[
                    { required: true, message: "Please select a test date" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%", height: "45px" }}
                    onChange={(date) => {
                      setSelectedDate(date);
                      if (date && selectedTime) {
                        fetchAvailableDoctors(date, selectedTime);
                      }
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="appointmentTime"
                  label="Choose Hour (30 minutes)"
                  rules={[{ required: true, message: "Hour is required!" }]}
                >
                  <TimePicker
                    className="w-full h-[45px]"
                    format="HH:mm"
                    minuteStep={30}
                    style={{ width: "100%" }}
                    onChange={(time) => {
                      setSelectedTime(time);
                      if (selectedDate && time) {
                        fetchAvailableDoctors(selectedDate, time);
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Available Doctor"
                  name="doctorId"
                  rules={[
                    { required: true, message: "Please select a doctor" },
                  ]}
                >
                  <Select
                    className="!h-[45px]"
                    placeholder="Choose an available doctor"
                    loading={availableDoctors.length === 0}
                  >
                    {availableDoctors.map((doc) => (
                      <Select.Option key={doc.doctorId} value={doc.doctorId}>
                        {doc.account.email} - {doc.account.fullName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Test Type"
                  name="hivTestType"
                  rules={[
                    { required: true, message: "Please select test type" },
                  ]}
                >
                  <Select
                    className="!h-[45px]"
                    placeholder="Choose a test type"
                  >
                    <Select.Option value="RapidTest">Rapid Test</Select.Option>
                    <Select.Option value="PCR">PCR</Select.Option>
                    <Select.Option value="ELISA">ELISA</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal>

      {/* Test Results Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-blue-600" />
            <span>Patient Test Results</span>
          </div>
        }
        open={openModalTestResult}
        onCancel={() => {
          setOpenModalTestResult(false);
          setTestResults([]);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setOpenModalTestResult(false);
              setTestResults([]);
            }}
          >
            Close
          </Button>
        ]}
        width={1000}
        centered
      >
        <div className="test-results-content">
          {loadingTestResults ? (
            <div className="flex justify-center items-center py-8">
              <Spin size="large" />
              <span className="ml-3">Loading test results...</span>
            </div>
          ) : testResults.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No test results found for this patient"
            />
          ) : (
            <div className="space-y-4">
              <Title level={4}>Test Results ({testResults.length})</Title>
              {testResults.map((result, index) => (
                <Card 
                  key={result.testResultId || index}
                  className="test-result-card"
                  size="small"
                >
                   <span>TestResultId: {result.testResultId}</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Descriptions
                      title="Test Information"
                      column={1}
                      size="small"
                      bordered
                    >
                      <Descriptions.Item label="Test Type">
                        <Tag color="blue">{result.testType}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Test Date">
                        {new Date(result.testDate).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Descriptions.Item>
                      <Descriptions.Item label="Lab Name">
                        {result.labName || 'N/A'}
                      </Descriptions.Item>
                    </Descriptions>

                    <Descriptions
                      title="Results"
                      column={1}
                      size="small"
                      bordered
                    >
                      <Descriptions.Item label="Test Result">
                        <Tag 
                          color={result.testResults === 'Positive' ? 'red' : 
                                result.testResults === 'Negative' ? 'green' : 'orange'}
                          className="font-semibold"
                        >
                          {result.testResults}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="CD4 Count">
                        {result.cD4Count || 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="HIV Viral Load">
                        {result.hivViralLoadValue || 'N/A'}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>

                  {result.doctorComments && (
                    <div className="mt-4">
                      <Divider orientation="left" className="text-sm">
                        Doctor Comments
                      </Divider>
                      <Text className="text-gray-600 italic">
                        "{result.doctorComments}"
                      </Text>
                    </div>
                  )}

                  <div className="mt-3 text-right">
                    <Text type="secondary" className="text-xs">
                      Patient Code: {result.patient?.patientCodeAtFacility || 'N/A'}
                    </Text>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CheckedInAppointmentToday;
