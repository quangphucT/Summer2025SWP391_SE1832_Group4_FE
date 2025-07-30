import { toast } from "react-toastify";
import "./index.scss";

import { useEffect, useState, useCallback } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Row,
  Col,
  Divider,
  Card,
  Statistic,
  Tag,
  Space,
  Tooltip,
} from "antd";
import {
  FileTextOutlined,
  ExperimentOutlined,
  UserOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { getAllAppointmentsFollowingDoctor } from "../../../../apis/appointmentAPI/getAppointmentFollowingDoctorApi";
import { useSelector } from "react-redux";
import { createResultAfterTest } from "../../../../apis/doctorTestingAPI/createResultAfterTestApi";
import { updateAppointmentCompleted } from "../../../../apis/appointmentAPI/updateAppointmentCompletedApi";

const CheckedInAppointmentToday = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCreateResult, setLoadingCreateResult] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState({});
  const accountID = useSelector((store) => store?.user?.accountID);
  const [form] = Form.useForm();
  // modal create result
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchingAppointmentCheckedIn = useCallback(async () => {
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
  }, [accountID]);

  useEffect(() => {
    fetchingAppointmentCheckedIn();
  }, [fetchingAppointmentCheckedIn]);

  // Handle checkout - mark appointment as completed
  const handleCheckout = async (record) => {
    setLoadingCheckout(prev => ({ ...prev, [record.appointmentId]: true }));
    try {
      await updateAppointmentCompleted(record.appointmentId);
      toast.success(`✅ Successfully checked out ${record.patientName}`);
      // Refresh the appointments list
      fetchingAppointmentCheckedIn();
    } catch (error) {
      toast.error(
        error?.response?.data?.message?.error || "Error during checkout"
      );
    }
    setLoadingCheckout(prev => ({ ...prev, [record.appointmentId]: false }));
  };

  const columns = [
    {
      title: "#",
      dataIndex: "appointmentId",
      key: "index",
      width: 60,
      render: (text, record, index) => (
        <div className="table-index">{index + 1}</div>
      ),
    },
    {
      title: "Appointment",
      dataIndex: "appointmentId",
      key: "appointmentId",
      width: 120,
      render: (text) => (
        <div className="appointment-id">
          <Tag color="blue">#{text}</Tag>
        </div>
      ),
    },
    {
      title: "Patient Information",
      key: "patientInfo",
      width: 280,
      render: (_, record) => {
        const patientCode = record?.patient?.patientCodeAtFacility || "N/A";
        const name = record?.patientName || "N/A";
        const phone = record?.patient?.account?.phoneNumber || "N/A";
        return (
          <div className="patient-info">
            <div className="patient-name">
              <UserOutlined className="info-icon" />
              <strong>{name}</strong>
            </div>
            <div className="patient-detail">
              <MedicineBoxOutlined className="info-icon" />
              Code: {patientCode}
            </div>
            <div className="patient-detail">
              <PhoneOutlined className="info-icon" />
              {phone}
            </div>
          </div>
        );
      },
    },
    {
      title: "Appointment Details",
      key: "appointmentInfo",
      width: 200,
      render: (_, record) => {
        return (
          <div className="appointment-info">
            <div className="appointment-detail">
              <CalendarOutlined className="info-icon" />
              {record.appointmentTime}
            </div>
            <div className="appointment-detail">
              <Tag color="green">{record.appointmentType}</Tag>
            </div>
            <div className="appointment-detail service">
              {record.appointmentService}
            </div>
          </div>
        );
      },
    },
    {
      title: "Doctor",
      key: "doctor",
      width: 240,
      render: (_, record) => {
        const fullName = record?.doctor?.account?.fullName || "N/A";
        const email = record?.doctor?.account?.email || "N/A";
        const phoneNumber = record?.doctor?.account?.phoneNumber || "N/A";
        return (
          <div className="doctor-info">
            <div className="doctor-name">
              <UserOutlined className="info-icon" />
              <strong>{fullName}</strong>
            </div>
            <div className="doctor-detail">
              <MailOutlined className="info-icon" />
              {email}
            </div>
            <div className="doctor-detail">
              <PhoneOutlined className="info-icon" />
              {phoneNumber}
            </div>
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "appointmentId",
      key: "action",
      width: 200,
      fixed: "right",
      render: (text, record) => {
        const isCheckoutLoading = loadingCheckout[record.appointmentId];
        
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {/* <Tooltip title="Create HIV test result for this patient">
              <Button
                loading={loading}
                type="primary"
                icon={<FileTextOutlined />}
                onClick={() => {
                  handleOpenModaleCreateResult(record);
                }}
                className="action-button"
                style={{ marginBottom: "4px" }}
              >
                Create Result
              </Button>
            </Tooltip> */}
            
            <Tooltip title="Complete appointment and checkout patient">
              <Button
                loading={isCheckoutLoading}
                type="default"
                style={{
                  backgroundColor: "#ff7875",
                  borderColor: "#ff7875",
                  color: "#fff",
                  fontWeight: "500"
                }}
                onClick={() => handleCheckout(record)}
                className="action-button"
              >
                {isCheckoutLoading ? "Checking out..." : "Checkout"}
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ];
  // create result handling
  const handleOpenModaleCreateResult = (record) => {
    console.log("Value record: ", record);
    setIsModalOpen(true);
    form.setFieldsValue({
      appointmentId: record.appointmentId,
      patientName: record.patientName,
      patientCode: record.patient?.patientCodeAtFacility,
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
      // Don't auto-complete appointment here, let doctor decide when to checkout
      toast.success("✅ HIV test result created successfully!");
      setIsModalOpen(false);
      fetchingAppointmentCheckedIn();
      form.resetFields();
    } catch (error) {
      toast.error(
        error?.response?.data?.message?.error || "Error while creating result"
      );
    }
    setLoadingCreateResult(false);
  };
  return (
    <div className="hiv-checkedin-table">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <ExperimentOutlined className="header-icon" />
            <h2>HIV Testing - Checked-In Patients</h2>
          </div>
          <div className="header-stats">
            <Card className="stat-card">
              <Statistic
                title="Total Patients"
                value={data.length}
                prefix={<UserOutlined />}
                valueStyle={{
                  color: "#d32f2f",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
            </Card>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          rowKey="appointmentId"
          pagination={{
            pageSize: 3,
          }}
          size="middle"
          className="professional-table"
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
        />
      </div>

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
  );
};

export default CheckedInAppointmentToday;
