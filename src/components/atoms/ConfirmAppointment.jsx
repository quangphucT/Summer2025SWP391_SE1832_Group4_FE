import { Modal, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

const ConfirmAppointmentModal = ({ open, onCancel, onConfirm, appointmentInfo, title, loading }) => {
  return (
    <Modal loading={loading}
      open={open}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Confirm"
      cancelText="Cancel"
      centered
      width={480}
      okButtonProps={{
        style: {
          backgroundColor: '#1e88e5',
          borderColor: '#1e88e5',
          fontWeight: 'bold',
        },
      }}
    >
      <div style={{ textAlign: 'center', paddingTop: 16, paddingBottom: 8 }}>
        <ExclamationCircleOutlined style={{ fontSize: 48, color: '#1e88e5', marginBottom: 16 }} />
        <Typography.Title level={4}>{title} This Appointment?</Typography.Title>
        <Paragraph style={{ marginBottom: 8 }}>
          You are about to {title} the appointment for:
        </Paragraph>
        <Paragraph>
          <strong>Patient:</strong> {appointmentInfo?.patient?.account?.fullName || 'N/A'} <br />
          <strong>Date:</strong> {appointmentInfo?.appointmentDate} <br />
          <strong>Time:</strong> {appointmentInfo?.appointmentTime?.slice(0, 5)} <br />
          <strong>Doctor:</strong> {appointmentInfo?.doctor?.account?.fullName || 'N/A'}
        </Paragraph>
      </div>
    </Modal>
  );
};

export default ConfirmAppointmentModal;
