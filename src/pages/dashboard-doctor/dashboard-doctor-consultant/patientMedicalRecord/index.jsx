import {
  Button,
  Input,
  Card,
  Empty,
  Typography,
  Space,
  Divider,
  Modal,
  Form,
  DatePicker,
  Select,
  Row,
  Col,
  Descriptions,
  Tag,
  InputNumber,
  Radio,
} from "antd";
import {
  SearchOutlined,
  FileAddOutlined,
  UserOutlined,
  HistoryOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  MedicineBoxFilled,
  PlusOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import "./index.scss";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { createMedicalRecord } from "../../../../apis/medicalRecord/createMedicalRecordApi";
import { toast } from "react-toastify";
import { getMedicalRecordByPatientPhone } from "../../../../apis/medicalRecord/getMedicalRecordByPatientPhoneApi";
import { addTestResultToMedicalRecord } from "../../../../apis/medicalRecord/addTestResultToMedicalRecordApi";
import { getDoctorByAccountId } from "../../../../apis/doctorApi/doctorApi";
import { useSelector } from "react-redux";
const { Title, Text } = Typography;

// // Hàm chuẩn hóa số điện thoại về dạng +84...
// function normalizePhone(phone) {
//   let p = phone.replace(/\D/g, "");
//   if (p.startsWith("0") && p.length === 10) {
//     return "+84" + p.substring(1);
//   }
//   if (phone.startsWith("+84")) {
//     return phone;
//   }
//   return phone;
// }

const PatientMedicalRecord = () => {
  const [dataMedicalRecord, setDataMedicalRecord] = useState([]);
  const [searchPatientPhone, setSearchPatientPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [openAddTestResultModal, setOpenAddTestResultModal] = useState(false);
  const [selectedMedicalRecordId, setSelectedMedicalRecordId] = useState(null);
  const [addTestResultLoading, setAddTestResultLoading] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);

  // Lấy accountID từ Redux thay vì sessionStorage
  const accountID = useSelector((store) => store?.user?.accountID);
  const [doctorIdFromAppointment, setDoctorIdFromAppointment] = useState(null);

  useEffect(() => {
    const checkedInInformationRaw = sessionStorage.getItem("checkedInPatients");
    const checkedInPatients = checkedInInformationRaw ? JSON.parse(checkedInInformationRaw) : [];
    const firstPatient = Array.isArray(checkedInPatients) ? checkedInPatients[0] : null;
    const doctorId = firstPatient?.doctor?.doctorId;
    if (doctorId) {
      setDoctorIdFromAppointment(doctorId);
    } else if (accountID) {
      getDoctorByAccountId(accountID)
        .then(res => {
          setDoctorIdFromAppointment(res.data?.data?.doctorId || null);
        })
        .catch(() => setDoctorIdFromAppointment(null));
    }
  }, [accountID]);

  const checkedInInformationRaw = sessionStorage.getItem("checkedInPatients");
  const checkedInPatients = checkedInInformationRaw
    ? JSON.parse(checkedInInformationRaw)
    : [];
  const firstPatient = Array.isArray(checkedInPatients)
    ? checkedInPatients[0]
    : null;
  const patientId = firstPatient?.patient?.patientId || null;


  const [form] = Form.useForm();
  const [addTestResultForm] = Form.useForm();
  const testResultNew = sessionStorage.getItem("testResultNew");
  const testResultId = testResultNew
    ? JSON.parse(testResultNew)?.testResultId || null
    : null;


  const displayValue = (value) => {
    if (value === null || value === undefined || value === "") return "N/A";
    return value;
  };

  // Handle opening add test result modal
  const handleAddTestResult = (medicalRecordId) => {
    setSelectedMedicalRecordId(medicalRecordId);
    setOpenAddTestResultModal(true);
    addTestResultForm.resetFields();
  };

  // Handle adding test result to medical record
  const handleAddTestResultSubmit = async (values) => {
    try {
      setAddTestResultLoading(true);
      await addTestResultToMedicalRecord(selectedMedicalRecordId, {
        testResultId: values.testResultId,
      });

      toast.success("Test result added to medical record successfully!");
      setOpenAddTestResultModal(false);

      // Refresh the medical records to show updated data
      await searchMedicalRecordByPatientPhone();
    } catch (error) {
      console.error("Error adding test result to medical record:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to add test result to medical record"
      );
    } finally {
      setAddTestResultLoading(false);
    }
  };

  // Handle modal cancel for add test result
  const handleAddTestResultModalCancel = () => {
    setOpenAddTestResultModal(false);
    setSelectedMedicalRecordId(null);
    addTestResultForm.resetFields();
  };

  const searchMedicalRecordByPatientPhone = async () => {
    if (!searchPatientPhone.trim()) {
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      // Gọi API trực tiếp với số điện thoại không chuẩn hóa
      const response = await getMedicalRecordByPatientPhone(searchPatientPhone.trim());
      let records = response?.data?.data;
      // Đảm bảo records luôn là mảng
      if (Array.isArray(records)) {
        setDataMedicalRecord(records);
      } else if (records) {
        setDataMedicalRecord([records]);
      } else {
        setDataMedicalRecord([]);
      }
    } catch (error) {
      console.error("Error fetching medical records:", error);
      setDataMedicalRecord([]);
    }
    setLoading(false);
  };

  const handleCreateMedicalRecord = () => {
    setOpenCreateModal(true);
    // Set default consultation date to today và doctorId từ state doctorIdFromAppointment
    form.setFieldsValue({
      consultationDate: dayjs(),
      pregnancyStatus: "NotPregnant",
      doctorId: doctorIdFromAppointment || "",
      testResultId: testResultId || "",
    });
  };

  // Thêm useEffect để cập nhật form khi doctorIdFromAppointment thay đổi
  useEffect(() => {
    if (openCreateModal && doctorIdFromAppointment) {
      form.setFieldValue("doctorId", doctorIdFromAppointment);
    }
  }, [doctorIdFromAppointment, openCreateModal]);

  // get Medical Record by Patient ID

  const handleFormSubmit = async (values) => {
    setCreateLoading(true);
    try {
      // Kiểm tra nếu searchPatientEmail rỗng thì không cho phép tạo
      if (!searchPatientPhone || !searchPatientPhone.trim()) {
        toast.error("Patient Email is required!");
        setCreateLoading(false);
        return;
      }
      // Format the data for API submission
      const formattedData = {
        ...values,
        consultationDate: values.consultationDate.format(
          "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
        ),
      
        testResultId: parseInt(values.testResultId) || 0,
        doctorId: parseInt(values.doctorId) || parseInt(doctorIdFromAppointment) || 0, // Use form value first, fallback to state
      };

      // Only include pregnancy fields if gender is FEMALE
      if (values.gender === "FEMALE") {
        formattedData.pregnancyStatus = values.pregnancyStatus;
        formattedData.pregnancyWeek = parseInt(values.pregnancyWeek) || 0;
      }

      console.log("Medical record data to submit:", formattedData);
      await createMedicalRecord(patientId, formattedData);
      form.resetFields();
      setSelectedGender(null); // Reset gender selection
      setOpenCreateModal(false);
      toast.success("Medical record created successfully!");
      if (searchPatientPhone) {
        searchMedicalRecordByPatientPhone();
      }
    } catch (error) {
      console.error("Error creating medical record:", error);
    }
    setCreateLoading(false);
  };

  const handleModalCancel = () => {
    setOpenCreateModal(false);
    form.resetFields();
    setSelectedGender(null); // Reset gender selection
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchMedicalRecordByPatientPhone();
    }
  };

  return (
    <div className="patient-medical-record">
      <Card className="search-card">
        <div className="search-header">
          <Title level={3} className="search-title">
            <HistoryOutlined className="title-icon" />
            Patient Medical Records
          </Title>
          <Text type="secondary">
            Search and view patient medical history and test results
          </Text>
        </div>

        <Divider />

        <div className="search-section">
          <Space.Compact className="search-input-group">
            <Input
              size="large"
              placeholder="Enter Phone Number to search medical records"
              prefix={<UserOutlined />}
              value={searchPatientPhone}
              onChange={(e) => setSearchPatientPhone(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              loading={loading}
              onClick={searchMedicalRecordByPatientPhone}
              disabled={!searchPatientPhone.trim()}
              className="search-button"
            >
              Search Records
            </Button>
          </Space.Compact>
        </div>

        {hasSearched && (
          <div className="results-section">
            <Divider />

            {dataMedicalRecord.length === 0 ? (
              <div className="empty-results">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div className="empty-description">
                      <Text>
                        No medical records found for Patient Phone:{" "}
                        <strong>{searchPatientPhone}</strong>
                      </Text>
                    </div>
                  }
                >
                  <Button
                    type="primary"
                    icon={<FileAddOutlined />}
                    size="large"
                    onClick={handleCreateMedicalRecord}
                    className="create-record-button"
                  >
                    Create Medical Record
                  </Button>
                </Empty>
              </div>
            ) : (
              <div className="medical-records-list">
                <Title level={4}>Medical Record Found</Title>
                <div className="medical-records-scroll-container">
                  {dataMedicalRecord.map((record, index) => {
                    console.log("Medical Record:", record);
                    return (
                      <Card
                        key={record.medicalRecordId || index}
                        className="medical-record-card"
                        size="small"
                      >
                        <div className="record-header">
                          <div className="record-title">
                            <MedicineBoxFilled className="record-icon" />
                            <span>
                              Medical Record #{record.medicalRecordId}
                            </span>
                          </div>
                          {/* Add Test Result Button */}
                          <div className="record-actions">
                            <Button
                              type="primary"
                              icon={<ExperimentOutlined />}
                              onClick={() =>
                                handleAddTestResult(record.medicalRecordId)
                              }
                              className="add-test-result-button"
                            >
                              Add Test Result
                            </Button>
                          </div>
                          <div className="consultation-date">
                            <CalendarOutlined className="date-icon" />
                            <span>
                              {new Date(
                                record.consultationDate
                              ).toLocaleDateString("vi-VN", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>

                        <Divider />

                        <Row gutter={16}>
                          <Col span={12}>
                            <Descriptions
                              title="Patient Information"
                              column={1}
                              size="small"
                              bordered
                            >
                              <Descriptions.Item label="Patient ID">
                                {displayValue(record.patient?.patientId)}
                              </Descriptions.Item>
                              <Descriptions.Item label="Patient Code">
                                {displayValue(
                                  record.patient?.patientCodeAtFacility
                                )}
                              </Descriptions.Item>
                              <Descriptions.Item label="Symptoms">
                                <Text className="symptoms-text">
                                  {displayValue(record.symptoms)}
                                </Text>
                              </Descriptions.Item>
                              <Descriptions.Item label="Diagnosis">
                                <Text className="diagnosis-text">
                                  {displayValue(record.diagnosis)}
                                </Text>
                              </Descriptions.Item>
                              <Descriptions.Item label="Pregnancy Status">
                                <Tag
                                  color={
                                    record.pregnancyStatus === "Pregnant"
                                      ? "pink"
                                      : record.pregnancyStatus === "NotPregnant"
                                      ? "green"
                                      : "orange"
                                  }
                                >
                                  {record.pregnancyStatus === "NotPregnant"
                                    ? "Not Pregnant"
                                    : displayValue(record.pregnancyStatus)}
                                </Tag>
                              </Descriptions.Item>
                              <Descriptions.Item label="Pregnancy Week">
                                {record.pregnancyWeek !== null &&
                                record.pregnancyWeek !== undefined
                                  ? `${record.pregnancyWeek} weeks`
                                  : "N/A"}
                              </Descriptions.Item>
                              <Descriptions.Item label="Gender">
                                {displayValue(record.patient?.gender) !== "N/A"
                                  ? displayValue(record.patient?.gender)
                                  : displayValue(record.gender)}
                              </Descriptions.Item>
                              <Descriptions.Item label="Date of birth">
                                {record.patient?.dateOfBirth &&
                                record.patient?.dateOfBirth !== "N/A"
                                  ? dayjs(record.patient.dateOfBirth).format(
                                      "DD/MM/YYYY"
                                    )
                                  : displayValue(record.dateOfBirth)}
                              </Descriptions.Item>
                              <Descriptions.Item label="Doctor Notes">
                                <Text className="notes-content">
                                  {displayValue(record.doctorNotes)}
                                </Text>
                              </Descriptions.Item>
                              <Descriptions.Item label="Next Steps">
                                <Text className="steps-content">
                                  {displayValue(record.nextSteps)}
                                </Text>
                              </Descriptions.Item>
                            </Descriptions>
                          </Col>

                          <Col span={12}>
                            <Descriptions
                              title="Medical record creator"
                              column={1}
                              size="small"
                              bordered
                            >
                              <Descriptions.Item label="Doctor">
                                Dr. {record.doctor?.specialty} -{" "}
                                {record.doctor?.qualifications}
                              </Descriptions.Item>

                              <Descriptions.Item label="Experience">
                                {record.doctor?.yearsOfExperience} years
                              </Descriptions.Item>
                            </Descriptions>
                          </Col>
                        </Row>
                        {(record.underlyingDisease ||
                          record.drugAllergyHistory) && (
                          <>
                            <Divider orientation="left">
                              Additional Information
                            </Divider>
                            <Row gutter={16}>
                              {record.underlyingDisease && (
                                <Col span={12}>
                                  <div className="additional-info">
                                    <Text strong>Underlying Disease:</Text>
                                    <br />
                                    <Text>
                                      {displayValue(record.underlyingDisease)}
                                    </Text>
                                  </div>
                                </Col>
                              )}
                              {record.drugAllergyHistory && (
                                <Col span={12}>
                                  <div className="additional-info">
                                    <Text strong>Drug Allergy History:</Text>
                                    <br />
                                    <Text>
                                      {displayValue(record.drugAllergyHistory)}
                                    </Text>
                                  </div>
                                </Col>
                              )}
                            </Row>
                          </>
                        )}

                        <Divider orientation="left">Doctor Notes</Divider>
                        <div className="doctor-notes">
                          <Text className="notes-content">
                            {record.doctorNotes}
                          </Text>
                        </div>

                        <Divider orientation="left">Next Steps</Divider>
                        <div className="next-steps">
                          <Text className="steps-content">
                            {record.nextSteps}
                          </Text>
                        </div>

                        {record.testResults &&
                          record.testResults.length > 0 && (
                            <>
                              <Divider orientation="left">
                                Related Test Results
                              </Divider>
                              <div className="test-results-section">
                                {record.testResults.map((test, testIndex) => (
                                  <Card
                                    key={test.testResultId || testIndex}
                                    size="small"
                                    className="test-result-mini-card"
                                  >
                                    <Row gutter={8}>
                                      <Col span={6}>
                                        <Text strong>Test Type:</Text>
                                        <br />
                                        <Tag color="blue">{test.testType}</Tag>
                                      </Col>
                                      <Col span={6}>
                                        <Text strong>Result:</Text>
                                        <br />
                                        <Tag
                                          color={
                                            test.testResults === "Positive"
                                              ? "red"
                                              : "green"
                                          }
                                        >
                                          {test.testResults}
                                        </Tag>
                                      </Col>
                                      <Col span={6}>
                                        <Text strong>Lab:</Text>
                                        <br />
                                        <Text>{test.labName}</Text>
                                      </Col>
                                      <Col span={6}>
                                        <Text strong>Test Date:</Text>
                                        <br />
                                        <Text>
                                          {test.testDate
                                            ? new Date(
                                                test.testDate
                                              ).toLocaleDateString("vi-VN")
                                            : "N/A"}
                                        </Text>
                                      </Col>

                                        
                                    </Row>
                                     <Row gutter={8} style={{ marginTop: 12 }}>
                                       <Col span={6}>
                                        <Text strong>Testing Doctor:</Text>
                                        <br />
                                        <Text>
                                          {test.doctorFullName
                                            ? test.doctorFullName
                                            : "N/A"}
                                        </Text>
                                      </Col>
                                       <Col span={6}>
                                        <Text strong>Email Doctor:</Text>
                                        <br />
                                        <Text>
                                          {test.doctorEmail
                                            ? test.doctorEmail
                                            : "N/A"}
                                        </Text>
                                      </Col>
                                      </Row>
                                    {/* Additional medical indicators */}
                                    {(test.cD4Count !== null ||
                                      test.hivViralLoadValue !== null) && (
                                      <Row gutter={8} style={{ marginTop: 12 }}>
                                        {test.cD4Count !== null && (
                                          <Col span={12}>
                                            <Text strong>CD4 Count:</Text>
                                            <br />
                                            <Tag color="purple">
                                              {test.cD4Count} cells/μL
                                            </Tag>
                                          </Col>
                                        )}
                                        {test.hivViralLoadValue !== null && (
                                          <Col span={12}>
                                            <Text strong>HIV Viral Load:</Text>
                                            <br />
                                            <Tag color="orange">
                                              {test.hivViralLoadValue} copies/mL
                                            </Tag>
                                          </Col>
                                        )}
                                      </Row>
                                    )}
                                    {test.doctorComments && (
                                      <div className="test-comments">
                                        <Text type="secondary" italic>
                                          Doctor Comment: "{test.doctorComments}
                                          "
                                        </Text>
                                      </div>
                                    )}
                                  </Card>
                                ))}
                              </div>
                            </>
                          )}

                        {/* Hiển thị thông tin treatment */}
                        {record.patientTreatments &&
                          record.patientTreatments.length > 0 && (
                            <>
                              <Divider orientation="left">
                                Related Treatments
                              </Divider>
                              <div className="treatments-section">
                                {record.patientTreatments.map(
                                  (treatment, idx) => (
                                    <Card
                                      key={treatment.treatmentId || idx}
                                      size="small"
                                      className="treatment-mini-card"
                                      style={{ marginBottom: 12 }}
                                    >
                                      <Descriptions
                                        column={1}
                                        size="small"
                                        bordered
                                      >
                                        <Descriptions.Item label="Regimen ">
                                          {treatment.regimen?.regimenName}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Start Date">
                                          {treatment.startDate
                                            ? dayjs(treatment.startDate).format(
                                                "DD/MM/YYYY"
                                              )
                                            : "N/A"}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Expected End Date">
                                          {treatment.expectedEndDate
                                            ? dayjs(
                                                treatment.expectedEndDate
                                              ).format("DD/MM/YYYY")
                                            : "N/A"}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Actual Dosage">
                                          {treatment.actualDosage}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Status">
                                          {treatment.status}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Reason For Change Or Stop">
                                          {treatment.reasonForChangeOrStop}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Regimen Adjustments">
                                          {treatment.regimenAdjustments}
                                        </Descriptions.Item>
                                      </Descriptions>
                                    </Card>
                                  )
                                )}
                              </div>
                            </>
                          )}

                        <Divider />
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Create Medical Record Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MedicineBoxOutlined className="text-blue-600" />
            <span>Create Medical Record</span>
          </div>
        }
        open={openCreateModal}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={createLoading}
            onClick={() => form.submit()}
          >
            Create Record
          </Button>,
        ]}
        width={900}
        centered
      >
        <div className="create-medical-record-form">
          <div className="patient-info-header">
            <Text type="secondary">
              Creating medical record for Patient with Phone:{" "}
              <strong>{searchPatientPhone}</strong>
            </Text>
          </div>

          <Divider />

          <div className="form-scroll-container">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFormSubmit}
              className="medical-record-form"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="testResultId"
                    label="Test Result ID"
                    rules={[
                      {
                        required: true,
                        message: "Please enter test result ID",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Enter test result ID"
                      min={0}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="doctorId"
                    label={`Doctor ID - ${firstPatient?.doctor?.fullName || "Doctor"}`}
                    initialValue={doctorIdFromAppointment || ""}
                  >
                    <Input
                      value={doctorIdFromAppointment || ""}
                      disabled
                      style={{
                        backgroundColor: "#f5f5f5",
                        color: "#666",
                        cursor: "not-allowed",
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="consultationDate"
                label="Consultation Date"
                rules={[
                  {
                    required: true,
                    message: "Please select consultation date",
                  },
                ]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: "100%" }}
                  placeholder="Select consultation date and time"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="symptoms"
                    label="Symptoms"
                    rules={[
                      { required: true, message: "Please describe symptoms" },
                    ]}
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Describe patient symptoms"
                      maxLength={500}
                      showCount
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="diagnosis"
                    label="Diagnosis"
                    rules={[
                      { required: true, message: "Please enter diagnosis" },
                    ]}
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Enter medical diagnosis"
                      maxLength={500}
                      showCount
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="gender"
                    label="Gender"
                    rules={[
                      {
                        required: true,
                        message: "Please select gender",
                      },
                    ]}
                  >
                    <Radio.Group
                      onChange={(e) => {
                        const gender = e.target.value;
                        setSelectedGender(gender);
                        // Clear pregnancy fields when selecting male
                        if (gender === "MALE") {
                          form.setFieldsValue({
                            pregnancyStatus: undefined,
                            pregnancyWeek: undefined,
                          });
                        }
                      }}
                    >
                      <Radio value="MALE">Male</Radio>
                      <Radio value="FEMALE">Female</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              {selectedGender === "FEMALE" && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="pregnancyStatus"
                      label="Pregnancy Status"
                      rules={[
                        {
                          required: true,
                          message: "Please select pregnancy status",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select pregnancy status"
                        options={[
                          { value: "NotPregnant", label: "Not Pregnant" },
                          { value: "Pregnant", label: "Pregnant" },
                          { value: "Unknown", label: "Unknown" },
                        ]}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="pregnancyWeek"
                      label="Pregnancy Week"
                      tooltip="Enter 0 if not pregnant"
                      rules={[
                        {
                          required: true,
                          message: "Please enter pregnancy week",
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        placeholder="Enter pregnancy week (0 if not pregnant)"
                        min={0}
                        max={42}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              <Form.Item
                name="doctorNotes"
                label="Doctor Notes"
                rules={[
                  { required: true, message: "Please enter doctor notes" },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter detailed doctor notes and observations"
                  maxLength={1000}
                  showCount
                />
              </Form.Item>

              <Form.Item
                name="nextSteps"
                label="Next Steps"
                rules={[
                  { required: true, message: "Please describe next steps" },
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Describe recommended next steps and treatment plan"
                  maxLength={500}
                  showCount
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="underlyingDisease"
                    label="Underlying Disease"
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="List any underlying diseases or conditions"
                      maxLength={500}
                      showCount
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="drugAllergyHistory"
                    label="Drug Allergy History"
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Describe any known drug allergies"
                      maxLength={500}
                      showCount
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Modal>

      {/* Add Test Result Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ExperimentOutlined className="text-blue-600" />
            <span>Add Test Result to Medical Record</span>
          </div>
        }
        open={openAddTestResultModal}
        onCancel={handleAddTestResultModalCancel}
        footer={[
          <Button key="cancel" onClick={handleAddTestResultModalCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={addTestResultLoading}
            onClick={() => addTestResultForm.submit()}
          >
            Add Test Result
          </Button>,
        ]}
        width={500}
        centered
      >
        <div className="add-test-result-form">
          <div className="test-result-info-header">
            <Text type="secondary">
              Adding test result to Medical Record ID:{" "}
              <strong>{selectedMedicalRecordId}</strong>
            </Text>
          </div>

          <Divider />

          <Form
            form={addTestResultForm}
            layout="vertical"
            onFinish={handleAddTestResultSubmit}
            className="test-result-form"
            initialValues={
              {
                testResultId: testResultId, // Default value for test result ID
              }
            }
          >
            <Form.Item
              name="testResultId"
              label="Test Result ID"
              rules={[
                {
                  required: true,
                  message: "Please enter the test result ID",
                },
                {
                  type: "number",
                  min: 1,
                  message: "Test result ID must be a positive number",
                },
              ]}
            >
              <InputNumber
                placeholder="Enter test result ID"
                style={{ width: "100%" }}
                min={1}
              />
            </Form.Item>

            <div className="form-note">
              <Text type="secondary" italic>
                Please ensure the test result ID exists and is not already
                associated with another medical record.
              </Text>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default PatientMedicalRecord;
