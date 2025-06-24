import { toast } from "react-toastify";
import "./index.scss";
import { getAllAppointments } from "../../../apis/appointmentAPI/getAllAppointmentsApi";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Table,
  TimePicker,
} from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { createAppointmentTest } from "../../../apis/appointmentAPI/createAppointmentTestApi";

const CheckedInAppointmentToday = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFormCreateTest, setLoadingFormCreateTest] = useState(false);
  const [openModalFormAdvice, setOpenModalFormAdvice] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();

  const fetchingAppointmentCheckedIn = async () => {
    setLoading(true);
    try {
      const response = await getAllAppointments();
      const responseAfterFilterCheckedIn =
        response.data.data.rowDatas
          ?.filter((item) => item.status === "CheckedIn")
          .sort((a, b) => {
            const timeA = a.appointmentTime;
            const timeB = b.appointmentTime;
            return timeA.localeCompare(timeB);
          }) || [];

      setData(responseAfterFilterCheckedIn);
    } catch (error) {
      toast.error(
        error?.response?.data?.message?.error || "Error while fetching"
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchingAppointmentCheckedIn();
  }, []);

  const columns = [
    {
      title: "No.",
      dataIndex: "appointmentId",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Patient Info",
      key: "patientInfo",
      render: (_, record) => {
        const patientCode = record?.patient?.patientCodeAtFacility || "N/A";
        const name = record?.patientName || "N/A";
        const phone = record?.patient?.account?.phoneNumber || "N/A";
        return (
          <div>
            <div>
              <strong>Name:</strong> {name}
            </div>
            <div>
              <strong>Code:</strong> {patientCode}
            </div>
            <div>
              <strong>Phone:</strong> {phone}
            </div>
          </div>
        );
      },
    },
    {
      title: "Appointment Info",
      key: "appointmentInfo",
      render: (_, record) => {
        return (
          <div>
            <div>
              <strong>Time:</strong> {record.appointmentTime}
            </div>
            <div>
              <strong>Type:</strong> {record.appointmentType}
            </div>
            <div>
              <strong>Service:</strong> {record.appointmentService}
            </div>
          </div>
        );
      },
    },
    {
      title: "Doctor",
      key: "doctor",
      render: (_, record) => {
        return record?.doctor?.account?.fullName || "N/A";
      },
    },
    {
      title: "Action",
      dataIndex: "appointmentId",
      key: "appointmentId",
      render: (text, record) => {
        return (
          <Button
            onClick={() => {
              handleOpenFormAdvise(record);
            }}
            type="primary"
            icon={<FileTextOutlined />}
            style={{
              backgroundColor: "#d32f2f",
              borderColor: "#b71c1c",
              color: "white",
              fontWeight: "bold",
              borderRadius: 6,
            }}
          >
            Advice / Notes
          </Button>
        );
      },
    },
  ];
  const handleOpenFormAdvise = (record) => {
    setSelectedRecord(record);
    setOpenModalFormAdvice(true);
  };

  const handleFinish = async (values) => {
    setLoadingFormCreateTest(true);

    try {
      const formatted = {
     
          patientId: selectedRecord?.patient?.patientCodeAtFacility,
          appointmentDate: values.appointmentDate?.format("YYYY-MM-DD"),
          appointmentTime: values.appointmentTime?.format("HH:mm:ss"),
          appointmentType: "Testing",
          appointmentService: values.hivTestType,
          appointmentNotes: values.medicalNote,
      
      };
      await createAppointmentTest(formatted);
      toast.success("Created successfuly");
      form.resetFields();
      setOpenModalFormAdvice(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message?.error || "Error while handling logic!"
      );
    }
  };

  return (
    <div className="checked-in-appointment-table">
      <h2
        style={{
          marginBottom: 0,
          color: "#2968a7",
          fontWeight: "bold",
          fontSize: "30px",
        }}
      >
        List of Checked-In Patients
      </h2>
      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        rowKey="appointmentId"
        pagination={false}
      />

      <Modal
        width={900}
        open={openModalFormAdvice}
        onCancel={() => {
          form.resetFields();
          setOpenModalFormAdvice(false);
          setSelectedRecord(null);
        }}
        onOk={() => form.submit()}
        title="Medical Advice & HIV Test Registration"
        okText="Submit"
        cancelText="Cancel"
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Medical Advice / Notes"
            name="medicalNote"
            rules={[{ required: true, message: "Please enter advice or note" }]}
          >
            <Input.TextArea
              rows={5}
              placeholder="E.g., recommend HIV test, explain procedure..."
            />
          </Form.Item>

          <div
            style={{
              border: "1px solid #eee",
              padding: 16,
              borderRadius: 8,
              marginTop: 12,
              backgroundColor: "#f9f9f9",
            }}
          >
            <h4 style={{ color: "#2968a7" }}>HIV Test Registration</h4>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Test Date"
                  name="appointmentDate"
                  rules={[
                    { required: true, message: "Please select a test date" },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="appointmentTime"
                  label="Choose Hour (30 minutes)"
                  rules={[{ required: true, message: "Hour is required!" }]}
                >
                  <TimePicker
                    className="w-full h-[45px]"
                    format="HH:mm"
                    minuteStep={30}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Test Type"
                  name="hivTestType"
                  rules={[
                    { required: true, message: "Please select test type" },
                  ]}
                >
                  <Select placeholder="Choose a test type">
                    <Select.Option value="RapidTest">Rapid Test</Select.Option>
                    <Select.Option value="PCR">PCR</Select.Option>
                    <Select.Option value="ELISA">ELISA</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CheckedInAppointmentToday;
