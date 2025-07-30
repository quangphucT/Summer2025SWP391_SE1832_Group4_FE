import { toast } from "react-toastify";
import "./index.scss";
import { useEffect, useState, useRef } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  TimePicker,
  Tag,
  Avatar,
  Card,
  Descriptions,
  Divider,
  Typography,
  Empty,
  Spin,
  InputNumber,
  List,
} from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  IdcardOutlined,
  ReloadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { createAppointmentTest } from "../../../../apis/appointmentAPI/createAppointmentTestApi";
import { getAvailableSchedulesDoctorsTesting } from "../../../../apis/doctorApi/getAvailableSchedulesDoctorTestingApi";
import { getAllAppointmentsFollowingDoctor } from "../../../../apis/appointmentAPI/getAppointmentFollowingDoctorApi";
import { useSelector } from "react-redux";
import { updateAppointmentCompleted } from "../../../../apis/appointmentAPI/updateAppointmentCompletedApi";
import { getTestResultByPatientId } from "../../../../apis/Results/getTestResultByPatientIdAPI";
import api from "../../../../config/api";
import dayjs from "dayjs";
import { getDoctorByAccountId } from "../../../../apis/doctorApi/doctorApi";

const { Title, Text } = Typography;

const CheckedInAppointmentToday = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFormCreateTest, setLoadingFormCreateTest] = useState(false);
  const [openModalFormAdvice, setOpenModalFormAdvice] = useState(false);
  const [openModalTestResult, setOpenModalTestResult] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [loadingTestResults, setLoadingTestResults] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openTreatmentModal, setOpenTreatmentModal] = useState(false);
  const [canCreateTherapyMap, setCanCreateTherapyMap] = useState({});
  // Add new state for latest PCR result
  const [latestPCRResult, setLatestPCRResult] = useState(null);
  // Add new state for suggest loading
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestedRegimen, setSuggestedRegimen] = useState(null); // Thêm state mới cho regimen được gợi ý
  // Thêm state mới
  const [loadingPreviousTreatment, setLoadingPreviousTreatment] =
    useState(false);
  const [previousTreatmentModalVisible, setPreviousTreatmentModalVisible] =
    useState(false);
  const [previousTreatments, setPreviousTreatments] = useState([]);
  // Thêm state cho edit modal
  const [editTreatmentModalVisible, setEditTreatmentModalVisible] =
    useState(false);
  const [currentEditTreatment, setCurrentEditTreatment] = useState(null);
  const [editTreatmentForm] = Form.useForm();

  // 1. Thêm state cho latestPCRResultEdit, suggestedRegimenEdit, selectedRegimenEdit
  const [latestPCRResultEdit, setLatestPCRResultEdit] = useState(null);
  const [suggestedRegimenEdit, setSuggestedRegimenEdit] = useState(null);
  const [selectedRegimenEdit, setSelectedRegimenEdit] = useState(null);

  const accountID = useSelector((store) => store?.user?.accountID);
  const [doctorId, setDoctorId] = useState("");

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableDoctors, setAvailableDoctors] = useState([]);

  const [form] = Form.useForm();
  const [treatmentForm] = Form.useForm();
  const treatmentRecordRef = useRef(null);
  const [treatmentLoading, setTreatmentLoading] = useState(false);
  const [regimenOptions, setRegimenOptions] = useState([]);
  const [selectedRegimen, setSelectedRegimen] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!accountID) return;

      setLoading(true);
      try {
        const response = await getAllAppointmentsFollowingDoctor(accountID);
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

    fetchData();

    // Fetch regimen options 1 lần khi mount
    const fetchRegimens = async () => {
      try {
        const res = await api.get("/api/standard-arv-regimens");
        const items = res.data?.data?.items || [];
        setRegimenOptions(Array.isArray(items) ? items : []);
      } catch {
        setRegimenOptions([]);
      }
    };
    fetchRegimens();
  }, []);

  useEffect(() => {
    const checkedInInformationRaw = sessionStorage.getItem("checkedInPatients");
    const checkedInPatients = checkedInInformationRaw ? JSON.parse(checkedInInformationRaw) : [];
    const firstPatient = Array.isArray(checkedInPatients) ? checkedInPatients[0] : null;
    const doctorIdFromAppointment = firstPatient?.doctor?.doctorId;
    if (doctorIdFromAppointment) {
      setDoctorId(doctorIdFromAppointment);
    } else if (accountID) {
      getDoctorByAccountId(accountID)
        .then(res => {
          setDoctorId(res.data?.data?.doctorId || "");
        })
        .catch(() => setDoctorId(""));
    }
  }, [accountID]);

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
  const handleUpdateAppointmentCompleted = async (record) => {
    try {
      await updateAppointmentCompleted(record.appointmentId);
      toast.success("Appointment marked as completed successfully!");
      setSelectedRecord(null);
      await getAllAppointmentsFollowingDoctor(accountID);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error while handling logic!"
      );
    }
  };
  // Sửa lại hàm handleEditTreatment để dùng data từ previousTreatments
  const handleEditTreatment = async () => {
    try {
      // Lấy treatment gần nhất (đang điều trị) từ danh sách previous treatments
      const currentTreatment = previousTreatments.find(
        (t) => t.status === "InTreatment"
      );

      if (currentTreatment) {
        // Lấy test result mới nhất
        const res = await getTestResultByPatientId(currentTreatment.patientId);
        const testResults = res.data.data || [];
        const pcrResults = testResults.filter(
          (test) => test.testType === "PCR"
        );
        const latestPCR = pcrResults.sort(
          (a, b) => new Date(b.testDate) - new Date(a.testDate)
        )[0];
        setLatestPCRResultEdit(latestPCR);
        // Nếu có test mới nhất thì dùng, không thì lấy từ treatment cũ
        const baselineCD4 = latestPCR?.cD4Count || currentTreatment.baselineCD4;
        const baselineHivViralLoad =
          latestPCR?.hivViralLoadValue || currentTreatment.baselineHivViralLoad;
        setCurrentEditTreatment(currentTreatment);
        setSelectedRegimenEdit(
          regimenOptions.find(
            (r) => r.regimenId === currentTreatment.regimenId
          ) || null
        );
        setSuggestedRegimenEdit(null);
        editTreatmentForm.setFieldsValue({
          ...currentTreatment,
          startDate: dayjs(currentTreatment.startDate),
          expectedEndDate: currentTreatment.expectedEndDate
            ? dayjs(currentTreatment.expectedEndDate)
            : null,
          patientId: currentTreatment.patientId,
          prescribingDoctorId: currentTreatment.prescribingDoctorId,
          regimenId: currentTreatment.regimenId,
          actualDosage: currentTreatment.actualDosage,
          status: currentTreatment.status,
          regimenAdjustments: currentTreatment.regimenAdjustments,
          reasonForChangeOrStop: currentTreatment.reasonForChangeOrStop,
          baselineCD4,
          baselineHivViralLoad,
        });
        setEditTreatmentModalVisible(true);
      } else {
        toast.error("No active treatment found for this patient");
      }
    } catch (error) {
      console.error("Error setting edit form:", error);
      toast.error("Failed to load treatment data for editing");
    }
  };

  // Sửa lại columns để thêm nút Edit chỉ khi có treatment đang điều trị
  const columns = [
    {
      title: "STT",
      dataIndex: "appointmentId",
      key: "index",
      width: 70,
      align: "center",
      render: (text, record, index) => (
        <div className="index-number">{index + 1}</div>
      ),
    },
    {
      title: "Patient Information",
      key: "patientInfo",
      width: 250,
      render: (_, record) => {
        const patientCode = record?.patient?.patientCodeAtFacility || "N/A";
        const name = record?.patientName || "N/A";
        const phone = record?.patient?.account?.phoneNumber || "N/A";
        const patientId = record?.patient?.patientId || "N/A";
        return (
          <div className="patient-info">
            <div className="patient-row">
              <UserOutlined className="info-icon" />
              <span className="patient-name">{name}</span>
            </div>
            <div className="patient-row">
              <IdcardOutlined className="info-icon" />
              <span>Mã: {patientCode}</span>
            </div>
            <div className="patient-row">
              <PhoneOutlined className="info-icon" />
              <span>{phone}</span>
            </div>
            <div className="patient-row">
              <IdcardOutlined className="info-icon" />
              <span>
                Patient ID: <strong>{patientId}</strong>
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Appointment Info",
      key: "appointmentInfo",
      width: 200,
      render: (_, record) => {
        return (
          <div className="appointment-info">
            <div className="appointment-row">
              <ClockCircleOutlined className="info-icon" />
              <span>{record.appointmentTime}</span>
            </div>
            <div className="appointment-row">
              <Tag color="blue" className="appointment-tag">
                {record.appointmentType}
              </Tag>
            </div>
            <div className="appointment-row">
              <Tag color="green" className="appointment-tag">
                {record.appointmentService}
              </Tag>
            </div>
          </div>
        );
      },
    },
    {
      title: "Doctor Information",
      key: "doctor",
      width: 180,
      render: (_, record) => {
        const doctorName = record?.doctor?.account?.fullName || "N/A";
        return (
          <div className="doctor-info">
            <Avatar size={28} className="doctor-avatar" />
            <span className="doctor-name">{doctorName}</span>
          </div>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      align: "center",
      render: () => (
        <Tag color="success" className="status-tag">
          CheckedIn
        </Tag>
      ),
    },
    {
      title: "Action",
      dataIndex: "appointmentId",
      key: "appointmentId",
      width: 300,
      align: "center",
      render: (text, record) => {
        const isFollowUp = record?.appointmentService === "FollowUpTreatment";
        const hasActiveTreatment = previousTreatments.some(
          (t) => t.status === "InTreatment"
        );

        return (
          <>
            {record?.appointmentService === "PreTestCounseling" ? (
              <Button
                onClick={() => handleOpenFormAdvise(record)}
                type="primary"
                icon={<FileTextOutlined />}
                className="action-button"
                size="small"
              >
                Medical Advice & Register Test
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => handleOpenFormAdvise(record)}
                    type="primary"
                    icon={<FileTextOutlined />}
                    className="action-button"
                    size="small"
                  >
                    Register Test
                  </Button>

                  <Button
                    onClick={() => handleOpenTestResult(record)}
                    type="primary"
                    icon={<FileTextOutlined />}
                    className="action-button"
                    size="small"
                  >
                    View Result Test
                  </Button>

                  {isFollowUp && (
                    <Button
                      onClick={() =>
                        handleViewPreviousTreatment(record.patient?.patientId)
                      }
                      type="primary"
                      icon={<FileTextOutlined />}
                      className="action-button"
                      size="small"
                      loading={loadingPreviousTreatment}
                    >
                      View Treatment
                    </Button>
                  )}
                </div>

                <div className="flex gap-2 justify-center">
                  {isFollowUp && hasActiveTreatment && (
                    <Button
                      onClick={() => handleEditTreatment(record)}
                      type="primary"
                      icon={<EditOutlined />}
                      className="action-button"
                      size="small"
                    >
                      Edit Treatment
                    </Button>
                  )}

                  {canCreateTherapyMap[record.appointmentId] && !isFollowUp && (
                    <Button
                      onClick={() => handleOpenTreatmentForm(record)}
                      type="primary"
                      className="action-button"
                      size="small"
                    >
                      Create Treatment
                    </Button>
                  )}

                  <Button
                    onClick={() => handleUpdateAppointmentCompleted(record)}
                    type="primary"
                    danger
                    className="action-button"
                    size="small"
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
          </>
        );
      },
    },
  ];

  // handle open test result
  const handleOpenTestResult = async (record) => {
    setLoadingTestResults(true);
    setOpenModalTestResult(true);
    const patientId = record?.patient?.patientId;

    try {
      const response = await getTestResultByPatientId(patientId);
      const testResults = response.data.data || [];
      setTestResults(testResults);

      // Get latest PCR result
      const pcrResults = testResults.filter((test) => test.testType === "PCR");
      const latestPCR = pcrResults.sort(
        (a, b) => new Date(b.testDate) - new Date(a.testDate)
      )[0];
      setLatestPCRResult(latestPCR);

      // Cập nhật trạng thái có thể tạo điều trị cho appointmentId này
      setCanCreateTherapyMap((prev) => ({
        ...prev,
        [record.appointmentId]: testResults.length > 0,
      }));
    } catch {
      toast.error("Error fetching test results");
      setTestResults([]);
      setLatestPCRResult(null);
    }
    setLoadingTestResults(false);
  };

  const handleOpenFormAdvise = (record) => {
    setSelectedRecord(record);
    setOpenModalFormAdvice(true);
  };

  const handleFinish = async (values) => {
    setLoadingFormCreateTest(true);

    try {
      const formatted = {
        doctorId: values.doctorId,
        patientId: selectedRecord?.patient?.patientId,
        appointmentDate: values.appointmentDate?.format("YYYY-MM-DD"),
        appointmentTime: values.appointmentTime?.format("HH:mm:ss"),
        appointmentType: "Testing",
        appointmentService: values.hivTestType,
        appointmentNotes: values.medicalNote,
      };
      console.log("Formatted:", formatted);
      await createAppointmentTest(formatted);
      toast.success("Created successfuly");
      form.resetFields();
      setAvailableDoctors([]);
      setSelectedRecord(null);
      setOpenModalFormAdvice(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error while handling logic!"
      );
    }
    setLoadingFormCreateTest(false);
  };

  // Sửa lại hàm gọi API tạo patient treatment
  const createPatientTreatment = async (data) => {
    return api.post("/api/patient-treatments", data); // Sửa lại endpoint
  };

  useEffect(() => {
    if (suggestedRegimen) {
      const matchingRegimen = regimenOptions.find(
        (r) => r.regimenId === suggestedRegimen.regimenId
      );
      setSelectedRegimen(matchingRegimen);
      treatmentForm.setFieldValue("regimenId", suggestedRegimen.regimenId);
    }
  }, [suggestedRegimen]);

  const fetchSuggestedRegimens = async (values) => {
    setSuggestLoading(true);
    try {
      const response = await api.post(
        "/api/standard-arv-regimens/suggest-regimens",
        {
          cD4Count: values.cD4Count,
          hivViralLoadValue: values.hivViralLoadValue,
        }
      );

      if (response.data?.success && response.data?.data) {
        const suggested = response.data.data;
        setSuggestedRegimen(suggested);
        toast.success(`Suggested regimen applied: ${suggested.regimenName}`);
      } else {
        setSuggestedRegimen(null);
        setSelectedRegimen(null);
        toast.warning("No suitable regimen found for the given values");
      }
    } catch (error) {
      console.error("Error fetching suggested regimens:", error);
      toast.error("Failed to fetch suggested regimens");
      setSuggestedRegimen(null);
      setSelectedRegimen(null);
    } finally {
      setSuggestLoading(false);
    }
  };

  // Thêm useEffect để debug state previousTreatments
  useEffect(() => {
    console.log("Previous Treatments State:", previousTreatments);
  }, [previousTreatments]);

  const handleOpenTreatmentForm = (record) => {
    treatmentRecordRef.current = record;
    treatmentForm.setFieldsValue({
      patientId: record?.patient?.patientId,
      appointmentId: record?.appointmentId,
      startDate: null,
      expectedEndDate: null,
      regimenId: undefined,
      actualDosage: "",
      status: "",
      reasonForChangeOrStop: "",
      regimenAdjustments: "",
      baselineCD4: latestPCRResult?.cD4Count || null,
      baselineHivViralLoad: latestPCRResult?.hivViralLoadValue || null,
    });
    setOpenTreatmentModal(true);
  };

  // Thêm hàm xử lý edit
  const handleUpdateTreatment = async (values) => {
    try {
      setTreatmentLoading(true);
      await api.put(
        `/api/patient-treatments/${currentEditTreatment.patientTreatmentId}`,
        {
          ...values,
          startDate: values.startDate.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
          expectedEndDate: values.expectedEndDate.format(
            "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
          ),
        }
      );
      toast.success("Treatment updated successfully!");
      setEditTreatmentModalVisible(false);
      // Refresh treatment list
      handleViewPreviousTreatment(currentEditTreatment.patientId);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update treatment"
      );
    } finally {
      setTreatmentLoading(false);
    }
  };

  // Thêm hàm handleViewPreviousTreatment để gọi API lấy treatment history
  const handleViewPreviousTreatment = async (patientId) => {
    setLoadingPreviousTreatment(true);
    try {
      const response = await api.get(`/api/patient-treatments/patient/${patientId}`);
      const treatments = response.data?.data || [];
      setPreviousTreatments(treatments);
      setPreviousTreatmentModalVisible(true);
    } catch (error) {
      console.error("Error fetching previous treatments:", error);
      toast.error("Failed to fetch treatment history");
      setPreviousTreatments([]);
    } finally {
      setLoadingPreviousTreatment(false);
    }
  };

  // 3. Thêm hàm fetchSuggestedRegimensEdit (tương tự fetchSuggestedRegimens)
  const fetchSuggestedRegimensEdit = async (values) => {
    setSuggestLoading(true);
    try {
      const response = await api.post(
        "/api/standard-arv-regimens/suggest-regimens",
        {
          cD4Count: values.cD4Count,
          hivViralLoadValue: values.hivViralLoadValue,
        }
      );
      if (response.data?.success && response.data?.data) {
        const suggested = response.data.data;
        setSuggestedRegimenEdit(suggested);
        toast.success(`Suggested regimen: ${suggested.regimenName}`);
      } else {
        setSuggestedRegimenEdit(null);
        toast.warning("No suitable regimen found for the given values");
      }
    } catch (error) {
      console.error("Error fetching suggested regimens:", error);
      toast.error("Failed to fetch suggested regimens");
      setSuggestedRegimenEdit(null);
    } finally {
      setSuggestLoading(false);
    }
  };

  return (
    <div className="checked-in-appointment-table">
      <h2
        style={{
          marginBottom: 0,
          color: "#000",
          fontWeight: "bold",
          fontSize: "30px",
        }}
      >
        List of Checked-In Patients (Therapy)
      </h2>
      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        rowKey="appointmentId"
        pagination={{
          pageSize: 4,
        }}
        className="modern-table"
      />

      <Modal
        width={900}
        open={openModalFormAdvice}
        footer={[
          <Button
            onClick={() => {
              form.resetFields();
              setOpenModalFormAdvice(false);
              setSelectedRecord(null);
            }}
          >
            Cancel
          </Button>,
          <Button
            loading={loadingFormCreateTest}
            onClick={() => {
              form.submit();
            }}
          >
            Submit
          </Button>,
        ]}
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
                  <DatePicker
                    style={{ width: "100%", height: "45px" }}
                    onChange={(date) => {
                      setSelectedDate(date);
                      if (date && selectedTime) {
                        fetchAvailableDoctors(date, selectedTime);
                      }
                    }}
                  />
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
                  rules={[
                    { required: true, message: "Please select a doctor" },
                  ]}
                >
                  <Select
                    className="!h-[45px]"
                    placeholder="Choose an available doctor"
                    loading={availableDoctors.length === 0}
                  >
                    {availableDoctors.map((doc) => (
                      <Select.Option key={doc.doctorId} value={doc.doctorId}>
                        {doc.account.email} - {doc.account.fullName}
                      </Select.Option>
                    ))}
                  </Select>
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
                  <Select
                    className="!h-[45px]"
                    placeholder="Choose a test type"
                  >
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

      {/* Test Results Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-blue-600" />
            <span>Patient Test Results</span>
          </div>
        }
        open={openModalTestResult}
        onCancel={() => {
          setOpenModalTestResult(false);
          setTestResults([]);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setOpenModalTestResult(false);
              setTestResults([]);
            }}
          >
            Close
          </Button>,
        ]}
        width={1000}
        centered
      >
        <div className="test-results-content">
          {loadingTestResults ? (
            <div className="flex justify-center items-center py-8">
              <Spin size="large" />
              <span className="ml-3">Loading test results...</span>
            </div>
          ) : testResults.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No test results found for this patient"
            />
          ) : (
            <div className="space-y-4">
              <Title level={4}>Test Results ({testResults.length})</Title>
              {testResults.map((result, index) => (
                <Card
                  key={result.testResultId || index}
                  className="test-result-card"
                  size="small"
                >
                  <span>TestResultId: {result.testResultId}</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Descriptions
                      title="Test Information"
                      column={1}
                      size="small"
                      bordered
                    >
                      <Descriptions.Item label="Test Type">
                        <Tag color="blue">{result.testType}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Test Date">
                        {new Date(result.testDate).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Descriptions.Item>
                      <Descriptions.Item label="Lab Name">
                        {result.labName || "N/A"}
                      </Descriptions.Item>
                    </Descriptions>

                    <Descriptions
                      title="Results"
                      column={1}
                      size="small"
                      bordered
                    >
                      <Descriptions.Item label="Test Result">
                        <Tag
                          color={
                            result.testResults === "Positive"
                              ? "red"
                              : result.testResults === "Negative"
                              ? "green"
                              : "orange"
                          }
                          className="font-semibold"
                        >
                          {result.testResults}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="CD4 Count">
                        {result.cD4Count || "N/A"}
                      </Descriptions.Item>
                      <Descriptions.Item label="HIV Viral Load">
                        {result.hivViralLoadValue || "N/A"}
                      </Descriptions.Item>
                    </Descriptions>

                    <Descriptions
                      title="Doctor Test Information"
                      column={1}
                      size="small"
                      bordered
                    >
                      <Descriptions.Item label="Full name">
                        <Tag className="font-semibold">
                          {result?.doctorFullName}
                        </Tag>
                      </Descriptions.Item>

                      <Descriptions.Item label="Email">
                        {result?.doctorEmail}
                      </Descriptions.Item>

                      <Descriptions.Item label="Phone Number">
                        {result?.doctorPhoneNumber}
                      </Descriptions.Item>

                      <Descriptions.Item label="Doctor Specialty">
                        {result?.doctorSpecialty}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>

                  {result.doctorComments && (
                    <div className="mt-4">
                      <Divider orientation="left" className="text-sm">
                        Doctor Comments
                      </Divider>
                      <Text className="text-gray-600 italic">
                        "{result.doctorComments}"
                      </Text>
                    </div>
                  )}

                  <div className="mt-3 text-right">
                    <Text type="secondary" className="text-xs">
                      Patient Code: {result?.patientCodeAtFacility || "N/A"}
                    </Text>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Modal tạo điều trị */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#e53e3e", fontSize: 24 }}>❤️</span>
            <span style={{ fontWeight: 600, fontSize: 20 }}>
              Create Therapy for Patient
            </span>
          </div>
        }
        open={openTreatmentModal}
        onCancel={() => setOpenTreatmentModal(false)}
        footer={null}
        width={800}
        centered
      >
        <Form
          form={treatmentForm}
          layout="vertical"
          onFinish={async (values) => {
            setTreatmentLoading(true);
            try {
              const payload = {
                patientId: parseInt(values.patientId),
                regimenId: parseInt(values.regimenId),
                prescribingDoctorId: parseInt(values.prescribingDoctorId),
                startDate: values.startDate.format(
                  "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
                ),
                expectedEndDate: values.expectedEndDate.format(
                  "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
                ),
                regimenAdjustments: values.regimenAdjustments || "string",
                baselineCD4: parseInt(values.baselineCD4),
                baselineHivViralLoad: values.baselineHivViralLoad || "string",
                actualDosage: values.actualDosage || "string",
                status: values.status || "InTreatment",
                reasonForChangeOrStop: values.reasonForChangeOrStop || "string",
              };

              await createPatientTreatment(payload);
              await handleUpdateAppointmentCompleted(
                treatmentRecordRef.current
              );
              toast.success(
                "Create treatment and complete appointment successfully!"
              );
              setOpenTreatmentModal(false);
            } catch (error) {
              console.error("Treatment creation error:", error);
              toast.error("Treatment creation failed or status update failed!");
            }
            setTreatmentLoading(false);
          }}
          onValuesChange={(changedValues) => {
            if (
              "baselineCD4" in changedValues ||
              "baselineHivViralLoad" in changedValues
            ) {
              const currentValues = treatmentForm.getFieldsValue();
              if (
                currentValues.baselineCD4 &&
                currentValues.baselineHivViralLoad
              ) {
                fetchSuggestedRegimens({
                  cD4Count: currentValues.baselineCD4,
                  hivViralLoadValue: currentValues.baselineHivViralLoad,
                });
              }
            }
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Patient ID"
                name="patientId"
                initialValue={treatmentRecordRef.current?.patient?.patientId}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Prescribing Doctor ID"
                name="prescribingDoctorId"
                initialValue={doctorId}
                rules={[{ required: true, message: "Please enter doctor ID" }]}
              >
                <Input value={doctorId} disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="baselineCD4"
                label="Baseline CD4"
                rules={[
                  { required: true, message: "Please enter baseline CD4" },
                ]}
                tooltip={
                  latestPCRResult?.testDate
                    ? `From PCR test on ${new Date(
                        latestPCRResult.testDate
                      ).toLocaleDateString()}`
                    : null
                }
              >
                <InputNumber style={{ width: "100%" }} min={0} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="baselineHivViralLoad"
                label="Baseline HIV Viral Load"
                rules={[
                  {
                    required: true,
                    message: "Please enter baseline HIV viral load",
                  },
                ]}
                tooltip={
                  latestPCRResult?.testDate
                    ? `From PCR test on ${new Date(
                        latestPCRResult.testDate
                      ).toLocaleDateString()}`
                    : null
                }
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="regimenId"
            label={
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span>Regimen</span>
                <Button
                  type="primary"
                  size="small"
                  loading={suggestLoading}
                  onClick={() => {
                    const values = treatmentForm.getFieldsValue();
                    if (!values.baselineCD4 || !values.baselineHivViralLoad) {
                      toast.error(
                        "Please ensure CD4 and HIV Viral Load values are available"
                      );
                      return;
                    }
                    fetchSuggestedRegimens({
                      cD4Count: values.baselineCD4,
                      hivViralLoadValue: values.baselineHivViralLoad,
                    }).then(() => {
                      // Auto select suggested regimen when available
                      if (suggestedRegimen) {
                        treatmentForm.setFieldValue(
                          "regimenId",
                          suggestedRegimen.regimenId
                        );
                        setSelectedRegimen(suggestedRegimen);
                      }
                    });
                  }}
                  icon={<ReloadOutlined />}
                >
                  Suggest
                </Button>
                
              </div>
            }
            rules={[{ required: true, message: "Please select regimen" }]}
          >
            <Select
              placeholder="Select regimen"
              loading={regimenOptions.length === 0}
              onChange={(value) => {
                const selectedReg = regimenOptions.find(
                  (reg) => reg.regimenId === value
                );
                setSelectedRegimen(selectedReg);
              }}
              value={treatmentForm.getFieldValue("regimenId")}
            >
              {regimenOptions.map((item) => (
                <Select.Option key={item.regimenId} value={item.regimenId}>
                  {item.regimenName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {selectedRegimen && (
            <div
              style={{
                marginBottom: 16,
                background: "#f8fafc",
                borderRadius: 8,
                padding: 12,
                border: "1px solid #e0e7ef",
              }}
            >
              <div>
                <b>Description:</b> {selectedRegimen.detailedDescription}
              </div>
              <div>
                <b>Target:</b> {selectedRegimen.targetPopulation}
              </div>
              <div>
                <b>Dosage:</b> {selectedRegimen.standardDosage}
              </div>
              <div>
                <b>Contraindications:</b> {selectedRegimen.contraindications}
              </div>
              <div>
                <b>Side Effects:</b> {selectedRegimen.commonSideEffects}
              </div>
            </div>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[
                  { required: true, message: "Please select start date" },
                ]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: "100%" }}
                  onChange={(date) => {
                    if (date) {
                      const currentRegimenId =
                        treatmentForm.getFieldValue("regimenId");
                      let endDate;

                      switch (currentRegimenId) {
                        case 1:
                          endDate = date.clone().add(6, "months");
                          break;
                        case 2:
                          endDate = date.clone().add(12, "months");
                          break;
                        case 3:
                          endDate = date.clone().add(18, "months");
                          break;
                        default:
                          endDate = date.clone().add(6, "months");
                      }

                     
                      treatmentForm.setFieldValue("expectedEndDate", endDate);
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="expectedEndDate"
                label="Expected End Date"
                rules={[
                  {
                    required: true,
                    message: "Please select expected end date",
                  },
                ]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="actualDosage"
            label="Actual Dosage"
            rules={[{ required: true, message: "Please enter actual dosage" }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            initialValue="InTreatment"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select>
              <Select.Option value="InTreatment">In Treatment</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="regimenAdjustments" label="Regimen Adjustments">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="reasonForChangeOrStop"
            label="Reason for Change or Stop"
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Row justify="end" gutter={16}>
            <Col>
              <Button onClick={() => treatmentForm.resetFields()}>Reset</Button>
            </Col>
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                loading={treatmentLoading}
                style={{ background: "#e53e3e", border: "none" }}
              >
                Create Therapy
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#e53e3e", fontSize: 24 }}>❤️</span>
            <span style={{ fontWeight: 600, fontSize: 20 }}>
              Previous Treatment History
            </span>
          </div>
        }
        open={previousTreatmentModalVisible}
        onCancel={() => setPreviousTreatmentModalVisible(false)}
        footer={null}
        width={800}
        centered
      >
        <div className="previous-treatments-list">
          {loadingPreviousTreatment ? (
            <div className="flex justify-center items-center py-8">
              <Spin size="large" />
              <span className="ml-3">Loading previous treatments...</span>
            </div>
          ) : !previousTreatments || previousTreatments.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No previous treatments found for this patient"
            />
          ) : (
            <List
              dataSource={previousTreatments}
              renderItem={(treatment) => (
                <List.Item key={treatment.patientTreatmentId}>
                  <Card style={{ width: "100%" }} className="mb-4">
                    <div style={{ marginBottom: 16 }}>
                      <Tag
                        color={
                          treatment.status === "InTreatment"
                            ? "processing"
                            : treatment.status === "Completed"
                            ? "success"
                            : "error"
                        }
                        style={{ padding: "4px 8px", marginBottom: 8 }}
                      >
                        Status: {treatment.status}
                      </Tag>
                    </div>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Patient ID"
                          style={{ marginBottom: 12 }}
                        >
                          <Input value={treatment.patientId} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Doctor ID"
                          style={{ marginBottom: 12 }}
                        >
                          <Input
                            value={treatment.prescribingDoctorId}
                            disabled
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Thêm phần hiển thị thông tin ARV */}
                    <div
                      style={{
                        marginBottom: 16,
                        background: "#f8fafc",
                        borderRadius: 8,
                        padding: 12,
                        border: "1px solid #e0e7ef",
                      }}
                    >
                      <Title level={5} style={{ marginBottom: 12 }}>
                        ARV Regimen Information
                      </Title>
                      <Descriptions bordered size="small" column={1}>
                        <Descriptions.Item
                          label={<strong>Regimen Name</strong>}
                        >
                          {regimenOptions.find(
                            (r) => r.regimenId === treatment.regimenId
                          )?.regimenName || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={<strong>Standard Dosage</strong>}
                        >
                          {regimenOptions.find(
                            (r) => r.regimenId === treatment.regimenId
                          )?.standardDosage || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={<strong>Target Population</strong>}
                        >
                          {regimenOptions.find(
                            (r) => r.regimenId === treatment.regimenId
                          )?.targetPopulation || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label={<strong>Description</strong>}>
                          {regimenOptions.find(
                            (r) => r.regimenId === treatment.regimenId
                          )?.detailedDescription || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={<strong>Side Effects</strong>}
                        >
                          {regimenOptions.find(
                            (r) => r.regimenId === treatment.regimenId
                          )?.commonSideEffects || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={<strong>Contraindications</strong>}
                        >
                          {regimenOptions.find(
                            (r) => r.regimenId === treatment.regimenId
                          )?.contraindications || "N/A"}
                        </Descriptions.Item>
                      </Descriptions>
                    </div>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Baseline CD4"
                          style={{ marginBottom: 12 }}
                        >
                          <Input value={treatment.baselineCD4} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Baseline HIV Viral Load"
                          style={{ marginBottom: 12 }}
                        >
                          <Input
                            value={treatment.baselineHivViralLoad}
                            disabled
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <div
                      style={{
                        marginBottom: 16,
                        background: "#f8fafc",
                        borderRadius: 8,
                        padding: 12,
                        border: "1px solid #e0e7ef",
                      }}
                    >
                      <Title level={5} style={{ marginBottom: 12 }}>
                        Treatment Period
                      </Title>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            label="Start Date"
                            style={{ marginBottom: 12 }}
                          >
                            <Input
                              value={dayjs(treatment.startDate).format(
                                "DD/MM/YYYY HH:mm"
                              )}
                              disabled
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label="Expected End Date"
                            style={{ marginBottom: 12 }}
                          >
                            <Input
                              value={
                                treatment.expectedEndDate
                                  ? dayjs(treatment.expectedEndDate).format(
                                      "DD/MM/YYYY HH:mm"
                                    )
                                  : "Ongoing"
                              }
                              disabled
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>

                    <div
                      style={{
                        marginBottom: 16,
                        background: "#f8fafc",
                        borderRadius: 8,
                        padding: 12,
                        border: "1px solid #e0e7ef",
                      }}
                    >
                      <Title level={5} style={{ marginBottom: 12 }}>
                        Treatment Details
                      </Title>
                      <Form.Item
                        label="Actual Dosage"
                        style={{ marginBottom: 12 }}
                      >
                        <Input.TextArea
                          value={treatment.actualDosage}
                          disabled
                          rows={2}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Regimen Adjustments"
                        style={{ marginBottom: 12 }}
                      >
                        <Input.TextArea
                          value={treatment.regimenAdjustments}
                          disabled
                          rows={3}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Reason for Change/Stop"
                        style={{ marginBottom: 12 }}
                      >
                        <Input.TextArea
                          value={treatment.reasonForChangeOrStop}
                          disabled
                          rows={3}
                        />
                      </Form.Item>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          )}
        </div>
      </Modal>

      {/* Thêm Modal Edit Treatment */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#e53e3e", fontSize: 24 }}>❤️</span>
            <span style={{ fontWeight: 600, fontSize: 20 }}>
              Edit Treatment
            </span>
          </div>
        }
        open={editTreatmentModalVisible}
        onCancel={() => setEditTreatmentModalVisible(false)}
        footer={null}
        width={800}
        centered
      >
        {currentEditTreatment && (
          <Form
            form={editTreatmentForm}
            layout="vertical"
            onFinish={handleUpdateTreatment}
            onValuesChange={(changedValues) => {
              if (
                "baselineCD4" in changedValues ||
                "baselineHivViralLoad" in changedValues
              ) {
                const currentValues = editTreatmentForm.getFieldsValue();
                if (
                  currentValues.baselineCD4 &&
                  currentValues.baselineHivViralLoad
                ) {
                  // Gợi ý lại regimen khi đổi CD4/HIV
                  fetchSuggestedRegimensEdit({
                    cD4Count: currentValues.baselineCD4,
                    hivViralLoadValue: currentValues.baselineHivViralLoad,
                  });
                }
              }
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Patient ID" name="patientId">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Doctor ID" name="prescribingDoctorId">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="baselineCD4"
                  label="Baseline CD4"
                  rules={[
                    { required: true, message: "Please enter baseline CD4" },
                  ]}
                  tooltip={
                    latestPCRResultEdit?.testDate
                      ? `From PCR test on ${new Date(
                          latestPCRResultEdit.testDate
                        ).toLocaleDateString()}`
                      : null
                  }
                >
                  <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="baselineHivViralLoad"
                  label="Baseline HIV Viral Load"
                  rules={[
                    {
                      required: true,
                      message: "Please enter baseline HIV viral load",
                    },
                  ]}
                  tooltip={
                    latestPCRResultEdit?.testDate
                      ? `From PCR test on ${new Date(
                          latestPCRResultEdit.testDate
                        ).toLocaleDateString()}`
                      : null
                  }
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="regimenId"
              label={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span>Regimen</span>
                  <Button
                    type="primary"
                    size="small"
                    loading={suggestLoading}
                    onClick={() => {
                      const values = editTreatmentForm.getFieldsValue();
                      if (!values.baselineCD4 || !values.baselineHivViralLoad) {
                        toast.error(
                          "Please ensure CD4 and HIV Viral Load values are available"
                        );
                        return;
                      }
                      fetchSuggestedRegimensEdit({
                        cD4Count: values.baselineCD4,
                        hivViralLoadValue: values.baselineHivViralLoad,
                      });
                    }}
                    icon={<ReloadOutlined />}
                  >
                    Suggest
                  </Button>
                  {suggestLoading ? (
                    <Spin size="small" />
                  ) : (
                    suggestedRegimenEdit && (
                      <Tag color="blue">
                        Suggested: {suggestedRegimenEdit.regimenName}
                      </Tag>
                    )
                  )}
                </div>
              }
              rules={[{ required: true, message: "Please select regimen" }]}
            >
              <Select
                placeholder="Select regimen"
                loading={regimenOptions.length === 0}
                onChange={(value) => {
                  const selectedReg = regimenOptions.find(
                    (reg) => reg.regimenId === value
                  );
                  setSelectedRegimenEdit(selectedReg);
                }}
              >
                {regimenOptions.map((item) => (
                  <Select.Option key={item.regimenId} value={item.regimenId}>
                    {item.regimenName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {selectedRegimenEdit && (
              <div
                style={{
                  marginBottom: 16,
                  background: "#f8fafc",
                  borderRadius: 8,
                  padding: 12,
                  border: "1px solid #e0e7ef",
                }}
              >
                <div>
                  <b>Description:</b> {selectedRegimenEdit.detailedDescription}
                </div>
                <div>
                  <b>Target:</b> {selectedRegimenEdit.targetPopulation}
                </div>
                <div>
                  <b>Dosage:</b> {selectedRegimenEdit.standardDosage}
                </div>
                <div>
                  <b>Contraindications:</b>{" "}
                  {selectedRegimenEdit.contraindications}
                </div>
                <div>
                  <b>Side Effects:</b> {selectedRegimenEdit.commonSideEffects}
                </div>
              </div>
            )}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="startDate"
                  label="Start Date"
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="expectedEndDate"
                  label="Expected End Date"
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="actualDosage"
              label="Actual Dosage"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="InTreatment">In Treatment</Select.Option>
                <Select.Option value="Completed">Completed</Select.Option>
                <Select.Option value="Discontinued">Discontinued</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="regimenAdjustments" label="Regimen Adjustments">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item
              name="reasonForChangeOrStop"
              label="Reason for Change or Stop"
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Row justify="end" gutter={16}>
              <Col>
                <Button onClick={() => setEditTreatmentModalVisible(false)}>
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={treatmentLoading}
                >
                  Update Treatment
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default CheckedInAppointmentToday;
