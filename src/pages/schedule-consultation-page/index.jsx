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
     toast.error("❌ Failed to book consultation appointment. Please try again.");
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
        <div className="form-panel bg-white flex items-center justify-center p-16">
          <div className="w-full max-w-lg">
            <div className="form-header text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                <span className="text-2xl">📅</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Schedule A Consultation</h2>
              <p className="text-gray-600 text-lg">Book your consultation appointment with our healthcare professionals</p>
            </div>

            <Form
              form={form}
              name="consultationAppointment"
              onFinish={onFinish}
              layout="vertical"
              className="appointment-form space-y-6"
            >
              <Form.Item
                name="appointmentService"
                label={<span className="text-gray-700 font-semibold text-sm">* Choose Consultation Type</span>}
                rules={[{ required: true, message: "Please select consultation type!" }]}
              >
                <Select
                  placeholder="Select consultation type"
                  size="large"
                  className="rounded-xl"
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

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="appointmentDate"
                  label={<span className="text-gray-700 font-semibold text-sm">* Choose Date</span>}
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
                    className="w-full rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  name="appointmentTime"
                  label={<span className="text-gray-700 font-semibold text-sm">* Choose Hour (30 minutes)</span>}
                  rules={[{ required: true, message: "Please select time!" }]}
                >
                  <TimePicker
                    placeholder="Select time"
                    size="large"
                    format="HH:mm"
                    minuteStep={30}
                    onChange={handleDateTimeChange}
                    className="w-full rounded-xl"
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="doctorId"
                label={<span className="text-gray-700 font-semibold text-sm">* Doctor List Available</span>}
                rules={[{ required: true, message: "Please choose a doctor!" }]}
              >
                <Select
                  placeholder="Select a doctor"
                  size="large"
                  showSearch
                  optionFilterProp="label"
                  disabled={availableSchedulesDoctors.length === 0}
                  className="rounded-xl"
                  notFoundContent={
                    <div className="text-center py-4">
                      <div className="text-gray-400 mb-2">
                        {availableSchedulesDoctors.length === 0 
                          ? "📅 Please select date and time first" 
                          : "👨‍⚕️ No doctors available"}
                      </div>
                    </div>
                  }
                  options={availableSchedulesDoctors.map((doctor) => ({
                    label: (
                      <div className="flex items-center space-x-3 py-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm">👨‍⚕️</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{doctor.account.fullName}</div>
                          <div className="text-sm text-gray-500">{doctor.account.email}</div>
                        </div>
                      </div>
                    ),
                    value: doctor.doctorId,
                  }))}
                />
              </Form.Item>

              <Form.Item 
                name="appointmentNotes" 
                label={<span className="text-gray-700 font-semibold text-sm">Notes</span>}
              >
                <Input.TextArea
                  placeholder="Taking notes (if having)"
                  rows={4}
                  maxLength={500}
                  showCount
                  className="rounded-xl resize-none"
                />
              </Form.Item>

              <Form.Item className="mt-8">
                <Button
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  className="!h-14 !rounded-xl !bg-gradient-to-r !from-blue-500 !to-purple-600 !hover:from-blue-600 !hover:to-purple-700 !border-none !font-semibold !text-lg !shadow-lg !hover:shadow-xl !transition-all !duration-300 !hover:-translate-y-1"
                >
                  <span className="!flex !items-center !justify-center !space-x-2">
                    <span>{loading ? "Booking..." : "Book Appointment"}</span>
                    {!loading && <span>🗓️</span>}
                  </span>
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAConsultation;
