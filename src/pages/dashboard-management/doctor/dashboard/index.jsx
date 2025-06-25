import React from 'react';
import { Card, Row, Col, Statistic, Table, Typography } from 'antd';
import { UserOutlined, CalendarOutlined, FileTextOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const DoctorDashboard = () => {
  const recentAppointments = [
    {
      key: '1',
      patientName: 'Nguyễn Văn A',
      time: '09:00 AM',
      date: '2024-01-15',
      status: 'Scheduled',
    },
    {
      key: '2',
      patientName: 'Trần Thị B',
      time: '10:30 AM',
      date: '2024-01-15',
      status: 'Completed',
    },
    {
      key: '3',
      patientName: 'Lê Văn C',
      time: '02:00 PM',
      date: '2024-01-15',
      status: 'Pending',
    },
  ];

  const columns = [
    {
      title: 'Tên bệnh nhân',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'Completed') color = 'green';
        if (status === 'Scheduled') color = 'blue';
        if (status === 'Pending') color = 'orange';
        return <span style={{ color }}>{status}</span>;
      },
    },
  ];

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số bệnh nhân"
              value={156}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Lịch hẹn hôm nay"
              value={8}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Hồ sơ đã xử lý"
              value={142}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Thời gian làm việc"
              value="8h"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="Lịch hẹn gần đây">
            <Table
              columns={columns}
              dataSource={recentAppointments}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DoctorDashboard; 