import React, { useState } from 'react';
import { Card, Form, Input, Button, Avatar, Row, Col, Typography, message, Divider, Tag, Space } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const DoctorProfile = () => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState({
    name: 'Dr. John Smith',
    email: 'john.smith@hospital.com',
    phone: '+84 123 456 789',
    specialization: 'Cardiology',
    experience: '15 years',
    education: 'MD - Harvard Medical School',
    license: 'MD-12345',
    address: '123 Medical Center, District 1, Ho Chi Minh City',
    bio: 'Experienced cardiologist with over 15 years of practice in cardiovascular diseases. Specialized in interventional cardiology and preventive care.',
  });

  const handleEdit = () => {
    setEditing(true);
    form.setFieldsValue(doctorInfo);
  };

  const handleSave = () => {
    form.validateFields()
      .then((values) => {
        setDoctorInfo({ ...doctorInfo, ...values });
        setEditing(false);
        message.success('Thông tin đã được cập nhật thành công!');
      })
      .catch(() => {
        message.error('Vui lòng kiểm tra lại thông tin!');
      });
  };

  const handleCancel = () => {
    setEditing(false);
    form.resetFields();
  };

  return (
    <div>
      <Title level={2}>Thông tin cá nhân</Title>
      
      <Row gutter={24}>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Avatar
                size={120}
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                style={{ marginBottom: 16 }}
              />
              <Title level={3}>{doctorInfo.name}</Title>
              <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                {doctorInfo.specialization}
              </Tag>
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">
                  <MailOutlined /> {doctorInfo.email}
                </Text>
                <br />
                <Text type="secondary">
                  <PhoneOutlined /> {doctorInfo.phone}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col span={16}>
          <Card
            title="Thông tin chi tiết"
            extra={
              !editing ? (
                <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                  Chỉnh sửa
                </Button>
              ) : (
                <Space>
                  <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                    Lưu
                  </Button>
                  <Button icon={<CloseOutlined />} onClick={handleCancel}>
                    Hủy
                  </Button>
                </Space>
              )
            }
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={doctorInfo}
              disabled={!editing}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Nhập họ tên" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="Nhập email" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                  >
                    <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="specialization"
                    label="Chuyên môn"
                    rules={[{ required: true, message: 'Vui lòng nhập chuyên môn' }]}
                  >
                    <Input placeholder="Nhập chuyên môn" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="experience"
                    label="Kinh nghiệm"
                    rules={[{ required: true, message: 'Vui lòng nhập kinh nghiệm' }]}
                  >
                    <Input placeholder="Ví dụ: 15 years" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="license"
                    label="Số giấy phép hành nghề"
                    rules={[{ required: true, message: 'Vui lòng nhập số giấy phép' }]}
                  >
                    <Input placeholder="Nhập số giấy phép" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="education"
                label="Học vấn"
                rules={[{ required: true, message: 'Vui lòng nhập thông tin học vấn' }]}
              >
                <Input placeholder="Nhập thông tin học vấn" />
              </Form.Item>

              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
              >
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>

              <Form.Item
                name="bio"
                label="Tiểu sử"
                rules={[{ required: true, message: 'Vui lòng nhập tiểu sử' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Nhập tiểu sử và thông tin chuyên môn..."
                />
              </Form.Item>
            </Form>
          </Card>

          <Card title="Thống kê hoạt động" style={{ marginTop: 16 }}>
            <Row gutter={16}>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <Title level={2} style={{ color: '#1890ff', margin: 0 }}>156</Title>
                  <Text type="secondary">Bệnh nhân đã khám</Text>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <Title level={2} style={{ color: '#52c41a', margin: 0 }}>142</Title>
                  <Text type="secondary">Lịch hẹn hoàn thành</Text>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <Title level={2} style={{ color: '#722ed1', margin: 0 }}>8</Title>
                  <Text type="secondary">Lịch hẹn hôm nay</Text>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <Title level={2} style={{ color: '#fa8c16', margin: 0 }}>4.8</Title>
                  <Text type="secondary">Đánh giá trung bình</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DoctorProfile; 