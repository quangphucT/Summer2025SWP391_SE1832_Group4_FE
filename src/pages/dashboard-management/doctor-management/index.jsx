import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, Input, Select, Table, Typography, Space, TimePicker, InputNumber } from "antd";
import { getAllDoctorsApi } from "../../../apis/doctorApi/getAllDoctorsApi";
import ModalDynamic from "../../../components/atoms/Modal";
import { getAllRolesApi } from "../../../apis/doctorApi/getAllRoleApi";

const { Title } = Typography;

const DoctorManagement = () => {
  const [dataDoctors, setDataDoctors] = useState([]);
  const [roles, setRoles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchDataRole = async () => {
    try {
      const response = await getAllRolesApi();
      setRoles(response.data.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error while fetching roles!"
      );
    }
  };

  const fetchingDataDoctors = async () => {
    setLoading(true);
    try {
      const response = await getAllDoctorsApi();
      setDataDoctors(response.data.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error while fetching doctors!"
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchingDataDoctors();
    fetchDataRole();
  }, []);

  const columns = [
    {
      title: "DoctorId",
      dataIndex: "doctorId",
      key: "doctorId",
    },
    {
      title: "FullName",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "PhoneNumber",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
  ];

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Submitted values:", values);
        // TODO: Call API to create doctor here
        setOpenModal(false);
        form.resetFields();
      })
      .catch((err) => {
        console.log("Validation Failed", err);
      });
  };

  const formItem = (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Username is required!" }]}
      >
        <Input placeholder="Enter username" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            type: "email",
            message: "Valid email is required!",
          },
        ]}
      >
        <Input placeholder="Enter email" />
      </Form.Item>

      <Form.Item
        label="Full Name"
        name="fullName"
        rules={[{ required: true, message: "Full name is required!" }]}
      >
        <Input placeholder="Enter full name" />
      </Form.Item>

      <Form.Item
        label="Phone Number"
        name="phoneNumber"
        rules={[{ required: true, message: "Phone number is required!" }]}
      >
        <Input placeholder="Enter phone number" />
      </Form.Item>

      <Form.Item
        label="Role"
        name="roleId"
        rules={[{ required: true, message: "Role is required!" }]}
      >
        <Select placeholder="Select role">
          {roles.map((role) => (
            <Select.Option key={role.roleId} value={role.roleId}>
              {role.roleName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );


  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Title level={3}>Doctor Management</Title>
        <div style={{ textAlign: "right" }} className="space-x-1.5">
          <Button type="primary" onClick={() => setOpenModal(true)}>
            Add New Doctor
          </Button>

          <Button
            type="primary"
            onClick={() => {
              setModalSchedule(true);
            }}
          >
            Create Doctor Schedule
          </Button>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={dataDoctors}
          rowKey="id"
          bordered
        />
      </Space>

      <ModalDynamic
        openModal={openModal}
        setOpenModal={setOpenModal}
        formModal={form}
        loading={loading}
        handleSubmit={handleSubmit}
        titleModal={"Doctor Information"}
        formItem={formItem}
      />

     
    </div>
  );
};

export default DoctorManagement;
