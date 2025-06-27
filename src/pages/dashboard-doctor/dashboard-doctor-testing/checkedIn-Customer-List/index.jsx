import { toast } from "react-toastify";
import "./index.scss";

import { useEffect, useState } from "react";
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
  const accountID = useSelector((store) => store?.user?.accountID);
  const [form] = Form.useForm();
  // modal create result
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchingAppointmentCheckedIn = async () => {
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

  useEffect(() => {
    fetchingAppointmentCheckedIn();
  }, []);

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
      width: 150,
      fixed: "right",
      render: (text, record) => {
        return (
          <Tooltip title="Create HIV test result for this patient">
            <Button loading={loading}
              type="primary"
              icon={<FileTextOutlined />}
              onClick={() => {
                handleOpenModaleCreateResult(record);
              }}
              className="action-button"
            >
              Create Result
            </Button>
          </Tooltip>
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
        const payloadFor2Remaining = {
          appointmentId: values.appointmentId,
          testType: values.appointmentService,
          cD4Count: values.cD4Count,
          hivViralLoadValue: values.hivViralLoadValue,
          labName: values.labName,
          doctorComments: values.doctorComments,
          testResults: values.testResults,
        };
        await createResultAfterTest(payloadFor2Remaining);
      }
      await updateAppointmentCompleted(values.appointmentId);
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
              <></>
            ) : (
              <>
                <Col span={8}>
                  <Form.Item label="CD4 Count" name="cD4Count">
                    <Input
                      type="number"
                      placeholder="CD4 count"
                      addonAfter="cells/mm³"
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="Viral Load Value" name="hivViralLoadValue">
                    <Input
                      placeholder="Viral load value"
                      addonAfter="copies/mL"
                    />
                  </Form.Item>
                </Col>
              </>
            )}

            <Col span={8}>
              <Form.Item label="Test Result" name="testResults">
                <Select placeholder="Select test result">
                  <Select.Option value="Positive">Positive</Select.Option>
                  <Select.Option value="Negative">Negative</Select.Option>
                </Select>
              </Form.Item>
            </Col>
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
