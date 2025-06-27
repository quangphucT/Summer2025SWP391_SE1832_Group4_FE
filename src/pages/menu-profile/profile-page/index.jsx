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
import { useEffect, useState } from "react";
import logoUser from "../../../assets/images/userProfile.png";
import AppointmentMenuPage from "../appointmentMenu-page";
import TransactionMenuPage from "../transactionMenu-page";
import MedicalRecordMenuPage from "../medicalRecordMenu-page";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeInformation,
  updateProfile,
} from "../../../redux/feature/userSlice";
import uploadFile from "../../../utils/upload";
import { toast } from "react-toastify";
import { changePasswordApi } from "../../../apis/authenticationApi/changePasswordApi";
import { updateProfileApi } from "../../../apis/authenticationApi/updateProfileApi";
import { showSuccessToast } from "../../../components/atoms/ConfigToast";
import ModalDynamic from "../../../components/atoms/Modal";
import HIVTreatmentInfoCard from "../../../components/atoms/TopInformationHIV";

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
  const fullInformUserOnRedux = useSelector((store) => store?.user);
  const accountId = useSelector((store) => store?.user?.accountID);
  const userNameOnRedux = useSelector((store) => store?.user?.username);
  const userEmailOnRedux = useSelector((store) => store?.user?.email);
  const [form] = Form.useForm();
  const [formModalChangePassword] = Form.useForm();
  const [selectedKey, setSelectedKey] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [openModalChangePass, setOpenModalChangePass] = useState(false);
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
      // Nếu người dùng chọn ảnh mới
      if (values.profileImageUrl && values.profileImageUrl[0]?.originFileObj) {
        const urlImageFromFirebase = await uploadFile(
          values.profileImageUrl[0].originFileObj
        );
        values.profileImageUrl = urlImageFromFirebase;
      } else if (values.profileImageUrl && values.profileImageUrl[0]?.url) {
        // Người dùng không đổi ảnh, dùng ảnh cũ
        values.profileImageUrl = values.profileImageUrl[0].url;
      } else {
        values.profileImageUrl = ""; // hoặc null nếu bạn muốn gửi rỗng
      }

      dispatch(updateProfile(values));
        await updateProfileApi(accountId,values)
      console.log("Values:", values)
      toast.info("Updated profile successfully!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error while handling logic!!"
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    form.setFieldsValue({
      fullName: fullInformUserOnRedux?.fullName,
      username: fullInformUserOnRedux?.username,
      phoneNumber: fullInformUserOnRedux?.phone,
      profileImageUrl: [
        {
          uid: "-1",
          name: "profile.jpg",
          status: "done",
          url: fullInformUserOnRedux?.profileImageUrl,
        },
      ],
    });
    setFileList([
      {
        uid: "-1",
        name: "profile.jpg",
        status: "done",
        url: fullInformUserOnRedux?.profileImageUrl,
      },
    ]);
  }, [fullInformUserOnRedux]);

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
                    <button
                      onClick={() => {
                        setOpenModalChangePass(true);
                      }}
                      className="mt-2 cursor-pointer bg-amber-100 font-bold px-4 py-0.5 hover:text-[14.5px] rounded-2xl"
                    >
                      Change Your Password
                    </button>
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
                          name="fullName"
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
                          name="username"
                          label="Username"
                          rules={[{ required: true }]}
                        >
                          <Input
                            prefix={<MailOutlined />}
                            placeholder="example"
                            className="rounded-lg"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="phoneNumber"
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
                            //  showUploadList={{ showRemoveIcon: false }}
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
              <HIVTreatmentInfoCard/>
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

  const handleChange = ({ fileList: newFileList }) => {
    const latestFileList = newFileList.slice(-1);
    setFileList(latestFileList);
    form.setFieldsValue({ profileImageUrl: latestFileList });
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  const handleChangePassword = async (values) => {
    setLoading(true);
    try {
      await changePasswordApi(accountId, values);
      showSuccessToast("Change Password Successfully!!");
      formModalChangePassword.resetFields();
      setOpenModalChangePass(false);
      localStorage.clear();
      dispatch(removeInformation());
      navigate("/login-page");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error while handling logic"
      );
    }
    setLoading(false);
  };
  const formItem = (
    <>
      <Form.Item
        name="oldPassword"
        label="Old Password"
        rules={[{ required: true, message: "Please input your old password!" }]}
      >
        <Input.Password className="rounded-md py-2" />
      </Form.Item>
      <Form.Item
        name="newPassword"
        label="New Password"
        rules={[
          { required: true, message: "Please input your new password!" },
          { min: 6, message: "Password must be at least 6 characters" },
        ]}
      >
        <Input.Password className="rounded-md py-2" />
      </Form.Item>
    </>
  );
  return (
    <Layout className="h-[full] mt-[78px]">
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

      <ModalDynamic
        openModal={openModalChangePass}
        setOpenModal={setOpenModalChangePass}
        loading={loading}
        handleSubmit={handleChangePassword}
        titleModal={"Change Your Password"}
        formItem={formItem}
        formModal={formModalChangePassword}
      />
    </Layout>
  );
};

export default ProfilePage;
