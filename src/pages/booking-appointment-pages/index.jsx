import './index.scss';
import { Form, Input, Button, Select, Row, Col } from 'antd';
import dieutrihiv from '../../assets/images/dieutri.png';

const { TextArea } = Input;
const { Option } = Select;

const BookingAppointment = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Appointment information:', values);
    // Send to server or handle logic
  };

  return (
    <div className="booking-wrapper">
      <Row gutter={32}>
        <Col xs={24} md={12}>
          <div className="left-content">
            <img
              src={dieutrihiv}
              alt="HIV consultation"
              className="booking-image"
            />
            <h2 className="booking-heading">HIV Treatment – ARV</h2>
            <p className="booking-description">
              ARV is one of the most widely used and effective antiretroviral drugs in HIV treatment.
            </p>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="form-box">
            <h3 className="form-title">BOOK A CONSULTATION</h3>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="service"
                rules={[{ required: true, message: 'Please select a service' }]}
              >
                <Select placeholder="Select a service">
                  <Option value="arv">HIV Treatment Consultation (ARV)</Option>
                  <Option value="prep">PrEP Usage Consultation</Option>
                  <Option value="test">Rapid HIV Testing</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="fullName"
                rules={[{ required: true, message: 'Please enter your full name' }]}
              >
                <Input placeholder="Full Name" />
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[{ required: true, message: 'Please enter your phone number' }]}
              >
                <Input placeholder="Phone Number" />
              </Form.Item>

              <Form.Item name="note">
                <TextArea rows={4} placeholder="Consultation content (optional)" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  SUBMIT REQUEST
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default BookingAppointment;
