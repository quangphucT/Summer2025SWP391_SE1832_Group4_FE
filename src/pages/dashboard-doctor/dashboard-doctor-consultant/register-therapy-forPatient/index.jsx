import { useState } from "react";
import { getAvailableSchedulesDoctorsTherapy } from "../../../../apis/doctorApi/getAllAvailableSchedulesDoctorTherapyApi";
import "./index.scss";
import { toast } from "react-toastify";
import { createTherapyForPatient } from "../../../../apis/doctorApi/createTherapyForPatientApi";
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  TimePicker, 
  Select, 
  Typography, 
  Space, 
  Divider,
  Row,
  Col,
  Avatar
} from "antd";
import { 
  UserOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined,
  HeartOutlined,
  MedicineBoxOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const RegisterTherapyForPatient = () => {
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const [form] = Form.useForm();

 
  const handleDateTimeChange = () => {
     const date = form.getFieldValue("appointmentDate");
        const time = form.getFieldValue("appointmentTime");
    
        if (date && time) {
          const formattedDate = dayjs(date).format("YYYY-MM-DD");
          const formattedTime = dayjs(time).format("HH:mm:ss");
    
          getAvailableSchedulesDoctorsTherapy(formattedDate, formattedTime)
            .then((res) => {
              setAvailableDoctors(res.data.data);
              if (res.data.data.length === 0) {
                toast.info("⚠️ No doctors available for selected time. Please choose another slot.");
              }
            })
            .catch(() => {
              toast.error("❌ Failed to fetch available doctors");
              setAvailableDoctors([]);
            });
        } else {
          setAvailableDoctors([]);
          form.setFieldsValue({ doctorId: undefined });
        }
  };

  const registerTherapyForPatient = async (values) => {
    setLoading(true);
    try {
      const formattedData = {
        doctorId: values.doctorId,
        patientId: parseInt(values.patientId),
        appointmentDate: values.appointmentDate.format("YYYY-MM-DD"),
        appointmentTime: values.appointmentTime.format("HH:mm:ss"),
        appointmentType: "Therapy",
        appointmentService: values.appointmentService,
        appointmentNotes: values.appointmentNotes || ""
      };

      console.log("Therapy registration data:", formattedData);
      await createTherapyForPatient(formattedData);
      
      toast.success("✅ Therapy appointment registered successfully!");
      form.resetFields();
      setAvailableDoctors([]);
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "❌ Error while creating therapy for patient!");
    }
    setLoading(false);
  };

  return (
    <div className="register-therapy-patient">
      <Card className="therapy-form-card">
        <div className="form-header">
          <Title level={3} className="form-title">
            <HeartOutlined className="title-icon" />
            Register Therapy for Patient
          </Title>
          <Text type="secondary" className="form-subtitle">
            Schedule therapy appointments with our specialized doctors
          </Text>
        </div>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={registerTherapyForPatient}
          className="therapy-form"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="patientId"
                label="* Patient ID"
                rules={[{ required: true, message: "Please enter patient ID" }]}
              >
                <Input
                  size="large"
                  type="number"
                  placeholder="Enter patient ID"
                  prefix={<UserOutlined />}
                  min={1}
                />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="appointmentService"
                label="* Therapy Service Type"
                rules={[{ required: true, message: "Please select therapy service type" }]}
              >
                <Select
                  size="large"
                  placeholder="Select therapy service"
                  options={[
                    {
                      value: "FirstTreatmentVisit",
                      label: "First Treatment Visit (Lần điều trị đầu tiên)",
                    },
                    {
                      value: "FollowUpTreatment",
                      label: "Follow-up Treatment (Điều trị theo dõi)",
                    }
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="appointmentDate"
                label="* Appointment Date"
                rules={[{ required: true, message: "Please select appointment date" }]}
              >
                <DatePicker
                  size="large"
                  placeholder="Select date"
                  format="YYYY-MM-DD"
                  onChange={handleDateTimeChange}
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                  style={{ width: '100%' }}
                  prefix={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="appointmentTime"
                label="* Appointment Time"
                rules={[{ required: true, message: "Please select appointment time" }]}
              >
                <TimePicker
                  size="large"
                  placeholder="Select time"
                  format="HH:mm"
                  minuteStep={30}
                  onChange={handleDateTimeChange}
                  style={{ width: '100%' }}
                  prefix={<ClockCircleOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="doctorId"
            label="* Available Therapy Doctors"
            rules={[{ required: true, message: "Please select a therapy doctor" }]}
          >
            <Select
              size="large"
              placeholder={
                !selectedDate || !selectedTime 
                  ? "Please select date and time first" 
                  : loadingDoctors 
                  ? "Loading doctors..." 
                  : "Select an available therapy doctor"
              }
              loading={loadingDoctors}
              disabled={availableDoctors.length === 0}
              showSearch
              optionFilterProp="label"
              notFoundContent={
                availableDoctors.length === 0 
                  ? "Please select date and time first" 
                  : "No therapy doctors available"
              }
              options={availableDoctors.map((doctor) => ({
                label: (
                  <div className="doctor-option">
                    <Avatar 
                      size={32} 
                      icon={<MedicineBoxOutlined />}
                      className="doctor-avatar"
                    />
                    <div className="doctor-info">
                      <div className="doctor-name">{doctor.account?.fullName || 'N/A'}</div>
                      <div className="doctor-details">
                        {doctor.specialty} - {doctor.qualifications} ({doctor.yearsOfExperience} years exp.)
                      </div>
                    </div>
                  </div>
                ),
                value: doctor.doctorId,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="appointmentNotes"
            label="Appointment Notes"
          >
            <Input.TextArea
              rows={4}
              placeholder="Additional notes for the therapy appointment (optional)"
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item className="form-actions">
            <Space size="middle">
              <Button
                size="large"
                onClick={() => {
                  form.resetFields();
                  setAvailableDoctors([]);
                  setSelectedDate(null);
                  setSelectedTime(null);
                }}
              >
                Reset
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                className="submit-button"
              >
                {loading ? "Registering..." : "Register Therapy"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterTherapyForPatient;
