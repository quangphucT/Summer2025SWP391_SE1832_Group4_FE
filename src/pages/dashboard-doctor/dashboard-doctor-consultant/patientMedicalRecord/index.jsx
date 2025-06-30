import { Button, Input, Card, Empty, Typography, Space, Divider, Modal, Form, DatePicker, Select, Row, Col, Descriptions, Tag } from 'antd';
import { SearchOutlined, FileAddOutlined, UserOutlined, HistoryOutlined, MedicineBoxOutlined, CalendarOutlined, MedicineBoxFilled } from '@ant-design/icons';
import './index.scss'
import { useState } from 'react';
import dayjs from 'dayjs';
import { createMedicalRecord } from '../../../../apis/medicalRecord/createMedicalRecordApi';
import { toast } from 'react-toastify';
import { getMedicalRecordByPatientId } from '../../../../apis/medicalRecord/getMedicalRecordByPatientIdApi';
const { Title, Text } = Typography;

const PatientMedicalRecord = () => {
  const [dataMedicalRecord, setDataMedicalRecord] = useState([]);
  const [searchPatientId, setSearchPatientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  
  const [form] = Form.useForm();

  const searchMedicalRecordByPatientId = async () => {
    if (!searchPatientId.trim()) {
      return;
    }
   
    setLoading(true);
    setHasSearched(true);
    try {
      // Try to get medical record first
      const medicalRecordResponse = await getMedicalRecordByPatientId(searchPatientId.trim());
      if (medicalRecordResponse.data.data) {
        setDataMedicalRecord([medicalRecordResponse.data.data]); // Put in array for consistent handling
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
    // Set default consultation date to today
    form.setFieldsValue({
      consultationDate: dayjs(),
      pregnancyStatus: 'NotPregnant'
    });
  };
  // get Medical Record by Patient ID
  
  const handleFormSubmit = async (values) => {
    setCreateLoading(true);
    try {
      // Format the data for API submission
      const formattedData = {
        ...values,
        consultationDate: values.consultationDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        testResultId: parseInt(values.testResultId) || 0,
        doctorId: parseInt(values.doctorId) || 0,
        pregnancyWeek: parseInt(values.pregnancyWeek) || 0
      };
      
      console.log("Medical record data to submit:", formattedData);
      await createMedicalRecord(searchPatientId, formattedData);
      form.resetFields();
      setOpenCreateModal(false);
      toast.success("Medical record created successfully!");
      if (searchPatientId) {
        searchMedicalRecordByPatientId();
      }
    } catch (error) {
      console.error("Error creating medical record:", error);
    }
    setCreateLoading(false);
  };

  const handleModalCancel = () => {
    setOpenCreateModal(false);
    form.resetFields();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchMedicalRecordByPatientId();
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
              placeholder="Enter Patient ID to search medical records"
              prefix={<UserOutlined />}
              value={searchPatientId}
              onChange={(e) => setSearchPatientId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              loading={loading}
              onClick={searchMedicalRecordByPatientId}
              disabled={!searchPatientId.trim()}
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
                      <Text>No medical records found for Patient ID: <strong>{searchPatientId}</strong></Text>
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
                <Title level={4}>
                  Medical Record Found
                </Title>
                <div className="medical-records-scroll-container">
                  {dataMedicalRecord.map((record, index) => (
                    <Card 
                      key={record.medicalRecordId || index}
                      className="medical-record-card"
                      size="small"
                    >
                    <div className="record-header">
                      <div className="record-title">
                        <MedicineBoxFilled className="record-icon" />
                        <span>Medical Record #{record.medicalRecordId}</span>
                      </div>
                      <div className="consultation-date">
                        <CalendarOutlined className="date-icon" />
                        <span>{new Date(record.consultationDate).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
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
                            {record.patient?.patientId}
                          </Descriptions.Item>
                          <Descriptions.Item label="Patient Code">
                            {record.patient?.patientCodeAtFacility || 'N/A'}
                          </Descriptions.Item>
                          <Descriptions.Item label="Symptoms">
                            <Text className="symptoms-text">{record.symptoms}</Text>
                          </Descriptions.Item>
                          <Descriptions.Item label="Diagnosis">
                            <Text className="diagnosis-text">{record.diagnosis}</Text>
                          </Descriptions.Item>
                        </Descriptions>
                      </Col>

                      <Col span={12}>
                        <Descriptions
                          title="Medical Details"
                          column={1}
                          size="small"
                          bordered
                        >
                          <Descriptions.Item label="Doctor">
                            Dr. {record.doctor?.specialty} - {record.doctor?.qualifications}
                          </Descriptions.Item>
                          <Descriptions.Item label="Experience">
                            {record.doctor?.yearsOfExperience} years
                          </Descriptions.Item>
                          <Descriptions.Item label="Pregnancy Status">
                            <Tag color={
                              record.pregnancyStatus === 'Pregnant' ? 'pink' :
                              record.pregnancyStatus === 'NotPregnant' ? 'green' : 'orange'
                            }>
                              {record.pregnancyStatus === 'NotPregnant' ? 'Not Pregnant' : record.pregnancyStatus}
                            </Tag>
                          </Descriptions.Item>
                          <Descriptions.Item label="Pregnancy Week">
                            {record.pregnancyWeek} weeks
                          </Descriptions.Item>
                        </Descriptions>
                      </Col>
                    </Row>

                    <Divider orientation="left">Doctor Notes</Divider>
                    <div className="doctor-notes">
                      <Text className="notes-content">{record.doctorNotes}</Text>
                    </div>

                    <Divider orientation="left">Next Steps</Divider>
                    <div className="next-steps">
                      <Text className="steps-content">{record.nextSteps}</Text>
                    </div>

                    {(record.underlyingDisease || record.drugAllergyHistory) && (
                      <>
                        <Divider orientation="left">Additional Information</Divider>
                        <Row gutter={16}>
                          {record.underlyingDisease && (
                            <Col span={12}>
                              <div className="additional-info">
                                <Text strong>Underlying Disease:</Text>
                                <br />
                                <Text>{record.underlyingDisease}</Text>
                              </div>
                            </Col>
                          )}
                          {record.drugAllergyHistory && (
                            <Col span={12}>
                              <div className="additional-info">
                                <Text strong>Drug Allergy History:</Text>
                                <br />
                                <Text>{record.drugAllergyHistory}</Text>
                              </div>
                            </Col>
                          )}
                        </Row>
                      </>
                    )}

                    {record.testResults && record.testResults.length > 0 && (
                      <>
                        <Divider orientation="left">Related Test Results</Divider>
                        <div className="test-results-section">
                          {record.testResults.map((test, testIndex) => (
                            <Card 
                              key={test.testResultId || testIndex}
                              size="small"
                              className="test-result-mini-card"
                            >
                              <Row gutter={8}>
                                <Col span={8}>
                                  <Text strong>Test Type:</Text>
                                  <br />
                                  <Tag color="blue">{test.testType}</Tag>
                                </Col>
                                <Col span={8}>
                                  <Text strong>Result:</Text>
                                  <br />
                                  <Tag color={test.testResults === 'Positive' ? 'red' : 'green'}>
                                    {test.testResults}
                                  </Tag>
                                </Col>
                                <Col span={8}>
                                  <Text strong>Lab:</Text>
                                  <br />
                                  <Text>{test.labName}</Text>
                                </Col>
                              </Row>
                              {test.doctorComments && (
                                <div className="test-comments">
                                  <Text type="secondary" italic>"{test.doctorComments}"</Text>
                                </div>
                              )}
                            </Card>
                          ))}
                        </div>
                      </>
                    )}
                  </Card>
                ))}
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
          </Button>
        ]}
        width={900}
        centered
      >
        <div className="create-medical-record-form">
          <div className="patient-info-header">
            <Text type="secondary">
              Creating medical record for Patient ID: <strong>{searchPatientId}</strong>
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
                  rules={[{ required: true, message: "Please enter test result ID" }]}
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
                  label="Doctor ID"
                  rules={[{ required: true, message: "Please enter doctor ID" }]}
                >
                  <Input
                    type="number"
                    placeholder="Enter doctor ID"
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="consultationDate"
              label="Consultation Date"
              rules={[{ required: true, message: "Please select consultation date" }]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
                placeholder="Select consultation date and time"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="symptoms"
                  label="Symptoms"
                  rules={[{ required: true, message: "Please describe symptoms" }]}
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
                  rules={[{ required: true, message: "Please enter diagnosis" }]}
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
                  name="pregnancyStatus"
                  label="Pregnancy Status"
                  rules={[{ required: true, message: "Please select pregnancy status" }]}
                >
                  <Select
                    placeholder="Select pregnancy status"
                    options={[
                      { value: 'NotPregnant', label: 'Not Pregnant' },
                      { value: 'Pregnant', label: 'Pregnant' },
                      { value: 'Unknown', label: 'Unknown' }
                    ]}
                  />
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  name="pregnancyWeek"
                  label="Pregnancy Week"
                  tooltip="Enter 0 if not pregnant"
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

            <Form.Item
              name="doctorNotes"
              label="Doctor Notes"
              rules={[{ required: true, message: "Please enter doctor notes" }]}
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
              rules={[{ required: true, message: "Please describe next steps" }]}
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
    </div>
  );
}

export default PatientMedicalRecord
