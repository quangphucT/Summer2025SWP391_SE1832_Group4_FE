import React, { useState, useEffect, useCallback } from 'react';
import { Table, Card, Input, Button, Space, Modal, Descriptions, Tag, Typography, Spin, Form, DatePicker, message } from 'antd';
import { SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorByAccountId } from '../../../../redux/feature/doctorSlice';
import { getPatientRecordsByDoctorId, createPatientRecord, updatePatientRecord, deletePatientRecord } from '../../../../apis/patientApi/patentrecordApi';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const PatientRecords = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const accountId = useSelector((state) => state.user?.accountID);
  const [currentDoctorId, setCurrentDoctorId] = useState(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      if (!accountId) {
        toast.error('Không tìm thấy account ID');
        setLoading(false);
        return;
      }
      // Lấy doctorId từ accountId
      const doctorRes = await dispatch(fetchDoctorByAccountId(accountId)).unwrap();
      const doctorId = doctorRes?.data?.doctorId;
      setCurrentDoctorId(doctorId);
      if (!doctorId) {
        toast.error('Không tìm thấy doctor ID');
        setLoading(false);
        return;
      }
      // Lấy danh sách hồ sơ bệnh nhân của doctor
      const res = await getPatientRecordsByDoctorId(doctorId);
      setPatients(res?.data || []);
    } catch (error) {
      toast.error(error?.message || 'Lỗi khi tải hồ sơ bệnh nhân');
    }
    setLoading(false);
  }, [accountId, dispatch]);

  useEffect(() => {
    if (accountId) fetchRecords();
  }, [accountId, fetchRecords]);

  const handleCreate = async (values) => {
    try {
      setLoading(true);
      const data = {
        ...values,
        doctorId: currentDoctorId,
        consultationDate: values.consultationDate.format('YYYY-MM-DD'),
      };
      await createPatientRecord(data);
      message.success('Tạo hồ sơ bệnh nhân thành công');
      setIsCreateModalVisible(false);
      form.resetFields();
      fetchRecords();
    } catch (error) {
      message.error(error?.message || 'Lỗi khi tạo hồ sơ bệnh nhân');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (values) => {
    try {
      setLoading(true);
      const data = {
        ...values,
        doctorId: currentDoctorId,
        consultationDate: values.consultationDate.format('YYYY-MM-DD'),
      };
      await updatePatientRecord(selectedPatient.appointmentId, data);
      message.success('Cập nhật hồ sơ bệnh nhân thành công');
      setIsEditModalVisible(false);
      form.resetFields();
      fetchRecords();
    } catch (error) {
      message.error(error?.message || 'Lỗi khi cập nhật hồ sơ bệnh nhân');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deletePatientRecord(id);
      message.success('Xóa hồ sơ bệnh nhân thành công');
      fetchRecords();
    } catch (error) {
      message.error(error?.message || 'Lỗi khi xóa hồ sơ bệnh nhân');
    } finally {
      setLoading(false);
    }
  };

  const showEditModal = (record) => {
    setSelectedPatient(record);
    form.setFieldsValue({
      ...record,
      consultationDate: dayjs(record.consultationDate),
    });
    setIsEditModalVisible(true);
  };

  const handleSearch = (value) => {
    if (!value) {
      fetchRecords();
      return;
    }
    const filteredPatients = patients.filter(patient => 
      patient.patientId.toString().includes(value) ||
      patient.symptoms?.toLowerCase().includes(value.toLowerCase()) ||
      patient.diagnosis?.toLowerCase().includes(value.toLowerCase())
    );
    setPatients(filteredPatients);
  };

  const columns = [
    {
      title: 'Record ID',
      dataIndex: 'appointmentId',
      key: 'appointmentId',
    },
    {
      title: 'Patient ID',
      dataIndex: 'patientId',
      key: 'patientId',
    },
    {
      title: 'Consultation Date',
      dataIndex: 'consultationDate',
      key: 'consultationDate',
      render: (date) => date ? new Date(date).toLocaleString('vi-VN') : '',
    },
    {
      title: 'Symptoms',
      dataIndex: 'symptoms',
      key: 'symptoms',
      ellipsis: true,
    },
    {
      title: 'Diagnosis',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      ellipsis: true,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedPatient(record);
              setIsModalVisible(true);
            }}
          >
            Chi tiết
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            Chỉnh sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => Modal.confirm({
              title: 'Xác nhận xóa',
              content: 'Bạn có chắc chắn muốn xóa hồ sơ này?',
              okText: 'Xóa',
              cancelText: 'Hủy',
              onOk: () => handleDelete(record.appointmentId)
            })}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const recordForm = (
    <Form
      form={form}
      layout="vertical"
      onFinish={isEditModalVisible ? handleEdit : handleCreate}
    >
      <Form.Item
        name="patientId"
        label="Patient ID"
        rules={[{ required: true, message: 'Vui lòng nhập Patient ID' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="consultationDate"
        label="Consultation Date"
        rules={[{ required: true, message: 'Vui lòng chọn ngày khám' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="symptoms"
        label="Symptoms"
        rules={[{ required: true, message: 'Vui lòng nhập triệu chứng' }]}
      >
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item
        name="diagnosis"
        label="Diagnosis"
        rules={[{ required: true, message: 'Vui lòng nhập chẩn đoán' }]}
      >
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item
        name="doctorNotes"
        label="Doctor Notes"
      >
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item
        name="nextSteps"
        label="Next Steps"
      >
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item
        name="coinfectionDiseases"
        label="Coinfection Diseases"
      >
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item
        name="drugAllergyHistory"
        label="Drug Allergy History"
      >
        <TextArea rows={4} />
      </Form.Item>
    </Form>
  );

  return (
    <div>
      <Title level={2}>Hồ sơ bệnh nhân</Title>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Search
            placeholder="Tìm kiếm bệnh nhân..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setIsCreateModalVisible(true);
            }}
          >
            Thêm mới
          </Button>
        </Space>
        {loading ? (
          <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }} />
        ) : (
          <Table
            columns={columns}
            dataSource={patients}
            rowKey="appointmentId"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} hồ sơ`,
            }}
          />
        )}
      </Card>

      {/* Modal xem chi tiết */}
      <Modal
        title="Chi tiết hồ sơ"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={600}
      >
        {selectedPatient && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Record ID">{selectedPatient.appointmentId}</Descriptions.Item>
            <Descriptions.Item label="Patient ID">{selectedPatient.patientId}</Descriptions.Item>
            <Descriptions.Item label="Consultation Date">
              {selectedPatient.consultationDate ? new Date(selectedPatient.consultationDate).toLocaleString('vi-VN') : ''}
            </Descriptions.Item>
            <Descriptions.Item label="Symptoms">{selectedPatient.symptoms}</Descriptions.Item>
            <Descriptions.Item label="Diagnosis">{selectedPatient.diagnosis}</Descriptions.Item>
            <Descriptions.Item label="Doctor Notes">{selectedPatient.doctorNotes}</Descriptions.Item>
            <Descriptions.Item label="Next Steps">{selectedPatient.nextSteps}</Descriptions.Item>
            <Descriptions.Item label="Coinfection Diseases">{selectedPatient.coinfectionDiseases}</Descriptions.Item>
            <Descriptions.Item label="Drug Allergy History">{selectedPatient.drugAllergyHistory}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa hồ sơ"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          form.resetFields();
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setIsEditModalVisible(false);
            form.resetFields();
          }}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
            Lưu
          </Button>,
        ]}
        width={800}
      >
        {recordForm}
      </Modal>

      {/* Modal tạo mới */}
      <Modal
        title="Tạo hồ sơ mới"
        open={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          form.resetFields();
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setIsCreateModalVisible(false);
            form.resetFields();
          }}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
            Tạo
          </Button>,
        ]}
        width={800}
      >
        {recordForm}
      </Modal>
    </div>
  );
};

export default PatientRecords; 