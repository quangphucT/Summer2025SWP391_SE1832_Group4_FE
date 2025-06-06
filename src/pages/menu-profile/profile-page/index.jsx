import {
  Layout,
  Menu,
  Upload,
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Image,
} from "antd";
import './index.scss'
import {
  UploadOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  LogoutOutlined,
  CalendarOutlined,
  FileTextOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import logoUser from '../../../assets/images/userImage.png'
import AppointmentMenuPage from "../appointmentMenu-page";
import TransactionMenuPage from "../transactionMenu-page";
import MedicalRecordMenuPage from "../medicalRecordMenu-page";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeInformation } from "../../../redux/feature/userSlice";

const { Sider, Content } = Layout;
const { Title } = Typography;

const menuItems = [
  { key: "profile", icon: <UserOutlined />, label: "Profile" },
  { key: "appointment", icon: <CalendarOutlined />, label: "Appointment" },
  { key: "transaction", icon: <DollarCircleOutlined />, label: "Transaction" },
  { key: "medical", icon: <FileTextOutlined />, label: "Medical Record" },
  { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
];

const uploadProps = {
  name: "file",
  listType: "picture-card",
  showUploadList: false,
  beforeUpload: () => false,
};

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [selectedKey, setSelectedKey] = useState("profile");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      dispatch(removeInformation())
      localStorage.removeItem("token");
      navigate("/login-page");
      return;
    }
    setSelectedKey(key); // cập nhật nội dung hiển thị
  };

  const handleFinish = (values) => {
    console.log("Profile updated:", values);
  };

  // 💡 Nội dung động theo `selectedKey`
  const renderContent = () => {
    switch (selectedKey) {
      case "profile":
        return (
          <div className="mx-auto w-full max-w-4xl border border-gray-200 rounded-xl p-10 shadow-md">
            <Title className="text-center mb-8 gradient-text">Profile Information</Title>
            <Row gutter={32}>
              <Col span={9} className="flex flex-col items-center">
                <Image preview={false} width={150} height={150} src={logoUser} />
                <Upload {...uploadProps}></Upload>
                <Button icon={<UploadOutlined />} className="mt-4">
                  Upload Photo
                </Button>
              </Col>
              <Col span={15}>
                <Form form={form} layout="vertical" onFinish={handleFinish} size="large">
                  <Row gutter={16}>
                    <Col span={15}>
                      <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[{ required: true, type: "email" }]}
                      >
                        <Input style={{ height: '45px' }} prefix={<MailOutlined />} placeholder="Enter your email" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                        <Input style={{ height: '45px' }} prefix={<UserOutlined />} placeholder="Enter your full name" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
                        <Input style={{ height: '45px' }} prefix={<PhoneOutlined />} placeholder="Enter your phone number" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item className="text-center mb-0">
                        <Button
                          style={{ background: '#00566B', height: '45px', borderRadius: '30px', fontWeight: '700' }}
                          type="primary"
                          htmlType="submit"
                          className="w-full !bg-[#1e88e5] hover:!bg-[#2968a7]"
                        >
                          Save Changes
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </div>
        );
      case "appointment":
        return (
          <AppointmentMenuPage/>
        );
      case "transaction":
        return (
          <TransactionMenuPage/>
        );
      case "medical":
        return (
         <MedicalRecordMenuPage/>
        );
      default:
        return null;
    }
  };

  return (
    <Layout className="h-screen mt-[78px]">
      <Sider width={270} className="!bg-white text-black shadow-md">
        <Menu
          mode="inline"
          theme="light"
          selectedKeys={[selectedKey]}
          items={menuItems}
          className="border-r-0"
          onClick={handleMenuClick}
        />
      </Sider>
      <Content className="contentProfile-right">{renderContent()}</Content>
      
    </Layout>
  );
};

export default ProfilePage;
