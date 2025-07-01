import {
  Modal,
  Descriptions,
  Typography,
  Badge,
  Card,
  Space,
  Divider,
  Col,
  Row,
  Button,
  Alert,
} from "antd";
import {
  FileTextOutlined,
  CalendarOutlined,
  ExperimentOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "./ModalResult.scss";
import { useNavigate } from "react-router-dom";


const { Text, Title } = Typography;

const ResultModal = ({ isOpen, onClose, resultData }) => {
  const navigation = useNavigate();
  if (!resultData) return null;
  
  const {
    testResultId,
    testDate,
    testType,
    labName,
    doctorComments,
    testResults,
    cD4Count,
    hivViralLoadValue,
    // patient,
  } = resultData;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
      className="result-modal"
      title={
        <div className="modal-header">
          <Space align="center">
            <div className="header-icon">
              <ExperimentOutlined />
            </div>
            <div >
              <Title level={3} className="modal-title">
                HIV Test Result Details
              </Title>
              <Text className="modal-subtitle">
                Complete diagnostic information
              </Text>
            </div>
          </Space>
        </div>
      }
    >
      <div className="modal-content">
        {/* Post-test Counseling Warning */}
        {resultData.testType === "RapidTest" && resultData.testResults === "Positive" || resultData && (
          <Alert
            message="Important: Post-test Counseling Required"
            description={
              <div className="counseling-alert">
                <Text>
                  Due to the positive rapid test result, immediate post-test counseling is mandatory. 
                  Please schedule a counseling session to discuss the results, next steps, and support options.
                </Text>
                <Button  
                onClick={() => {navigation("/schedule-consultation")}}
                  type="primary" 
                  danger 
                  icon={<WarningOutlined />}
                  className="counseling-button"
                  size="large"
                >
                  <strong>Schedule Post-test Counseling</strong>
                </Button>
              </div>
            }
            type="warning"
            showIcon
            className="counseling-warning"
          />
        )}
        <Row gutter={30}>
          <Col span={15}>
            {/* Test Information Card */}
            <Card className="info-card" size="small">
              <div className="card-header">
                <FileTextOutlined className="card-icon" />
                <Title level={5}>Test Information</Title>
              </div>
              <Descriptions
                column={2}
                size="small"
                className="test-descriptions"
              >
                <Descriptions.Item label="Test ID" className="desc-item">
                  <Text strong className="test-id">
                    #{testResultId}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item label="Test Type" className="desc-item">
                  <Badge
                    color="blue"
                    text={testType || "N/A"}
                    className="type-badge"
                  />
                </Descriptions.Item>

                <Descriptions.Item label="Test Date" className="desc-item">
                  <Space>
                    <CalendarOutlined className="date-icon" />
                    <Text>
                      {testDate ? dayjs(testDate).format("DD/MM/YYYY") : "N/A"}
                    </Text>
                  </Space>
                </Descriptions.Item>

                <Descriptions.Item label="Laboratory" className="desc-item">
                  <Text>{labName || "N/A"}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={9}>
            {/* Test Results Card */}
            <Card className="results-card" size="small">
              <div className="card-header">
                <MedicineBoxOutlined className="card-icon" />
                <Title level={5}>Test Results</Title>
              </div>

              <div className="result-status">
                <div className="status-container">
                  <Text className="status-label">HIV Status:</Text>
                  <Badge
                    status={testResults === "Positive" ? "error" : "success"}
                    text={
                      <Text
                        strong
                        className={`status-text ${
                          testResults === "Positive" ? "positive" : "negative"
                        }`}
                      >
                        {testResults}
                      </Text>
                    }
                  />
                </div>
              </div>

              <Divider className="results-divider" />

              <div className="clinical-values">
                <div className="value-item">
                  <Text className="value-label">CD4 Count:</Text>
                  <Text strong className="value-text">
                    {cD4Count ? `${cD4Count} cells/mm³` : "Not Applicable"}
                  </Text>
                </div>

                <div className="value-item">
                  <Text className="value-label">Viral Load:</Text>
                  <Text strong className="value-text">
                    {hivViralLoadValue
                      ? `${hivViralLoadValue} copies/mL`
                      : "Not Applicable"}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Doctor's Assessment Card */}
        <Card className="assessment-card" size="small">
         

          <Divider className="assessment-divider" />

          {/* <div className="patient-info">
            <Text className="patient-label">Patient Code:</Text>
            <Text strong className="patient-code">
              {patient?.patientCodeAtFacility || "N/A"}
            </Text>
          </div> */}

          {/* Doctor Information Card */}
<Card className="doctor-card" size="small">
  <div className="card-header">
    <UserOutlined className="card-icon" />
    <Title level={5}>Tested by Doctor</Title>
  </div>
  <Descriptions column={2} size="small">
    <Descriptions.Item label="Full Name">
      {resultData.doctorFullName || "N/A"}
    </Descriptions.Item>
    <Descriptions.Item label="Username">
      {resultData.doctorUsername || "N/A"}
    </Descriptions.Item>
    <Descriptions.Item label="Email">
      {resultData.doctorEmail || "N/A"}
    </Descriptions.Item>
    <Descriptions.Item label="Phone">
      {resultData.doctorPhoneNumber || "N/A"}
    </Descriptions.Item>
    <Descriptions.Item label="Specialty">
      {resultData.doctorSpecialty || "N/A"}
    </Descriptions.Item>
    <Descriptions.Item label="Qualifications">
      {resultData.doctorQualifications || "N/A"}
    </Descriptions.Item>
    <Descriptions.Item label="Years of Experience">
      {resultData.doctorYearsOfExperience
        ? `${resultData.doctorYearsOfExperience} years`
        : "N/A"}
    </Descriptions.Item>
    <Descriptions.Item label="Account Status">
      <Badge
        status={
          resultData.doctorAccountStatus === "Active" ? "success" : "error"
        }
        text={resultData.doctorAccountStatus}
      />
    </Descriptions.Item>
  </Descriptions>

  {resultData.doctorShortDescription && (
    <>
      <Divider />
      <Text strong>Description:</Text>
      <Text block>{resultData.doctorShortDescription}</Text>
    </>
  )}
</Card>
 <div className="card-header">
            <UserOutlined className="card-icon" />
            <Title level={5}>Medical Assessment</Title>
          </div>

          <div className="comments-section">
            <Text className="comments-label">Doctor's Comments:</Text>
            <div className="comments-content">
              <Text className="comments-text">
                {doctorComments || "No additional comments provided."}
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </Modal>
  );
};

export default ResultModal;
