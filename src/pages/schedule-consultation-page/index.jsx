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
} from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/vi";
import Symstom from "../../components/atoms/Symstom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import { createAppointment } from "../../apis/appointmentAPI/createAppointmentApi";
import { getAvailableSchedulesDoctors } from "../../apis/doctorApi/getAvailableSchedulesDoctorsApi";

dayjs.extend(customParseFormat);

const ScheduleAConsultation = () => {
  const [form] = Form.useForm();
  const [availableSchedulesDoctors, setAvailableSchedulesDoctors] = useState(
    []
  );
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
        appointmentType: "Consultation",
      };
      await createAppointment(goodValues);
      toast.success("Successfully!");
      form.resetFields();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setLoading(false);
    // Hiển thị ra UI nếu muốn (ví dụ cập nhật state để show bên ngoài)
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
        })
        .catch(() => {
          toast.error("Failed to fetch available doctors");
          setAvailableSchedulesDoctors([]);
        });
    } else {
      // Nếu chưa chọn đủ thì reset danh sách bác sĩ
      setAvailableSchedulesDoctors([]);
    }
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
            >
              <Row gutter={16}>
                {/* Cột trái */}
                <Col xs={24} md={12}>
                  <Form.Item
                    name="appointmentService"
                    label="Choose Consultation Type"
                    rules={[{ required: true, message: "Type is required!" }]}
                  >
                    <Select
                      className="w-full !h-[45px]"
                      placeholder="Choose a consultation"
                      options={[
                        {
                          value: "PreTestCounseling",
                          label:
                            "Pre-Test Counseling (Tư vấn trước xét nghiệm)",
                        },
                        {
                          value: "PostTestCounseling",
                          label: "Post-Test Counseling (Tư vấn sau xét nghiệm)",
                        },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item
                    name="appointmentTime"
                    label="Choose Hour (30 minutes)"
                    rules={[{ required: true, message: "Hour is required!" }]}
                  >
                    <TimePicker
                      className="w-full h-[45px]"
                      format="HH:mm"
                      minuteStep={30}
                      onChange={handleDateTimeChange}
                    />
                  </Form.Item>
                </Col>

                {/* Cột phải */}
                <Col xs={24} md={12}>
                  <Form.Item
                    name="appointmentDate"
                    label="Choose Date"
                    rules={[{ required: true, message: "Date is required!" }]}
                  >
                    <DatePicker
                      className="w-full h-[45px]"
                      format="YYYY-MM-DD"
                      onChange={handleDateTimeChange}
                      disabledDate={(current) =>
                        current && current < dayjs().startOf("day")
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    name="doctorId"
                    label="Doctor List Available"
                    rules={[
                      { required: true, message: "Please choose a doctor!" },
                    ]}
                  >
                    <Select
                      className="w-full !h-[45px]"
                      placeholder="Select a doctor"
                      showSearch
                      optionFilterProp="label"
                      disabled={availableSchedulesDoctors.length === 0}
                      options={availableSchedulesDoctors.map((doctor) => ({
                        label: `${doctor.account.fullName} (${doctor.account.email})`,
                        value: doctor.doctorId,
                      }))}
                    />
                  </Form.Item>
                </Col>

                {/* Ghi chú */}
                <Col span={24}>
                  <Form.Item name="appointmentNotes" label="Notes">
                    <Input.TextArea
                      rows={5}
                      placeholder="Taking notes (if having)"
                    />
                  </Form.Item>
                </Col>

                {/* Nút submit */}
                <Col span={24}>
                  <Form.Item>
                    <Button
                      loading={loading}
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
