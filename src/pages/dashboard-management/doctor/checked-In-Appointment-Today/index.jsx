import { Card, List, Typography, Button, Modal, Form, Input, message } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import './index.scss';

const { Text } = Typography;

const mockData = [
  {
    id: 1,
    patientName: 'Nguyen Van A',
    time: '08:30 AM',
    service: 'Tư vấn HIV',
  },
  {
    id: 2,
    patientName: 'Tran Thi B',
    time: '09:45 AM',
    service: 'Khám da liễu',
  },
  {
    id: 3,
    patientName: 'Le Van C',
    time: '11:00 AM',
    service: 'Tư vấn sức khỏe',
  },
];

const CheckedInAppointmentToday = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleOpenModal = (item) => {
    setSelectedPatient(item);
    setOpen(true);
  };

  const handleFinish = (values) => {
    console.log('Tư vấn:', {
      ...values,
      patientId: selectedPatient.id,
    });
    message.success('Đã lưu lời khuyên tư vấn');
    setOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Card
        title="Lịch hẹn đã Check-in hôm nay"
        bordered={false}
        className="checked-in-card"
      >
        <List
          itemLayout="vertical"
          dataSource={mockData}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              className="checked-in-item"
              actions={[
                <Text type="success">
                  <CheckCircleOutlined /> Đã check-in
                </Text>,
                <Button type="primary" onClick={() => handleOpenModal(item)}>
                  Tư vấn
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={<Text strong>{item.patientName}</Text>}
                description={
                  <>
                    <div><Text type="secondary">Giờ hẹn:</Text> {item.time}</div>
                    <div><Text type="secondary">Dịch vụ:</Text> {item.service}</div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title={`Tư vấn cho ${selectedPatient?.patientName}`}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu"
      >
        <Form layout="vertical" form={form} onFinish={handleFinish}>
          <Form.Item name="diagnosis" label="Chẩn đoán">
            <Input.TextArea rows={3} placeholder="Nhập chẩn đoán..." />
          </Form.Item>
          <Form.Item name="advice" label="Lời khuyên & hướng dẫn">
            <Input.TextArea rows={3} placeholder="Nhập lời khuyên..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CheckedInAppointmentToday;
