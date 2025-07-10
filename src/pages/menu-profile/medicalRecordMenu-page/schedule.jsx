import React from 'react';
import { Button, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
const { Title } = Typography;

const MedicalRecordSchedule = ({ setSelectedKey }) => {
  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 32, background: '#fff', borderRadius: 24, boxShadow: '0 4px 24px rgba(30,58,138,0.08)' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        type="link"
        style={{ marginBottom: 16, fontWeight: 600, color: "#1e3a8a", fontSize: 16 }}
        onClick={() => setSelectedKey && setSelectedKey('medical')}
      >
        Back to Medical Records
      </Button>
      <Title level={2} style={{ color: '#1e3a8a', marginBottom: 32 }}>Medical Record Schedule</Title>
      {/* Nội dung lịch sẽ đặt ở đây */}
    </div>
  );
};

export default MedicalRecordSchedule;
