import React, { useState } from 'react';
import { Table, Card, Button, Space, Tag, Modal, Descriptions, Typography, Calendar, Badge } from 'antd';
import { CheckOutlined, CloseOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Appointments = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const appointments = [
    {
      id: 1,
      patientName: 'Nguyễn Văn A',
      time: '09:00 AM',
      date: '2024-01-15',
      status: 'Scheduled',
      phone: '0123456789',
      reason: 'Khám định kỳ',
    },
    {
      id: 2,
      patientName: 'Trần Thị B',
      time: '10:30 AM',
      date: '2024-01-15',
      status: 'Completed',
      phone: '0987654321',
      reason: 'Đau đầu',
    },
    {
      id: 3,
      patientName: 'Lê Văn C',
      time: '02:00 PM',
      date: '2024-01-15',
      status: 'Cancelled',
      phone: '0555666777',
      reason: 'Tái khám',
    },
    {
      id: 4,
      patientName: 'Phạm Thị D',
      time: '03:30 PM',
      date: '2024-01-15',
      status: 'Scheduled',
      phone: '0111222333',
      reason: 'Khám mới',
    },
  ];

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      sorter: (a, b) => a.time.localeCompare(b.time),
    },
    {
      title: 'Tên bệnh nhân',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Lý do khám',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        let text = status;
        
        switch (status) {
          case 'Scheduled':
            color = 'processing';
            text = 'Đã lên lịch';
            break;
          case 'Completed':
            color = 'success';
            text = 'Hoàn thành';
            break;
          case 'Cancelled':
            color = 'error';
            text = 'Đã hủy';
            break;
          default:
            break;
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'Đã lên lịch', value: 'Scheduled' },
        { text: 'Hoàn thành', value: 'Completed' },
        { text: 'Đã hủy', value: 'Cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => showAppointmentDetails(record)}
          >
            Chi tiết
          </Button>
          {record.status === 'Scheduled' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => completeAppointment(record)}
              >
                Hoàn thành
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={() => cancelAppointment(record)}
              >
                Hủy
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const showAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalVisible(true);
  };

  const completeAppointment = (appointment) => {
    Modal.confirm({
      title: 'Xác nhận hoàn thành',
      content: `Bạn có chắc chắn muốn đánh dấu lịch hẹn với ${appointment.patientName} là hoàn thành?`,
      okText: 'Hoàn thành',
      cancelText: 'Hủy',
      onOk: () => {
        console.log('Complete appointment:', appointment);
      },
    });
  };

  const cancelAppointment = (appointment) => {
    Modal.confirm({
      title: 'Xác nhận hủy lịch hẹn',
      content: `Bạn có chắc chắn muốn hủy lịch hẹn với ${appointment.patientName}?`,
      okText: 'Hủy lịch hẹn',
      okType: 'danger',
      cancelText: 'Không',
      onOk: () => {
        console.log('Cancel appointment:', appointment);
      },
    });
  };

  const getListData = (value) => {
    const listData = [];
    appointments.forEach(appointment => {
      if (appointment.date === value.format('YYYY-MM-DD')) {
        listData.push({
          type: appointment.status === 'Completed' ? 'success' : 
                appointment.status === 'Cancelled' ? 'error' : 'warning',
          content: `${appointment.time} - ${appointment.patientName}`,
        });
      }
    });
    return listData;
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <Title level={2}>Quản lý lịch hẹn</Title>
      
      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ flex: 1 }}>
          <Card title="Lịch hẹn hôm nay" style={{ marginBottom: 16 }}>
            <Table
              columns={columns}
              dataSource={appointments}
              rowKey="id"
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                showTotal: (total) => `Tổng ${total} lịch hẹn`,
              }}
            />
          </Card>
        </div>
        
        <div style={{ width: 400 }}>
          <Card title="Lịch làm việc">
            <Calendar
              dateCellRender={dateCellRender}
              style={{ width: '100%' }}
            />
          </Card>
        </div>
      </div>

      <Modal
        title="Chi tiết lịch hẹn"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={500}
      >
        {selectedAppointment && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Tên bệnh nhân">{selectedAppointment.patientName}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{selectedAppointment.phone}</Descriptions.Item>
            <Descriptions.Item label="Ngày">{selectedAppointment.date}</Descriptions.Item>
            <Descriptions.Item label="Thời gian">{selectedAppointment.time}</Descriptions.Item>
            <Descriptions.Item label="Lý do khám">{selectedAppointment.reason}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={
                selectedAppointment.status === 'Scheduled' ? 'processing' :
                selectedAppointment.status === 'Completed' ? 'success' : 'error'
              }>
                {selectedAppointment.status === 'Scheduled' ? 'Đã lên lịch' :
                 selectedAppointment.status === 'Completed' ? 'Hoàn thành' : 'Đã hủy'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Appointments; 