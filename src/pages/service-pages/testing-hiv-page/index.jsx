import { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  Select,
  Row,
  Col,
} from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import "./index.scss";
import { motion } from "framer-motion";
import { getAvailableSchedulesDoctorsTesting } from "../../../apis/doctorApi/getAvailableSchedulesDoctorTestingApi";
import { toast } from "react-toastify";
import { createAppointment } from "../../../apis/appointmentAPI/createAppointmentApi";

const { TextArea } = Input;
const { Option } = Select;

const TestingHIVPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [form] =  Form.useForm();
  const fetchAvailableDoctors = async (date, time) => {
    try {
      const payload = {
        appointmentDate: date.format("YYYY-MM-DD"),
        appointmentTime: time.format("HH:mm:ss"),
      };
      const res = await getAvailableSchedulesDoctorsTesting(payload);
      setAvailableDoctors(res.data.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message?.error || "Error fetching doctors"
      );
    }
  };

  const onFinish = async (values) => {

    setLoading(true);
    const payload = {
      doctorId: values.doctorId,
      appointmentDate: values.appointmentDate.format("YYYY-MM-DD"),
      appointmentTime: values.appointmentTime.format("HH:mm:ss"),
      appointmentType: "Testing",
      appointmentService: values.appointmentService,
      appointmentNotes: values.appointmentNotes || "",
    };
    await createAppointment(payload)
    setAvailableDoctors([]);
    toast.success("Appointment booked successfully!");
    form.resetFields();
    setLoading(false)
  };

  return (
    <div className="bg-[#eef2ff] min-h-screen py-10 px-4 mt-16">
      <div className="max-w-6xl mx-auto">
        <Row gutter={32}>
          {/* LEFT: Info */}
          <Col xs={24} md={8}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-md h-full"
            >
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                Helpful Information Before Getting an HIV Test
              </h2>
              <p className="mb-3">
                If you're planning to get tested for HIV, here are some important things to keep in mind:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                <li><b>Know why you're testing:</b> Recommended after exposure or as a routine checkup.</li>
                <li><b>Testing is confidential:</b> Results are private and protected by law.</li>
                <li><b>Types of tests:</b> Some detect HIV within 2–4 weeks; others take longer.</li>
                <li><b>Early detection:</b> Enables faster treatment and better health outcomes.</li>
                <li><b>No symptoms ≠ no risk:</b> Only testing confirms your status.</li>
                <li><b>Low-cost options:</b> Many clinics offer free or affordable tests.</li>
              </ul>
            </motion.div>
          </Col>

          {/* RIGHT: Form */}
          <Col xs={24} md={16}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white p-6 rounded-2xl shadow-md"
            >
              <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                <CalendarOutlined className="text-xl" />
                Book an HIV Test Appointment
              </h2>

              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="appointmentService"
                      label={<span className="font-semibold text-red-500">* Choose Testing Type</span>}
                      rules={[{ required: true, message: "Please choose a testing type" }]}
                    >
                      <Select style={{ height: "45px" }} placeholder="Select testing type">
                        <Option value="RapidTest">Rapid HIV Test</Option>
                        <Option value="PCR">PCR HIV Test</Option>
                        <Option value="ELISA">ELISA</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="appointmentDate"
                      label={<span className="font-semibold text-red-500">* Choose Date</span>}
                      rules={[{ required: true, message: "Select a date" }]}
                    >
                      <DatePicker
                        onChange={(date) => {
                          setSelectedDate(date);
                          if (date && selectedTime) {
                            fetchAvailableDoctors(date, selectedTime);
                          }
                        }}
                        className="w-full"
                        style={{ height: "45px" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="appointmentTime"
                      label="Choose Hour (30 minutes)"
                      rules={[{ required: true, message: "Select time" }]}
                    >
                      <TimePicker
                        format="HH:mm"
                        minuteStep={30}
                        className="w-full"
                        style={{ height: "45px" }}
                        onChange={(time) => {
                          setSelectedTime(time);
                          if (selectedDate && time) {
                            fetchAvailableDoctors(selectedDate, time);
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Available Doctor"
                      name="doctorId"
                      rules={[{ required: true, message: "Please select a doctor" }]}
                    >
                      <Select
                        className="w-full"
                        style={{ height: "45px" }}
                        placeholder="Choose doctor"
                      
                      >
                        {availableDoctors.map((doc) => (
                          <Option key={doc.doctorId} value={doc.doctorId}>
                            {doc.account?.email || "Doctor"}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="appointmentNotes" label="Notes (optional)">
                  <TextArea rows={4} placeholder="Add any notes (optional)" />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="w-full text-white text-lg font-semibold py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    style={{ height: "45px", borderRadius: "30px" }}
                  >
                    Booking Now
                  </Button>
                </Form.Item>
              </Form>
            </motion.div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TestingHIVPage;
