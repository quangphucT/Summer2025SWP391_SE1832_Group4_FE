import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, Row, Col, Typography, Divider, Tag, Spin, Table, Tooltip, Button } from "antd";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { getPatientRecordsByPatientId } from "../../../apis/patientApi/patentrecordApi";
import { getPatientByAccountId } from "../../../apis/patientApi/updateProfileApi";
import { UserOutlined, CalendarOutlined, FileTextOutlined, MedicineBoxOutlined, ExperimentOutlined, InfoCircleOutlined, FileDoneOutlined, SolutionOutlined, AlertOutlined, ExclamationCircleOutlined, EyeOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const MedicalRecordMenuPage = () => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const user = useSelector((state) => state.user);
  const [patientId, setPatientId] = useState(user?.patientId || user?.account?.patientId || "");
  const cardGradient = "linear-gradient(135deg, #e0e7ff 60%, #f1f5ff 100%)";

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
    getPatientRecordsByPatientId(patientId)
      .then((records) => {
        if (Array.isArray(records) && records.length > 0) {
          setRecords(records);
        } else {
          setRecords([]);
        }
      })
      .catch(error => {
        toast.error(error?.response?.data?.message || "Error loading medical records");
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  return (
    <div style={{ background: "linear-gradient(135deg, #e0e7ff 60%, #f1f5ff 100%)", minHeight: "100vh", padding: 24 }}>
      {loading ? (
        <Spin size="large" style={{ display: "flex", justifyContent: "center", marginTop: 100 }} />
      ) : selectedRecord ? (
        <Card
          style={{
            maxWidth: 900,
            margin: "32px auto",
            borderRadius: 32,
            boxShadow: "0 8px 32px rgba(30,58,138,0.10)",
            background: "#fff",
            border: "none"
          }}
          bodyStyle={{ padding: 40 }}
        >
          <Button
            icon={<ArrowLeftOutlined />}
            type="link"
            style={{ marginBottom: 16, fontWeight: 600, color: "#1e3a8a", fontSize: 16 }}
            onClick={() => setSelectedRecord(null)}
          >
            Back to list
          </Button>
          <Row align="middle" justify="center" style={{ marginBottom: 24 }}>
            <Col>
              <FileTextOutlined style={{ fontSize: 38, color: "#1e3a8a", marginRight: 16 }} />
            </Col>
            <Col>
              <Title level={2} style={{ color: "#1e3a8a", margin: 0, letterSpacing: 1 }}>Medical Record Detail</Title>
            </Col>
          </Row>
          <Divider />
          <Row gutter={[32, 24]}>
            <Col xs={24} md={12}>
              <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center' }}>
                <UserOutlined style={{ color: "#1e3a8a", marginRight: 10, fontSize: 20 }} />
                <Text strong style={{ color: "#1e3a8a", fontSize: 17, letterSpacing: 0.5 }}>Doctor:</Text>
              </div>
              <Text style={{ fontSize: 16 }}>{selectedRecord?.doctor?.account?.fullName}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 15 }}>{selectedRecord?.doctor?.specialty}</Text>
              <div style={{ margin: '18px 0 12px 0', display: 'flex', alignItems: 'center' }}>
                <MedicineBoxOutlined style={{ color: "#1e3a8a", marginRight: 10, fontSize: 20 }} />
                <Text strong style={{ color: "#1e3a8a", fontSize: 17, letterSpacing: 0.5 }}>Symptoms:</Text>
              </div>
              <Text style={{ fontSize: 16 }}>{selectedRecord.symptoms}</Text>
              <div style={{ margin: '18px 0 12px 0', display: 'flex', alignItems: 'center' }}>
                <InfoCircleOutlined style={{ color: "#1e3a8a", marginRight: 10, fontSize: 20 }} />
                <Text strong style={{ color: "#1e3a8a", fontSize: 17, letterSpacing: 0.5 }}>Diagnosis:</Text>
              </div>
              <Text style={{ fontSize: 16 }}>{selectedRecord.diagnosis}</Text>
              <div style={{ margin: '18px 0 12px 0', display: 'flex', alignItems: 'center' }}>
                <FileDoneOutlined style={{ color: "#1e3a8a", marginRight: 10, fontSize: 20 }} />
                <Text strong style={{ color: "#1e3a8a", fontSize: 17, letterSpacing: 0.5 }}>Pregnancy Status:</Text>
              </div>
              <Tag color={selectedRecord.pregnancyStatus === "Pregnant" ? "magenta" : "blue"} style={{ fontSize: 15, padding: '2px 14px', borderRadius: 8 }}>
                {selectedRecord.pregnancyStatus}
              </Tag>
              {selectedRecord.pregnancyStatus === "Pregnant" && (
                <span style={{ marginLeft: 8 }}>
                  <Text strong style={{ color: "#1e3a8a" }}>Week:</Text> <Text style={{ fontSize: 16 }}>{selectedRecord.pregnancyWeek}</Text>
                </span>
              )}
            </Col>
            <Col xs={24} md={12}>
              <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center' }}>
                <CalendarOutlined style={{ color: "#1e3a8a", marginRight: 10, fontSize: 20 }} />
                <Text strong style={{ color: "#1e3a8a", fontSize: 17, letterSpacing: 0.5 }}>Consultation Date:</Text>
              </div>
              <Text style={{ fontSize: 16 }}>{dayjs(selectedRecord.consultationDate).format("DD/MM/YYYY HH:mm")}</Text>
              <div style={{ margin: '18px 0 12px 0', display: 'flex', alignItems: 'center' }}>
                <SolutionOutlined style={{ color: "#1e3a8a", marginRight: 10, fontSize: 20 }} />
                <Text strong style={{ color: "#1e3a8a", fontSize: 17, letterSpacing: 0.5 }}>Doctor Notes:</Text>
              </div>
              <Text style={{ fontSize: 16 }}>{selectedRecord.doctorNotes}</Text>
              <div style={{ margin: '18px 0 12px 0', display: 'flex', alignItems: 'center' }}>
                <AlertOutlined style={{ color: "#1e3a8a", marginRight: 10, fontSize: 20 }} />
                <Text strong style={{ color: "#1e3a8a", fontSize: 17, letterSpacing: 0.5 }}>Next Steps:</Text>
              </div>
              <Text style={{ fontSize: 16 }}>{selectedRecord.nextSteps}</Text>
              <div style={{ margin: '18px 0 12px 0', display: 'flex', alignItems: 'center' }}>
                <ExclamationCircleOutlined style={{ color: "#1e3a8a", marginRight: 10, fontSize: 20 }} />
                <Text strong style={{ color: "#1e3a8a", fontSize: 17, letterSpacing: 0.5 }}>Underlying Disease:</Text>
              </div>
              <Text style={{ fontSize: 16 }}>{selectedRecord.underlyingDisease}</Text>
              <div style={{ margin: '18px 0 12px 0', display: 'flex', alignItems: 'center' }}>
                <MedicineBoxOutlined style={{ color: "#1e3a8a", marginRight: 10, fontSize: 20 }} />
                <Text strong style={{ color: "#1e3a8a", fontSize: 17, letterSpacing: 0.5 }}>Drug Allergy History:</Text>
              </div>
              <Text style={{ fontSize: 16 }}>{selectedRecord.drugAllergyHistory}</Text>
            </Col>
          </Row>

          {/* Related Treatments Section */}
          {selectedRecord?.patientTreatments && selectedRecord.patientTreatments.length > 0 && (
            <>
              <Divider />
              <Row align="middle" style={{ marginBottom: 12 }}>
                <Col>
                  <MedicineBoxOutlined style={{ fontSize: 28, color: "#1e3a8a", marginRight: 8 }} />
                </Col>
                <Col>
                  <Title level={4} style={{ color: "#1e3a8a", margin: 0 }}>Related Treatments</Title>
                </Col>
              </Row>
              <div className="treatments-section">
                {selectedRecord.patientTreatments.map((treatment, idx) => (
                  <Card
                    key={treatment.treatmentId || idx}
                    size="small"
                    className="treatment-mini-card"
                    style={{ marginBottom: 12, borderRadius: 12 }}
                  >
                    <Table
                      columns={[
                        { title: 'Regimen', dataIndex: 'regimen', key: 'regimen', render: () => treatment.regimen?.regimenName || 'N/A' },
                        { title: 'Start Date', dataIndex: 'startDate', key: 'startDate', render: () => treatment.startDate ? dayjs(treatment.startDate).format("DD/MM/YYYY") : 'N/A' },
                        { title: 'Expected End Date', dataIndex: 'expectedEndDate', key: 'expectedEndDate', render: () => treatment.expectedEndDate ? dayjs(treatment.expectedEndDate).format("DD/MM/YYYY") : 'N/A' },
                        { title: 'Actual Dosage', dataIndex: 'actualDosage', key: 'actualDosage', render: () => treatment.actualDosage || 'N/A' },
                        { title: 'Status', dataIndex: 'status', key: 'status', render: () => treatment.status || 'N/A' },
                        { title: 'Reason For Change Or Stop', dataIndex: 'reasonForChangeOrStop', key: 'reasonForChangeOrStop', render: () => treatment.reasonForChangeOrStop || 'N/A' },
                        { title: 'Regimen Adjustments', dataIndex: 'regimenAdjustments', key: 'regimenAdjustments', render: () => treatment.regimenAdjustments || 'N/A' },
                      ]}
                      dataSource={[treatment]}
                      pagination={false}
                      bordered
                      size="small"
                      style={{ marginBottom: 0, background: '#f8fafc', borderRadius: 8, boxShadow: '0 2px 12px rgba(30,58,138,0.07)' }}
                      className="styled-table"
                    />
                    {treatment.patientTestResults && treatment.patientTestResults.length > 0 && (() => {
                      // Lấy test mới nhất cho từng loại cần thiết
                      const types = ['RapidTest', 'PCR or ELISA'];
                      const latestByType = types.map(type => {
                        const filtered = treatment.patientTestResults.filter(tr => tr.testType === type);
                        if (filtered.length === 0) return null;
                        return filtered.sort((a, b) => new Date(b.testDate) - new Date(a.testDate))[0];
                      }).filter(Boolean);
                      if (latestByType.length === 0) return null;
                      return (
                        <div style={{ marginTop: 16 }}>
                          <div style={{ fontWeight: 600, color: '#1e3a8a', marginBottom: 4 }}>
                            Latest Test Results for this Treatment
                          </div>
                          <Table
                            columns={[
                              { title: 'Test Date', dataIndex: 'testDate', key: 'testDate', render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm") },
                              { title: 'Test Type', dataIndex: 'testType', key: 'testType' },
                              { title: 'Result', dataIndex: 'testResults', key: 'testResults', render: (text) => (
                                <span style={{
                                  fontWeight: 700,
                                  color: text === 'Positive' ? '#d7263d' : text === 'Negative' ? '#1e8e3e' : '#1e3a8a',
                                  background: text === 'Positive' ? '#ffe5ea' : text === 'Negative' ? '#e6f9ed' : '#f1f5ff',
                                  borderRadius: 8,
                                  padding: '2px 12px',
                                  display: 'inline-block',
                                  letterSpacing: 1
                                }}>{text}</span>
                              ) },
                              { title: 'CD4 Count', dataIndex: 'cD4Count', key: 'cD4Count' },
                              { title: 'HIV Viral Load', dataIndex: 'hivViralLoadValue', key: 'hivViralLoadValue' },
                              { title: 'Lab Name', dataIndex: 'labName', key: 'labName' },
                              { title: 'Doctor Name', dataIndex: 'doctorFullName', key: 'doctorFullName' },
                            ]}
                            dataSource={latestByType}
                            pagination={false}
                            bordered
                            size="small"
                            style={{ marginBottom: 0, background: '#f8fafc', borderRadius: 8, boxShadow: '0 2px 12px rgba(30,58,138,0.07)' }}
                            className="styled-table"
                          />
                        </div>
                      );
                    })()}
                  </Card>
                ))}
              </div>
            </>
          )}
        </Card>
      ) : (
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Title level={2} style={{ color: "#1e3a8a", textAlign: "center", margin: "32px 0 24px 0" }}>Medical Record List</Title>
          {records.length === 0 ? (
            <div style={{ background: "#fff", padding: 32, borderRadius: 24, maxWidth: 600, margin: "64px auto", textAlign: "center", boxShadow: "0 4px 24px rgba(30,58,138,0.08)" }}>
              <Title level={4} style={{ color: "#1e3a8a" }}>No medical record found.</Title>
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {records.map((rec) => (
                <Col xs={24} sm={12} md={8} key={rec.medicalRecordId}>
                  <div
                    style={{
                      borderRadius: 28,
                      boxShadow: "0 6px 32px rgba(30,58,138,0.13)",
                      background: cardGradient,
                      minHeight: 240,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.18s, box-shadow 0.18s',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                    className="modern-medical-card"
                    onClick={() => setSelectedRecord(rec)}
                  >
                    <div style={{ padding: 28, paddingBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                        <FileTextOutlined style={{ color: '#1e3a8a', fontSize: 28, marginRight: 10 }} />
                        <span style={{ color: '#64748b', fontWeight: 500, fontSize: 16 }}>ID:</span>
                        <span style={{ color: '#1e3a8a', fontWeight: 700, fontSize: 18, marginLeft: 6 }}>#{rec.medicalRecordId}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <CalendarOutlined style={{ color: "#1e3a8a", fontSize: 22, marginRight: 8 }} />
                        <span style={{ color: '#1e3a8a', fontWeight: 600, fontSize: 16 }}>{dayjs(rec.consultationDate).format("DD/MM/YYYY HH:mm")}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <UserOutlined style={{ color: "#1e3a8a", fontSize: 22, marginRight: 8 }} />
                        <span style={{ color: '#1e3a8a', fontWeight: 600, fontSize: 16 }}>{rec?.doctor?.account?.fullName}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <InfoCircleOutlined style={{ color: "#1e3a8a", fontSize: 22, marginRight: 8 }} />
                        <span style={{ color: '#334155', fontSize: 15 }}>{rec.diagnosis}</span>
                      </div>
                    </div>
                    <div style={{ padding: '0 28px 22px 28px', display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        icon={<EyeOutlined />}
                        type="primary"
                        style={{
                          background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)',
                          border: 'none',
                          borderRadius: 10,
                          fontWeight: 600,
                          fontSize: 15,
                          boxShadow: '0 2px 8px rgba(30,58,138,0.10)',
                          padding: '0 18px',
                          height: 38
                        }}
                        onClick={e => { e.stopPropagation(); setSelectedRecord(rec); }}
                      >
                        View Detail
                      </Button>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
          <style>{`
            .modern-medical-card:hover {
              transform: translateY(-6px) scale(1.025);
              box-shadow: 0 12px 36px rgba(30,58,138,0.18);
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordMenuPage;
