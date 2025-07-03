import {
  DatePicker,
  TimePicker,
  Select,
  Input,
  Button,
  Form,
} from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/vi";
import { toast } from "react-toastify";
import { 
  CalendarOutlined,
  SafetyCertificateOutlined
} from "@ant-design/icons";
import "./index.scss";

import { createAppointment } from "../../apis/appointmentAPI/createAppointmentApi";
import { getAvailableSchedulesDoctors } from "../../apis/doctorApi/getAvailableSchedulesDoctorsApi";

dayjs.extend(customParseFormat);

const SchedulePostTestConsultation = () => {
  const [form] = Form.useForm();
  const [availableSchedulesDoctors, setAvailableSchedulesDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formattedDate = values.appointmentDate.format("YYYY-MM-DD");
      const formattedTime = values.appointmentTime.format("HH:mm:ss");
      const goodValues = {
        ...values,
        appointmentDate: formattedDate,
        appointmentTime: formattedTime,
        appointmentType: "consultation",
      };
      console.log("Values:", goodValues)
      await createAppointment(goodValues);
      toast.success("✅ Post-test consultation appointment booked successfully!");
      form.resetFields();
      setAvailableSchedulesDoctors([]);
    } catch (error) {
      toast.error("❌ Failed to book post-test consultation appointment. Please try again.");
      console.error("Error booking appointment:", error);
    }
    setLoading(false);
  };

  const handleDateTimeChange = () => {
    const date = form.getFieldValue("appointmentDate");
    const time = form.getFieldValue("appointmentTime");

    if (date && time) {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      const formattedTime = dayjs(time).format("HH:mm:ss");

      getAvailableSchedulesDoctors(formattedDate, formattedTime)
        .then((res) => {
          setAvailableSchedulesDoctors(res.data.data);
          if (res.data.data.length === 0) {
            toast.info("⚠️ No doctors available for selected time. Please choose another slot.");
          }
        })
        .catch(() => {
          toast.error("❌ Failed to fetch available doctors");
          setAvailableSchedulesDoctors([]);
        });
    } else {
      setAvailableSchedulesDoctors([]);
      form.setFieldsValue({ doctorId: undefined });
    }
  };

  return (
    <div className="post-test-consultation-page">
      <div className="consultation-wrapper">
        {/* Header Section */}
        <div className="page-header">
          <div className="header-background">
            <div className="header-overlay"></div>
            <div className="header-content">
              <div className="header-icon">
                <SafetyCertificateOutlined />
              </div>
              <h1 className="header-title">Post-Test Consultation</h1>
              <p className="header-subtitle">
                Professional support and guidance after your HIV test results
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="consultation-content">
          {/* Info Cards Section */}
          <div className="info-cards-section">
            <div className="info-card support-card">
              <div className="card-icon">💬</div>
              <h3>Emotional Support</h3>
              <p>Our counselors provide compassionate support to help you process your test results and plan next steps.</p>
            </div>
            
            <div className="info-card guidance-card">
              <div className="card-icon">🎯</div>
              <h3>Treatment Guidance</h3>
              <p>Get expert advice on treatment options, lifestyle changes, and ongoing care management.</p>
            </div>
            
            <div className="info-card confidential-card">
              <div className="card-icon">🔒</div>
              <h3>100% Confidential</h3>
              <p>All consultations are completely private and protected by strict medical confidentiality.</p>
            </div>
          </div>

          {/* Booking Form Section */}
          <div className="booking-section">
            <div className="form-container">
              <div className="form-header">
                <div className="form-icon">
                  <CalendarOutlined />
                </div>
                <h2>Schedule Your Post-Test Consultation</h2>
                <p>Book a session with our experienced healthcare professionals</p>
              </div>

              <Form
                form={form}
                name="postTestConsultation"
                onFinish={onFinish}
                layout="vertical"
                className="consultation-form"
                initialValues={{
                  appointmentService: "PostTestCounseling"
                }}
              >
                <Form.Item
                  name="appointmentService"
                  label="Consultation Type"
                  rules={[{ required: true, message: "Please select consultation type!" }]}
                >
                  <Select
                    size="large"
                    className="consultation-select"
                    options={[
                      {
                        value: "PostTestCounseling",
                        label: "Post-Test Counseling (Tư vấn sau xét nghiệm)",
                      },
                      {
                        value: "PreTestCounseling",
                        label: "Pre-Test Counseling (Tư vấn trước xét nghiệm)",
                      }
                    ]}
                  />
                </Form.Item>

                <div className="date-time-row">
                  <Form.Item
                    name="appointmentDate"
                    label="Select Date"
                    rules={[{ required: true, message: "Please select date!" }]}
                    className="date-field"
                  >
                    <DatePicker
                      placeholder="Choose date"
                      size="large"
                      format="YYYY-MM-DD"
                      onChange={handleDateTimeChange}
                      disabledDate={(current) =>
                        current && current < dayjs().startOf("day")
                      }
                      className="date-picker"
                    />
                  </Form.Item>

                  <Form.Item
                    name="appointmentTime"
                    label="Select Time"
                    rules={[{ required: true, message: "Please select time!" }]}
                    className="time-field"
                  >
                    <TimePicker
                      placeholder="Choose time"
                      size="large"
                      format="HH:mm"
                      minuteStep={30}
                      onChange={handleDateTimeChange}
                      className="time-picker"
                    />
                  </Form.Item>
                </div>

                <Form.Item
                  name="doctorId"
                  label="Available Doctors"
                  rules={[{ required: true, message: "Please choose a doctor!" }]}
                >
                  <Select
                    placeholder="Select your preferred doctor"
                    size="large"
                    showSearch
                    optionFilterProp="label"
                    disabled={availableSchedulesDoctors.length === 0}
                    className="doctor-select"
                    notFoundContent={
                      <div className="empty-state">
                        <div className="empty-icon">👨‍⚕️</div>
                        <div className="empty-text">
                          {availableSchedulesDoctors.length === 0 
                            ? "Please select date and time first" 
                            : "No doctors available for this slot"}
                        </div>
                      </div>
                    }
                    options={availableSchedulesDoctors.map((doctor) => ({
                      label: (
                        <div className="doctor-option">
                          <div className="doctor-avatar">
                            <span>👨‍⚕️</span>
                          </div>
                          <div className="doctor-info">
                            <div className="doctor-name">{doctor.account.fullName}</div>
                            <div className="doctor-email">{doctor.account.email}</div>
                          </div>
                        </div>
                      ),
                      value: doctor.doctorId,
                    }))}
                  />
                </Form.Item>

                <Form.Item 
                  name="appointmentNotes" 
                  label="Additional Notes (Optional)"
                >
                  <Input.TextArea
                    placeholder="Share any specific concerns or questions you'd like to discuss..."
                    rows={4}
                    maxLength={500}
                    showCount
                    className="notes-textarea"
                  />
                </Form.Item>

                <Form.Item className="submit-section">
                  <Button
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    className="submit-button"
                  >
                    <span className="button-content">
                      {loading ? (
                        <>
                          <span className="loading-spinner"></span>
                          Booking Appointment...
                        </>
                      ) : (
                        <>
                          <CalendarOutlined />
                          Schedule Consultation
                        </>
                      )}
                    </span>
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePostTestConsultation;
