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
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import "./index.scss";

import { createAppointment } from "../../apis/appointmentAPI/createAppointmentApi";
import { getAvailableSchedulesDoctors } from "../../apis/doctorApi/getAvailableSchedulesDoctorsApi";

dayjs.extend(customParseFormat);

const ScheduleAConsultation = () => {
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
      toast.success("✅ Consultation appointment booked successfully!");
      form.resetFields();
      setAvailableSchedulesDoctors([]);
    } catch (error) {
      toast.error(error?.response?.data?.message || "❌ Failed to book consultation appointment. Please try again.");
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
    <div className="hiv-testing-appointment">
      <div className="appointment-container">
        {/* Left Panel - Information */}
        <div className="info-panel">
          <div className="panel-content">
            <div className="panel-title">
              <div className="title-icon">
                <SafetyCertificateOutlined />
              </div>
              Consultation Information
            </div>

            <div className="info-section">
              <div className="section-title">
                <div className="section-icon">�</div>
                Professional Consultation
              </div>
              <div className="section-content">
                Get expert medical advice and counseling from our qualified healthcare 
                professionals. We provide comprehensive consultation services tailored 
                to your specific needs.
              </div>
            </div>

            <div className="info-section">
              <div className="section-title">
                <div className="section-icon">
                  <SafetyCertificateOutlined />
                </div>
                Confidential & Secure
              </div>
              <div className="section-content">
                All consultations are completely confidential and protected by medical 
                privacy laws. Your information and discussions are secure with us.
              </div>
            </div>

            <div className="info-section">
              <div className="section-title">
                <div className="section-icon">
                  <ClockCircleOutlined />
                </div>
                Consultation Types Available
              </div>
              <div className="section-content">
                <ul>
                  <li>Pre-Test Counseling: Guidance before testing</li>
                  <li>Post-Test Counseling: Support after results</li>
                  <li>Treatment Consultation: Ongoing care planning</li>
                  <li>General Health: Overall wellness guidance</li>
                </ul>
              </div>
            </div>

            <div className="info-section">
              <div className="section-title">
                <div className="section-icon">
                  <InfoCircleOutlined />
                </div>
                What to Expect
              </div>
              <div className="section-content">
                Our healthcare professionals will provide personalized consultation 
                with care and respect. Each session is 30 minutes and includes 
                comprehensive discussion time.
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Booking Form */}
        <div className="form-panel">
          <div className="form-header">
            <h2>📅 Schedule A Consultation</h2>
            <p className="form-subtitle">Book your consultation appointment with our healthcare professionals</p>
          </div>

          <Form
            form={form}
            name="consultationAppointment"
            onFinish={onFinish}
            layout="vertical"
            className="appointment-form"
          >
            <Form.Item
              name="appointmentService"
              label="* Choose Consultation Type"
              rules={[{ required: true, message: "Please select consultation type!" }]}
            >
              <Select
                placeholder="Select consultation type"
                size="large"
                options={[
                  {
                    value: "PreTestCounseling",
                    label: "Pre-Test Counseling (Tư vấn trước xét nghiệm)",
                  },
                  {
                    value: "PostTestCounseling",
                    label: "Post-Test Counseling (Tư vấn sau xét nghiệm)",
                  }
                ]}
              />
            </Form.Item>

            <div className="form-row">
              <Form.Item
                name="appointmentDate"
                label="* Choose Date"
                rules={[{ required: true, message: "Please select date!" }]}
              >
                <DatePicker
                  placeholder="Select date"
                  size="large"
                  format="YYYY-MM-DD"
                  onChange={handleDateTimeChange}
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                name="appointmentTime"
                label="* Choose Hour (30 minutes)"
                rules={[{ required: true, message: "Please select time!" }]}
              >
                <TimePicker
                  placeholder="Select time"
                  size="large"
                  format="HH:mm"
                  minuteStep={30}
                  onChange={handleDateTimeChange}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </div>

            <Form.Item
              name="doctorId"
              label="* Doctor List Available"
              rules={[{ required: true, message: "Please choose a doctor!" }]}
            >
              <Select
                placeholder="Select a doctor"
                size="large"
                showSearch
                optionFilterProp="label"
                disabled={availableSchedulesDoctors.length === 0}
                notFoundContent={
                  availableSchedulesDoctors.length === 0 
                    ? "Please select date and time first" 
                    : "No doctors available"
                }
                options={availableSchedulesDoctors.map((doctor) => ({
                  label: `${doctor.account.fullName} (${doctor.account.email})`,
                  value: doctor.doctorId,
                }))}
              />
            </Form.Item>

            <Form.Item 
              name="appointmentNotes" 
              label="Notes"
            >
              <Input.TextArea
                placeholder="Taking notes (if having)"
                rows={4}
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Form.Item>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                className="submit-button"
                size="large"
                block
              >
                {loading ? "Booking..." : "Booking Now"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAConsultation;
