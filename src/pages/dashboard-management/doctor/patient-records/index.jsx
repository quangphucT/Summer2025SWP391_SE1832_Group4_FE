import React, { useState } from 'react';
import { Table, Card, Input, Button, Space, Modal, Descriptions, Tag, Typography } from 'antd';
import { SearchOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Search } = Input;

const PatientRecords = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const patients = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      age: 30,
      gender: 'Nam',
      phone: '0123456789',
      email: 'nguyenvana@email.com',
      diagnosis: 'Cảm cúm',
      status: 'Đang điều trị',
      lastVisit: '2024-01-10',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      age: 25,
      gender: 'Nữ',
      phone: '0987654321',
      email: 'tranthib@email.com',
      diagnosis: 'Đau đầu',
      status: 'Đã khỏi',
      lastVisit: '2024-01-08',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      age: 45,
      gender: 'Nam',
      phone: '0555666777',
      email: 'levanc@email.com',
      diagnosis: 'Tiểu đường',
      status: 'Đang điều trị',
      lastVisit: '2024-01-12',
    },
  ];

  const columns = [
    {
      title: 'Tên bệnh nhân',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Tuổi',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      filters: [
        { text: 'Nam', value: 'Nam' },
        { text: 'Nữ', value: 'Nữ' },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: 'Chẩn đoán',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'Đang điều trị') color = 'processing';
        if (status === 'Đã khỏi') color = 'success';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Lần khám cuối',
      dataIndex: 'lastVisit',
      key: 'lastVisit',
      sorter: (a, b) => new Date(a.lastVisit) - new Date(b.lastVisit),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showPatientDetails(record)}
          >
            Chi tiết
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => editPatient(record)}
          >
            Chỉnh sửa
          </Button>
        </Space>
      ),
    },
  ];

  const showPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setIsModalVisible(true);
  };

  const editPatient = (patient) => {
    // Implement edit functionality
    console.log('Edit patient:', patient);
  };

  const handleSearch = (value) => {
    console.log('Search:', value);
  };

  return (
    <div>
      <Title level={2}>Hồ sơ bệnh nhân</Title>
      
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Search
            placeholder="Tìm kiếm bệnh nhân..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
        </Space>

        <Table
          columns={columns}
          dataSource={patients}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bệnh nhân`,
          }}
        />
      </Card>

      <Modal
        title="Chi tiết bệnh nhân"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={600}
      >
        {selectedPatient && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Tên bệnh nhân">{selectedPatient.name}</Descriptions.Item>
            <Descriptions.Item label="Tuổi">{selectedPatient.age}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">{selectedPatient.gender}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{selectedPatient.phone}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedPatient.email}</Descriptions.Item>
            <Descriptions.Item label="Chẩn đoán">{selectedPatient.diagnosis}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={selectedPatient.status === 'Đang điều trị' ? 'processing' : 'success'}>
                {selectedPatient.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Lần khám cuối">{selectedPatient.lastVisit}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default PatientRecords; 