import { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  Select,
} from "antd";
import { 
  CalendarOutlined, 
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  HeartOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import "./index.scss";
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
  const [form] = Form.useForm();

  const fetchAvailableDoctors = async (date, time) => {
    try {
    
       const appointmentDate = date.format("YYYY-MM-DD")
      const appointmentTime =  time.format("HH:mm:ss")
      
      const res = await getAvailableSchedulesDoctorsTesting(appointmentDate, appointmentTime);
      setAvailableDoctors(res.data.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message?.error || "Error fetching doctors"
      );
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        doctorId: values.doctorId,
        appointmentDate: values.appointmentDate.format("YYYY-MM-DD"),
        appointmentTime: values.appointmentTime.format("HH:mm:ss"),
        appointmentType: "Testing",
        appointmentService: values.appointmentService,
        appointmentNotes: values.appointmentNotes || "",
      };
      await createAppointment(payload);
      setAvailableDoctors([]);
      toast.success("Appointment booked successfully!");
      form.resetFields();
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (error) {
      toast.error(error?.response?.data?.message?.error || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hiv-testing-page">
      {/* Floating Elements */}
      <div className="floating-element element-1"></div>
      <div className="floating-element element-2"></div>
      <div className="floating-element element-3"></div>
      <div className="floating-element element-4"></div>

      <div className="page-container">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">
            HIV Testing Center
          </h1>
          <p className="hero-subtitle">
            Professional, Confidential, and Comprehensive HIV Testing Services
          </p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Accuracy Rate</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15min</span>
              <span className="stat-label">Rapid Results</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Info Section */}
          <div className="info-section">
            <div className="section-card">
              <h2 className="section-title">
                <SafetyCertificateOutlined className="title-icon" />
                Important Information
              </h2>
              <div className="info-content">
                <div className="info-item">
                  <HeartOutlined className="item-icon" />
                  <div className="item-content">
                    <div className="item-title">Why Test for HIV?</div>
                    <div className="item-description">
                      Early detection enables faster treatment and better health outcomes. Testing is recommended after potential exposure or as routine health screening.
                    </div>
                  </div>
                </div>

                <div className="info-item">
                  <SafetyCertificateOutlined className="item-icon" />
                  <div className="item-content">
                    <div className="item-title">Confidential & Secure</div>
                    <div className="item-description">
                      All test results are completely confidential and protected by medical privacy laws. Your information is secure with us.
                    </div>
                  </div>
                </div>

                <div className="info-item">
                  <ClockCircleOutlined className="item-icon" />
                  <div className="item-content">
                    <div className="item-title">Testing Types Available</div>
                    <div className="item-description">
                      • Rapid Test: Results in 15-20 minutes<br/>
                      • PCR Test: High accuracy, results in 24-48 hours<br/>
                      • ELISA: Standard screening test
                    </div>
                  </div>
                </div>

                <div className="info-item">
                  <CheckCircleOutlined className="item-icon" />
                  <div className="item-content">
                    <div className="item-title">What to Expect</div>
                    <div className="item-description">
                      Our professional medical staff will guide you through the entire process with compassion and expertise.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="booking-section">
            <div className="booking-card">
              <h2 className="booking-title">
                Book Your HIV Test Appointment
              </h2>

              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                  name="appointmentService"
                  label="Testing Type"
                  rules={[{ required: true, message: "Please choose a testing type" }]}
                >
                  <Select 
                    placeholder="Select testing type"
                    suffixIcon={<FileTextOutlined />}
                  >
                    <Option value="RapidTest">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ClockCircleOutlined style={{ color: '#4ecdc4' }} />
                        Rapid HIV Test
                      </div>
                    </Option>
                    <Option value="PCR">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <SafetyCertificateOutlined style={{ color: '#ff6b6b' }} />
                        PCR HIV Test 
                      </div>
                    </Option>
                    <Option value="ELISA">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircleOutlined style={{ color: '#45b7d1' }} />
                        ELISA Standard Test
                      </div>
                    </Option>
                  </Select>
                </Form.Item>

                <div className="form-row">
                  <Form.Item
                    name="appointmentDate"
                    label="Appointment Date"
                    rules={[{ required: true, message: "Please select a date" }]}
                  >
                    <DatePicker
                      onChange={(date) => {
                        setSelectedDate(date);
                        if (date && selectedTime) {
                          fetchAvailableDoctors(date, selectedTime);
                        }
                      }}
                      className="w-full"
                      suffixIcon={<CalendarOutlined />}
                      placeholder="Select date"
                    />
                  </Form.Item>

                  <Form.Item
                    name="appointmentTime"
                    label="Appointment Time"
                    rules={[{ required: true, message: "Please select time" }]}
                  >
                    <TimePicker
                      format="HH:mm"
                      minuteStep={30}
                      className="w-full"
                      suffixIcon={<ClockCircleOutlined />}
                      placeholder="Select time"
                      onChange={(time) => {
                        setSelectedTime(time);
                        if (selectedDate && time) {
                          fetchAvailableDoctors(selectedDate, time);
                        }
                      }}
                    />
                  </Form.Item>
                </div>

                <Form.Item
                  label="Available Doctor"
                  name="doctorId"
                  rules={[{ required: true, message: "Please select a doctor" }]}
                >
                  <Select
                    placeholder="Choose available doctor"
                    suffixIcon={<UserOutlined />}
                    notFoundContent={
                      selectedDate && selectedTime 
                        ? "No doctors available for this time slot" 
                        : "Please select date and time first"
                    }
                  >
                    {availableDoctors.map((doc) => (
                      <Option key={doc.doctorId} value={doc.doctorId}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <UserOutlined style={{ color: '#667eea' }} />
                          Dr. {doc.account?.email?.split('@')[0] || "Professional"}
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="appointmentNotes" label="Additional Notes (Optional)">
                  <TextArea 
                    rows={4} 
                    placeholder="Any specific concerns or questions you'd like to discuss..."
                  />
                </Form.Item>

                <div className="submit-section">
                  <Button 
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="submit-button"
                    icon={!loading && <CalendarOutlined />}
                  >
                    {loading ? "Booking..." : "Book Appointment"}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestingHIVPage;
