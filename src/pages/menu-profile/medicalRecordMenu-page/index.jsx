import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  Empty,
  Typography,
  Space,
  Divider,
  Row,
  Col,
  Descriptions,
  Tag,
  Spin,
} from "antd";
import {
  UserOutlined,
  HistoryOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  MedicineBoxFilled,
  PlusOutlined,
  ExperimentOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  FileDoneOutlined,
  SolutionOutlined,
  AlertOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { getPatientRecordsByPatientId } from "../../../apis/patientApi/patentrecordApi";
import { getPatientByAccountId } from "../../../apis/patientApi/updateProfileApi";
import api from "../../../config/api";
import { getTestResultByPatientId } from '../../../apis/Results/getTestResultByPatientIdAPI';

const { Title, Text } = Typography;

// Thêm prop setSelectedKey vào component MedicalRecordMenuPage
const MedicalRecordMenuPage = ({ setSelectedKey }) => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const user = useSelector((state) => state.user);
  const [patientId, setPatientId] = useState(user?.patientId || user?.account?.patientId || "");
  const [expandedRecordId, setExpandedRecordId] = useState(null);
  const [allTestResults, setAllTestResults] = useState([]);

  // Helper function to display value or N/A
  const displayValue = (value) => {
    if (value === null || value === undefined || value === "") return "N/A";
    return value;
  };

  useEffect(() => {
    if (!patientId && user?.accountID) {
      getPatientByAccountId(user.accountID)
        .then(res => {
          const fetchedPatientId = res?.data?.data?.patientId;
          if (fetchedPatientId) setPatientId(fetchedPatientId);
        })
        .catch(error => {
          toast.error(error?.response?.data?.message || "Không thể lấy patientId từ accountId");
        });
    }
  }, [user, patientId]);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    Promise.all([
      getPatientRecordsByPatientId(patientId),
      getTestResultByPatientId(patientId)
    ])
      .then(async ([records, testResultRes]) => {
        setAllTestResults(testResultRes?.data?.data || []);
        if (Array.isArray(records) && records.length > 0) {
          // Fetch regimen details for each treatment
          for (let rec of records) {
            if (rec.patientTreatments && rec.patientTreatments.length > 0) {
              const details = await Promise.all(
                rec.patientTreatments.map(async (t) => {
                  console.log("regimenId for treatment:", t.regimenId);
                  let regimen = null;
                  if (t.regimenId) {
                    try {
                      console.log("Calling API for regimenId:", t.regimenId);
                      const res = await api.get(`/api/standard-arv-regimens/${t.regimenId}`);
                      regimen = res.data?.data || null;
                    } catch {
                      regimen = null;
                    }
                  }
                  return { ...t, regimen };
                })
              );
              rec.patientTreatments = details;
            }
          }
          setRecords(records);
        } else {
          setRecords([]);
        }
      })
      .catch(error => {
        toast.error(error?.response?.data?.message || "Error loading medical records");
        setRecords([]);
        setAllTestResults([]);
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  return (
    <div className="patient-medical-record" style={{ background: "linear-gradient(135deg, #e0e7ff 60%, #f1f5ff 100%)", minHeight: "100vh", padding: 24, width: "100%" }}>
      {loading ? (
        <Spin size="large" style={{ display: "flex", justifyContent: "center", marginTop: 100 }} />
      ) : (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 0, background: '#fff' }}>
          <Card className="search-card" style={{ borderRadius: 24, boxShadow: "0 4px 24px rgba(30,58,138,0.08)" }}>
            <div className="search-header">
              <Title level={3} className="search-title" style={{ color: "#1e3a8a" }}>
                <HistoryOutlined className="title-icon" style={{ color: "#1e3a8a" }} />
                Patient Medical Records
              </Title>
              <Text type="secondary">
                View your medical history and test results
              </Text>
            </div>
            <Divider />
            {records.length === 0 ? (
              <div className="empty-results">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div className="empty-description">
                      <Text>
                        No medical records found for your account.
                      </Text>
                    </div>
                  }
                />
              </div>
            ) : (
              <div className="medical-records-list">
                <Title level={4} style={{ color: "#1e3a8a" }}>Medical Records Found</Title>
                <div className="medical-records-scroll-container" style={{ maxHeight: 600, overflowY: 'auto', paddingRight: 12 }}>
                  {records.map((record, index) => {
                    const isExpanded = expandedRecordId === record.medicalRecordId;
                    return (
                      <div key={record.medicalRecordId || index}>
                        {/* Card tóm tắt */}
                        <Card
                          className="medical-record-card"
                          size="small"
                          style={{
                            marginBottom: 16,
                            borderRadius: 16,
                            cursor: 'pointer',
                            maxWidth: 900,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            border: isExpanded ? '2px solid #1e3a8a' : undefined,
                            position: isExpanded ? 'sticky' : undefined,
                            top: isExpanded ? 0 : undefined,
                            zIndex: isExpanded ? 3 : undefined,
                            background: isExpanded ? '#fff' : undefined,
                          }}
                          onClick={() => setExpandedRecordId(isExpanded ? null : record.medicalRecordId)}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 24px 12px 20px',
                              background: 'transparent',
                              borderRadius: 16,
                              minHeight: 64,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <MedicineBoxFilled style={{ color: "#1e3a8a", fontSize: 26, marginRight: 8 }} />
                              <span style={{ color: "#1e3a8a", fontWeight: 700, fontSize: 22, letterSpacing: 0.5 }}>
                                Medical Record #{record.medicalRecordId}
                              </span>
                              <span style={{ color: "#1e3a8a", fontSize: 16, marginLeft: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <CalendarOutlined style={{ fontSize: 18 }} />
                                {new Date(record.consultationDate).toLocaleDateString("vi-VN", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <div style={{ position: 'relative', zIndex: 10 }}>
                              <Button
                                type="primary"
                                style={{
                                  background: '#1e3a8a',
                                  borderColor: '#1e3a8a',
                                  fontWeight: 600,
                                  borderRadius: 10,
                                  padding: '6px 28px',
                                  fontSize: 17,
                                  boxShadow: '0 2px 8px rgba(30,58,138,0.10)',
                                  zIndex: 10,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('Schedule button clicked on card summary');
                                  if (setSelectedKey) {
                                    console.log('setSelectedKey function exists, calling it');
                                    setSelectedKey('medical-record-schedule');
                                  } else {
                                    console.log('setSelectedKey function not found');
                                    // Fallback: try to navigate directly
                                    window.location.href = '/profile?selectedKey=medical-record-schedule';
                                  }
                                }}
                              >
                                Schedule
                              </Button>
                            </div>
                          </div>
                        </Card>
                        {/* Nếu card này được xổ, render detail đúng như bạn gửi */}
                        {isExpanded && (
                          <Card
                            style={{ margin: '16px 0 32px 0', borderRadius: 24, boxShadow: "0 4px 24px rgba(30,58,138,0.08)", border: '1px solid #e0e7ff', position: 'relative' }}
                            bodyStyle={{ padding: 32 }}
                          >
                            {/* --- PHẦN DETAIL ĐÚNG NHƯ ĐOẠN BẠN GỬI --- */}
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
                                    {displayValue(record.patient?.patientCodeAtFacility)}
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
                                    {record.pregnancyWeek !== null && record.pregnancyWeek !== undefined
                                      ? `${record.pregnancyWeek} weeks`
                                      : "N/A"}
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Gender">
                                    {displayValue(record.patient?.gender) !== "N/A"
                                      ? displayValue(record.patient?.gender)
                                      : displayValue(record.gender)}
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Date of birth">
                                    {record.patient?.dateOfBirth && record.patient?.dateOfBirth !== "N/A"
                                      ? dayjs(record.patient.dateOfBirth).format("DD/MM/YYYY")
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
                            {(record.underlyingDisease || record.drugAllergyHistory) && (
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
                                        <Text>{displayValue(record.underlyingDisease)}</Text>
                                      </div>
                                    </Col>
                                  )}
                                  {record.drugAllergyHistory && (
                                    <Col span={12}>
                                      <div className="additional-info">
                                        <Text strong>Drug Allergy History:</Text>
                                        <br />
                                        <Text>{displayValue(record.drugAllergyHistory)}</Text>
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
                            {/* Hiển thị thông tin treatment */}
                            {record.patientTreatments && record.patientTreatments.length > 0 && (
                              <>
                                <Divider orientation="left">Related Treatments</Divider>
                                <div className="treatments-section">
                                  {record.patientTreatments.map((treatment, idx) => (
                                    <Card
                                      key={treatment.patientTreatmentId || treatment.treatmentId || idx}
                                      size="small"
                                      className="treatment-mini-card"
                                      style={{ marginBottom: 12 }}
                                    >
                                      <Descriptions column={1} size="small" bordered>
                                        <Descriptions.Item label="Regimen Name">
                                          {treatment.regimen && treatment.regimen.regimenName
                                            ? treatment.regimen.regimenName
                                            : <span style={{color: 'red'}}>No regimen info</span>}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Start Date">{treatment.startDate ? dayjs(treatment.startDate).format("DD/MM/YYYY") : "N/A"}</Descriptions.Item>
                                        <Descriptions.Item label="Expected End Date">{treatment.expectedEndDate ? dayjs(treatment.expectedEndDate).format("DD/MM/YYYY") : "N/A"}</Descriptions.Item>
                                        <Descriptions.Item label="Actual Dosage">{treatment.actualDosage}</Descriptions.Item>
                                        <Descriptions.Item label="Status">{treatment.status}</Descriptions.Item>
                                        <Descriptions.Item label="Reason For Change Or Stop">{treatment.reasonForChangeOrStop}</Descriptions.Item>
                                        <Descriptions.Item label="Regimen Adjustments">{treatment.regimenAdjustments}</Descriptions.Item>
                                      </Descriptions>
                                    </Card>
                                  ))}
                                </div>
                              </>
                            )}
                            {/* Test Results lấy từ allTestResults */}
                            {(() => {
                              const rapidTests = allTestResults.filter(test => test.testType?.toUpperCase() === "RAPIDTEST" && test.medicalRecordId === record.medicalRecordId);
                              const pcrTests = allTestResults.filter(test => test.testType?.toUpperCase() === "PCR" && test.medicalRecordId === record.medicalRecordId);
                              const latestRapid = rapidTests.sort((a, b) => new Date(b.testDate) - new Date(a.testDate))[0];
                              const latestPCR = pcrTests.sort((a, b) => new Date(b.testDate) - new Date(a.testDate))[0];
                              if (!latestRapid && !latestPCR) return null;
                              return (
                                <>
                                  <Divider orientation="left">Related Test Results</Divider>
                                  <div className="test-results-section">
                                    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                                      {latestRapid && (
                                        <Col xs={24} md={12}>
                                          <Card size="small" className="test-result-mini-card">
                                            <Row gutter={8}>
                                              <Col span={6}>
                                                <Text strong>Test Type:</Text>
                                                <br />
                                                <Tag color="blue">{latestRapid.testType}</Tag>
                                              </Col>
                                              <Col span={6}>
                                                <Text strong>Result:</Text>
                                                <br />
                                                <Tag color={latestRapid.testResults === "Positive" ? "red" : "green"}>{latestRapid.testResults}</Tag>
                                              </Col>
                                              <Col span={6}>
                                                <Text strong>Lab:</Text>
                                                <br />
                                                <Text>{latestRapid.labName}</Text>
                                              </Col>
                                              <Col span={6}>
                                                <Text strong>Test Date:</Text>
                                                <br />
                                                <Text>{latestRapid.testDate ? dayjs(latestRapid.testDate).format("DD/MM/YYYY") : "N/A"}</Text>
                                              </Col>
                                            </Row>
                                            {(latestRapid.cD4Count !== null || latestRapid.hivViralLoadValue !== null) && (
                                              <Row gutter={8} style={{ marginTop: 12 }}>
                                                {latestRapid.cD4Count !== null && (
                                                  <Col span={12}>
                                                    <Text strong>CD4 Count:</Text>
                                                    <br />
                                                    <Tag color="purple">{latestRapid.cD4Count} cells/μL</Tag>
                                                  </Col>
                                                )}
                                                {latestRapid.hivViralLoadValue !== null && (
                                                  <Col span={12}>
                                                    <Text strong>HIV Viral Load:</Text>
                                                    <br />
                                                    <Tag color="orange">{latestRapid.hivViralLoadValue} copies/mL</Tag>
                                                  </Col>
                                                )}
                                              </Row>
                                            )}
                                            {latestRapid.doctorComments && (
                                              <div className="test-comments" style={{ marginTop: 12 }}>
                                                <Text type="secondary" italic>
                                                  Doctor Comment: "{latestRapid.doctorComments}"
                                                </Text>
                                              </div>
                                            )}
                                          </Card>
                                        </Col>
                                      )}
                                      {latestPCR && (
                                        <Col xs={24} md={12}>
                                          <Card size="small" className="test-result-mini-card">
                                            <Row gutter={8}>
                                              <Col span={6}>
                                                <Text strong>Test Type:</Text>
                                                <br />
                                                <Tag color="blue">{latestPCR.testType}</Tag>
                                              </Col>
                                              <Col span={6}>
                                                <Text strong>Result:</Text>
                                                <br />
                                                <Tag color={latestPCR.testResults === "Positive" ? "red" : "green"}>{latestPCR.testResults}</Tag>
                                              </Col>
                                              <Col span={6}>
                                                <Text strong>Lab:</Text>
                                                <br />
                                                <Text>{latestPCR.labName}</Text>
                                              </Col>
                                              <Col span={6}>
                                                <Text strong>Test Date:</Text>
                                                <br />
                                                <Text>{latestPCR.testDate ? dayjs(latestPCR.testDate).format("DD/MM/YYYY") : "N/A"}</Text>
                                              </Col>
                                            </Row>
                                            {(latestPCR.cD4Count !== null || latestPCR.hivViralLoadValue !== null) && (
                                              <Row gutter={8} style={{ marginTop: 12 }}>
                                                {latestPCR.cD4Count !== null && (
                                                  <Col span={12}>
                                                    <Text strong>CD4 Count:</Text>
                                                    <br />
                                                    <Tag color="purple">{latestPCR.cD4Count} cells/μL</Tag>
                                                  </Col>
                                                )}
                                                {latestPCR.hivViralLoadValue !== null && (
                                                  <Col span={12}>
                                                    <Text strong>HIV Viral Load:</Text>
                                                    <br />
                                                    <Tag color="orange">{latestPCR.hivViralLoadValue} copies/mL</Tag>
                                                  </Col>
                                                )}
                                              </Row>
                                            )}
                                            {latestPCR.doctorComments && (
                                              <div className="test-comments" style={{ marginTop: 12 }}>
                                                <Text type="secondary" italic>
                                                  Doctor Comment: "{latestPCR.doctorComments}"
                                                </Text>
                                              </div>
                                            )}
                                          </Card>
                                        </Col>
                                      )}
                                    </Row>
                                  </div>
                                </>
                              );
                            })()}
                            <Divider />
                          </Card>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordMenuPage;
