var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
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
  Card,
} from "antd";
import "./index.scss";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LogoutOutlined,
  CalendarOutlined,
  FileTextOutlined,
  DollarCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import logoUser from "../../../assets/images/userProfile.png";
import AppointmentMenuPage from "../appointmentMenu-page";
import TransactionMenuPage from "../transactionMenu-page";
import MedicalRecordMenuPage from "../medicalRecordMenu-page";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeInformation } from "../../../redux/feature/userSlice";
import uploadFile from "../../../utils/upload";
import { toast } from "react-toastify";

const { Sider, Content } = Layout;
const { Title } = Typography;

const menuItems = [
  { key: "profile", icon: <UserOutlined />, label: "Profile" },
  { key: "appointment", icon: <CalendarOutlined />, label: "Appointment" },
  { key: "transaction", icon: <DollarCircleOutlined />, label: "Transaction" },
  { key: "medical", icon: <FileTextOutlined />, label: "Medical Record" },
  { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
];

const ProfilePage = () => {

  const userNameOnRedux = useSelector((store) => store?.user?.username)
  const userEmailOnRedux = useSelector((store) => store?.user?.email)
  const [form] = Form.useForm();
  const [selectedKey, setSelectedKey] = useState("profile");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      dispatch(removeInformation());
      localStorage.removeItem("token");
      navigate("/login-page");
      return;
    }
    setSelectedKey(key); // cập nhật nội dung hiển thị
  };

  const handleFinish = async (values) => {
    setLoading(true);
     try {
         const urlImageFromFirebase = await uploadFile(values.profileImageUrl.file.originFileObj);
         values.profileImageUrl = urlImageFromFirebase;
         console.log("Values:", values)
     } catch (error) {
      toast.error(error?.response?.data?.message || "Error while handling logic!")
     }

    setLoading(false);
  };

  // 💡 Nội dung động theo `selectedKey`
  const renderContent = () => {
    switch (selectedKey) {
      case "profile":
        return (
          <div className="profile-container">
            <div className="profile-glass-card">
              <Row gutter={[40, 20]} align="middle">
                <Col span={8} className="text-center">
                  <div className="avatar-wrapper">
                    <Image
                      preview={false}
                      src={logoUser}
                      width={160}
                      height={160}
                      style={{
                        borderRadius: "50%",
                        border: "5px solid white",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                        objectFit: "cover",
                      }}
                    />
                    <div className="upload-avatar mt-4"></div>
                    <div className="mt-4 text-[#1e88e5] font-semibold text-sm">
                      Welcome to {userNameOnRedux}
                    </div>
                     <div className=" text-[#7d8082] font-semibold text-[12px]">
                       {userEmailOnRedux}
                    </div> 
                  </div>
                </Col>
                <Col span={16}>
                  <Title level={3} className="gradient-text mb-4">
                    Edit Profile
                  </Title>
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    size="large"
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="name"
                          label="Full Name"
                          rules={[{ required: true }]}
                        >
                          <Input
                            prefix={<UserOutlined />}
                            placeholder="John Doe"
                            className="rounded-lg"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="email"
                          label="Email"
                          rules={[{ required: true, type: "email" }]}
                        >
                          <Input
                            prefix={<MailOutlined />}
                            placeholder="example@mail.com"
                            className="rounded-lg"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="phone"
                          label="Phone"
                          rules={[{ required: true }]}
                        >
                          <Input
                            prefix={<PhoneOutlined />}
                            placeholder="+84 999 999 999"
                            className="rounded-lg"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Upload profile image"
                          name={"profileImageUrl"}
                        >
                          <Upload
                            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                          >
                            {fileList.length >= 8 ? null : uploadButton}
                          </Upload>
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="w-full h-[45px] font-semibold rounded-full bg-[#1e88e5] hover:!bg-[#2968a7]"
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
          </div>
        );

      case "appointment":
        return <AppointmentMenuPage />;
      case "transaction":
        return <TransactionMenuPage />;
      case "medical":
        return <MedicalRecordMenuPage />;
      default:
        return null;
    }
  };
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const handlePreview = (file) =>
    __awaiter(void 0, void 0, void 0, function* () {
      if (!file.url && !file.preview) {
        file.preview = yield getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
    });
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  return (
    <Layout className="h-screen mt-[78px]">
      <Sider
        width={270}
        className="!bg-white text-black shadow-lg rounded-tr-xl rounded-br-xl"
      >
        <Menu
          mode="inline"
          theme="light"
          selectedKeys={[selectedKey]}
          items={menuItems}
          className="border-r-0 text-base font-semibold"
          onClick={handleMenuClick}
        />
      </Sider>

      <Content className="contentProfile-right">{renderContent()}</Content>

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </Layout>
  );
};

export default ProfilePage;
