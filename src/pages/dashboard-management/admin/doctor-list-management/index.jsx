import { toast } from "react-toastify";
import { getAllDoctors } from "../../../../apis/doctorApi/doctorApi";
import { updateAccountDoctor } from "../../../../apis/doctorApi/updateAccountDoctorApi";
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Card,
  Typography,
  Space,
  Avatar,
  Tag,
  Divider,
  Row,
  Col,
  InputNumber,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  MedicineBoxOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  BookOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const DoctorListManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [form] = Form.useForm();
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchingAllDoctor = async () => {
    setLoading(true);
    try {
      const response = await getAllDoctors();
      setData(response?.data?.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message?.error || "Error fetching doctors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingAllDoctor();
  }, []);

  const handleUpdateDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    form.setFieldsValue({
        specialty: doctor.specialty || "",
      qualifications: doctor.qualifications || "",
      yearsOfExperience: doctor.yearsOfExperience || 0,
      shortDescription: doctor.shortDescription || "",
    });
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setSelectedDoctor(null);
    form.resetFields();
  };

  const handleUpdateSubmit = async (values) => {
    if (!selectedDoctor) return;

    setUpdateLoading(true);
    try {
     await updateAccountDoctor(
        selectedDoctor.doctorId,
        values.specialty,
        values
      );
      toast.success("Doctor information updated successfully!");
      setModalVisible(false);
      setSelectedDoctor(null);
      form.resetFields();
      await fetchingAllDoctor(); // Refresh the list
    } catch (error) {
      toast.error(
        error?.response?.data?.message?.error ||
          "Error updating doctor information"
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  const getSpecialtyColor = (specialty) => {
    const colors = {
      Consultant: "blue",
      Testing: "orange",
      Therapy: "green",
    };
    return colors[specialty] || "default";
  };

  const columns = [
    {
      title: "Doctor ID",
      dataIndex: "doctorId",
      key: "doctorId",
      width: 120,
    },
    {
      title: "Doctor Information",
      key: "doctor",
      width: 280,
      render: (_, record) => {
        const fullName = record?.fullName || "Unknown";
        const email = record?.email || "N/A";
        const imageUrl = record?.profileImageUrl;
        const phone = record?.phoneNumber || "N/A";
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar
              size={60}
              src={imageUrl}
              icon={!imageUrl && <UserOutlined />}
              style={{
                backgroundColor: "#1976d2",
                border: "2px solid #f0f0f0",
              }}
            />
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#1976d2",
                  marginBottom: "4px",
                }}
              >
                {fullName}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#666",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <MailOutlined />
                {email}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#666",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <PhoneOutlined />
                {phone}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Relative Info",
      key: "relative",
      width: 160,
      render: (_, record) => {
        const qualifications = record?.qualifications;
        const yearsOfExperience = record?.yearsOfExperience;

        return (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: "6px",
              }}
            >
              <IdcardOutlined style={{ color: "#1976d2", fontSize: "12px" }} />
              <span style={{ fontSize: "13px" }}>{qualifications}</span>
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#666",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <IdcardOutlined />
              {yearsOfExperience}
            </div>
          </div>
        );
      },
    },
    {
      title: "Specialty",
      dataIndex: "specialty",
      key: "specialty",
      width: 120,
      render: (specialty) => (
        <Tag
          color={getSpecialtyColor(specialty)}
          style={{
            fontWeight: 600,
            borderRadius: 8,
            padding: "4px 12px",
          }}
        >
          <MedicineBoxOutlined style={{ marginRight: "4px" }} />
          {specialty}
        </Tag>
      ),
    },
    {
      title: "Professional Info",
      key: "professional",
      width: 200,
      render: (_, record) => (
        <div
          style={{
            background: "#f8fafc",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              marginBottom: "6px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <ClockCircleOutlined style={{ color: "#1976d2" }} />
            <span style={{ fontSize: "12px", fontWeight: "500" }}>
              {record.yearsOfExperience || 0} years experience
            </span>
          </div>
          <div
            style={{
              marginBottom: "6px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <TrophyOutlined style={{ color: "#1976d2" }} />
            <span style={{ fontSize: "12px", fontWeight: "500" }}>
              {record.qualifications || "Not specified"}
            </span>
          </div>
          {record.shortDescription && (
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}
            >
              <BookOutlined style={{ color: "#1976d2", marginTop: "2px" }} />
              <span
                style={{
                  fontSize: "12px",
                  color: "#666",
                  lineHeight: "1.4",
                }}
              >
                {record.shortDescription.length > 60
                  ? `${record.shortDescription.substring(0, 60)}...`
                  : record.shortDescription}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          size="small"
          style={{
            borderRadius: "6px",
            fontWeight: "500",
            backgroundColor: "#1976d2",
          }}
          onClick={() => handleUpdateDoctor(record)}
        >
          Update
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e2e8f0",
          marginTop: '-95px'
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <Avatar
              size={50}
              style={{ backgroundColor: "#1976d2" }}
              icon={<UserOutlined />}
            />
            <Title level={3} style={{ color: "#1976d2", margin: 0 }}>
              👨‍⚕️ Doctor Management
            </Title>
          </div>
          <Text type="secondary" style={{ fontSize: "16px" }}>
            Manage and update doctor information in the HIV Treatment System
          </Text>
        </div>

        <Divider />

        {/* Table */}
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          rowKey="doctorId"
          pagination={{
            pageSize: 10,
        
          }}
          
          bordered
          size="middle"
        />
      </Card>

      {/* Update Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <EditOutlined style={{ color: "#1976d2" }} />
            <span style={{ color: "#1976d2", fontWeight: "600" }}>
              Update Doctor Information
            </span>
          </div>
        }
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
        style={{ top: 20 }}
      >
        {selectedDoctor && (
          <div>
            {/* Doctor Header Info */}
            <div
              style={{
                background: "#f8fafc",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "24px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <Avatar
                  size={50}
                  src={selectedDoctor?.account?.profileImageUrl}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#1976d2" }}
                />
                <div>
                  <div
                    style={{
                      fontWeight: "600",
                      fontSize: "16px",
                      color: "#1976d2",
                    }}
                  >
                    {selectedDoctor?.account?.fullName}
                  </div>
                  <div style={{ color: "#666", fontSize: "14px" }}>
                    Specialty:{" "}
                    <Tag color={getSpecialtyColor(selectedDoctor.specialty)}>
                      {selectedDoctor.specialty}
                    </Tag>
                  </div>
                </div>
              </div>
            </div>

            {/* Update Form */}
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateSubmit}
              size="large"
            >
              <Row gutter={[16, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: "600", color: "#1976d2" }}>
                        <TrophyOutlined style={{ marginRight: "8px" }} />
                        Specialty
                      </span>
                    }
                    name="specialty"
                    rules={[
                      { required: true, message: "Please select specialty!" },
                    ]}
                  >
                    <Select
                      placeholder="Select a specialty"
                      style={{ borderRadius: "6px" }}
                    >
                      <Option value="Consultant">Consultant</Option>
                      <Option value="Testing">Testing</Option>
                      <Option value="Therapy">Therapy</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: "600", color: "#1976d2" }}>
                        <TrophyOutlined style={{ marginRight: "8px" }} />
                        Qualifications
                      </span>
                    }
                    name="qualifications"
                    rules={[
                      {
                        required: true,
                        message: "Please enter qualifications!",
                      },
                      {
                        max: 200,
                        message: "Qualifications cannot exceed 200 characters!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="e.g., MD, PhD in Infectious Diseases"
                      style={{ borderRadius: "6px" }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: "600", color: "#1976d2" }}>
                        <ClockCircleOutlined style={{ marginRight: "8px" }} />
                        Years of Experience
                      </span>
                    }
                    name="yearsOfExperience"
                    rules={[
                      {
                        required: true,
                        message: "Please enter years of experience!",
                      },
                      {
                        type: "number",
                        min: 0,
                        max: 50,
                        message: "Please enter a valid number (0-50)!",
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      max={50}
                      style={{ width: "100%", borderRadius: "6px" }}
                      placeholder="Enter years of experience"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: "600", color: "#1976d2" }}>
                        <BookOutlined style={{ marginRight: "8px" }} />
                        Short Description
                      </span>
                    }
                    name="shortDescription"
                    rules={[
                      {
                        required: true,
                        message: "Please enter a short description!",
                      },
                      {
                        max: 500,
                        message: "Description cannot exceed 500 characters!",
                      },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Brief description of the doctor's expertise and background..."
                      style={{ borderRadius: "6px" }}
                      showCount
                      maxLength={500}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={{ textAlign: "center", marginTop: "24px" }}>
                <Space size="large">
                  <Button
                    size="large"
                    onClick={handleModalCancel}
                    style={{
                      borderRadius: "6px",
                      minWidth: "100px",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={updateLoading}
                    size="large"
                    style={{
                      backgroundColor: "#1976d2",
                      borderRadius: "6px",
                      minWidth: "140px",
                      fontWeight: "600",
                    }}
                  >
                    {updateLoading ? "Updating..." : "Update Doctor"}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorListManagement;
