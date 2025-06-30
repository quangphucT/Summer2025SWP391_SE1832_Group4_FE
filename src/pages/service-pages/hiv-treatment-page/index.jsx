import { useState } from "react";
import {
  Form,
  DatePicker,
  TimePicker,
  Card,
  Button,
  Typography,
  Row,
  Col,
  Input,
  Spin,
  message,
  Select,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
  HeartOutlined,
  InfoCircleOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { getAvailableSchedulesDoctorsTherapy } from "../../../apis/doctorApi/getAllAvailableSchedulesDoctorTherapyApi";
import "./index.scss";
import { toast } from "react-toastify";
import { createAppointment } from "../../../apis/appointmentAPI/createAppointmentApi";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const BookingTreatmentHIV = () => {
  const [form] = Form.useForm();
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fetchAvailableDoctors = async (date, time) => {
    setLoading(true);
    try {
      const appointmentDate = date.format("YYYY-MM-DD");
      const appointmentTime = time.format("HH:mm:ss");

      const res = await getAvailableSchedulesDoctorsTherapy(
        appointmentDate,
        appointmentTime
      );
      setAvailableDoctors(res.data.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message?.error || "Error fetching doctors"
      );
    }
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const appointmentData = {
        doctorId: values.doctorId,
        appointmentDate: values.appointmentDate.format("YYYY-MM-DD"),
        appointmentTime: values.appointmentTime.format("HH:mm:ss"),
        appointmentService: null,
        appointmentType: "Therapy",
        appointmentNotes: values.appointmentNotes || "",
      };
      await createAppointment(appointmentData);
      message.success("Appointment booked successfully!");
      toast.success("✅ Appointment booked successfully!");
      form.resetFields();
      setSelectedDate(null);
      setSelectedTime(null);
      setAvailableDoctors([]);
    } catch (error) {
      console.error("Error booking appointment:", error);
      message.error("Failed to book appointment");
    }
    setSubmitting(false);
  };

  return (
    <div className="hiv-treatment-booking">
      <div className="booking-container">
        {/* Left Information Panel */}
        <div className="info-panel">
          <div className="panel-header">
            <div className="panel-icon">
              <HeartOutlined />
            </div>
            <Title level={2} className="panel-title">
              HIV Treatment Information
            </Title>
            <Text className="panel-subtitle">
              Professional and safe care for HIV patients with an experienced
              medical team
            </Text>
          </div>

          <div className="info-section">
            <div className="section-header">
              <div className="section-icon">
                <MedicineBoxOutlined />
              </div>
              <Title level={4} className="section-title">
                Professional Treatment
              </Title>
            </div>
            <div className="section-content">
              We provide comprehensive HIV treatment services with modern ARV
              regimens to help control viral load and improve quality of life.
            </div>
            <div className="info-list">
              <div className="info-item">
                In-depth counseling on ARV treatment
              </div>
              <div className="info-item">
                Regular monitoring of CD4 and viral load
              </div>
              <div className="info-item">
                Psychological and nutritional support
              </div>
            </div>
          </div>

          <div className="info-section">
            <div className="section-header">
              <Title level={4} className="section-title">
                Absolute Confidentiality
              </Title>
            </div>
            <div className="section-content">
              Patient information is strictly protected under healthcare data
              privacy laws. All communications and records are encrypted and
              securely stored.
            </div>
          </div>

          <div className="info-section">
            <div className="section-header">
              <div className="section-icon">
                <InfoCircleOutlined />
              </div>
              <Title level={4} className="section-title">
                Treatment Process
              </Title>
            </div>
            <div className="info-list">
              <div className="info-item">Health examination and assessment</div>
              <div className="info-item">CD4 and viral load testing</div>
              <div className="info-item">
                Selecting an appropriate treatment regimen
              </div>
              <div className="info-item">
                Medication monitoring and adjustment
              </div>
            </div>
          </div>

          <div className="info-section">
            <div className="section-header">
              <div className="section-icon">
                <SafetyOutlined />
              </div>
              <Title level={4} className="section-title">
                Safe & Effective
              </Title>
            </div>
            <div className="section-content">
              With over 15 years of experience in HIV treatment, we are
              committed to delivering the best outcomes with high success rates
              and minimal side effects.
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="form-panel">
          <Card className="booking-form-card">
            <div className="form-header">
              <div className="form-icon">
                <CalendarOutlined />
              </div>
              <Title level={3}>Book a Treatment Appointment</Title>
              <Text className="form-subtitle">
                Book an appointment with our HIV treatment specialists.
              </Text>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="booking-form"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="appointmentDate"
                    label="Select Date"
                    rules={[
                      { required: true, message: "Please select a date" },
                    ]}
                  >
                    <DatePicker
                      onChange={(date) => {
                        setSelectedDate(date);
                        if (date && selectedTime) {
                          fetchAvailableDoctors(date, selectedTime);
                        }
                      }}
                      className="w-full"
                      placeholder="Select appointment date"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="appointmentTime"
                    label="Select Time"
                    rules={[
                      { required: true, message: "Please select a time" },
                    ]}
                  >
                    <TimePicker
                      format="HH:mm"
                      minuteStep={30}
                      className="w-full"
                      placeholder="Select appointment time"
                      onChange={(time) => {
                        setSelectedTime(time);
                        if (selectedDate && time) {
                          fetchAvailableDoctors(selectedDate, time);
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Available Doctors"
                name="doctorId"
                rules={[{ required: true, message: "Please select a doctor" }]}
              >
                <Select
                  placeholder="Select a treatment doctor"
                  loading={loading}
                  disabled={
                    !selectedDate ||
                    !selectedTime ||
                    (availableDoctors.length === 0 && !loading)
                  }
                  notFoundContent={
                    loading ? (
                      <Spin size="small" />
                    ) : selectedDate && selectedTime ? (
                      "No doctors available at this time slot"
                    ) : (
                      "Please select date and time first"
                    )
                  }
                >
                  {availableDoctors.map((doc) => (
                    <Option key={doc.doctorId} value={doc.doctorId}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <UserOutlined style={{ color: "#3b82f6" }} />
                        Dr. {doc.account?.email?.split("@")[0] || "Specialist"}
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Additional Notes" name="appointmentNotes">
                <TextArea
                  rows={4}
                  placeholder="Describe your symptoms or any special requests for your appointment..."
                  className="notes-input"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                className="submit-button"
                icon={<CheckCircleOutlined />}
              >
                Book Appointment
              </Button>

              {loading && (
                <div className="loading-content">
                  <Spin size="large" />
                  <Text>Loading available doctors...</Text>
                </div>
              )}
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingTreatmentHIV;
