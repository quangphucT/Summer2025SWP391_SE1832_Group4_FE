import {
  DatePicker,
  TimePicker,
  Radio,
  Select,
  Input,
  Button,
  Checkbox,
  Form,
  Col,
  Row,
} from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/vi';
import Symstom from '../../components/atoms/Symstom';
import { motion } from 'framer-motion';

dayjs.extend(customParseFormat);

const ScheduleAConsultation = () => {
  const [form] = Form.useForm();
  const [selectedType, setSelectedType] = useState('online-video');

  const onFinish = (values) => {
    console.log('Form values:', values);
    // Gửi API ở đây
  };

  return (
    <div className="min-h-screen bg-[#e0e7ff] p-6 mt-[75px]">
      <Row gutter={24} justify="center">
        {/* Bên trái: Symptom */}
        <Col xs={24} md={8}>
           <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <Symstom />
    </motion.div>
        </Col>

        {/* Bên phải: Form */}
        <Col xs={24} md={16}>
        
          <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="bg-white rounded-4xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
    >
            <h2 className="text-3xl font-bold text-[#1e88e5] mb-8 text-center">
              🗓️ Schedule A Consultation
            </h2>

            <Form
              form={form}
              name="scheduleConsultation"
              onFinish={onFinish}
              layout="vertical"
              initialValues={{
                appointmentDate: dayjs(),
                appointmentTime: dayjs('14:00', 'HH:mm'),
                consultationType: 'online-video',
                isAnonymous: false,
              }}
            >
              <Row gutter={16}>
                {/* Cột trái */}
                <Col xs={24} md={12}>
                  <Form.Item
                    name="appointmentDate"
                    label="Choose Date"
                    rules={[{ required: true, message: 'Date is required!' }]}
                  >
                    <DatePicker
                      className="w-full h-[45px]"
                      format="YYYY-MM-DD"
                      disabledDate={(current) =>
                        current && current < dayjs().startOf('day')
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    name="appointmentTime"
                    label="Choose Hour (30 minutes)"
                    rules={[{ required: true, message: 'Hour is required!' }]}
                  >
                    <TimePicker
                      className="w-full h-[45px]"
                      format="HH:mm"
                      minuteStep={30}
                    />
                  </Form.Item>

                  <Form.Item
                    name="reason"
                    label="Choose Consultation Type"
                    rules={[{ required: true, message: 'Type is required!' }]}
                  >
                    <Select
                      className="w-full !h-[45px]"
                      placeholder="Choose a consultation"
                      options={[
                        { value: 'test-hiv', label: 'HIV Testing' },
                        {
                          value: 'psychology',
                          label: 'Mental Health / Psychological Support',
                        },
                        {
                          value: 'new-diagnosis',
                          label: 'Newly Diagnosed with HIV',
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>

                {/* Cột phải */}
                <Col xs={24} md={12}>
                  <Form.Item
                    name="consultationType"
                    label="Consultation Method"
                    rules={[
                      { required: true, message: 'Consultation method required' },
                    ]}
                  >
                    <Radio.Group
                      className="flex flex-wrap gap-2"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <Radio.Button value="online-video">Video</Radio.Button>
                      <Radio.Button value="online-phone">Phone</Radio.Button>
                      <Radio.Button value="online-chat">Chat</Radio.Button>
                      <Radio.Button value="offline">In-person</Radio.Button>
                    </Radio.Group>
                  </Form.Item>

                  {selectedType === 'offline' && (
                    <Form.Item
                      name="location"
                      label="Location"
                      rules={[{ required: true, message: 'Location is required!' }]}
                    >
                      <Select
                        className="w-full !h-[45px]"
                        placeholder="Select location"
                        options={[
                          { value: 'hanoi', label: 'Hà Nội - 123 Đường ABC' },
                          { value: 'hcm', label: 'TP.HCM - 456 Đường XYZ' },
                        ]}
                      />
                    </Form.Item>
                  )}

                  <Form.Item name="isAnonymous" valuePropName="checked">
                    <Checkbox>Is Anonymous Consultation</Checkbox>
                  </Form.Item>
                </Col>

                {/* Ghi chú */}
                <Col span={24}>
                  <Form.Item name="notes" label="Notes">
                    <Input.TextArea rows={3} placeholder="Ghi chú thêm (nếu có)" />
                  </Form.Item>
                </Col>

                {/* Nút submit */}
                <Col span={24}>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="w-full !h-[47px] !font-bold !rounded-4xl"
                    >
                     Booking Now
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
        </motion.div>

        </Col>
      </Row>
    </div>
  );
};

export default ScheduleAConsultation;
