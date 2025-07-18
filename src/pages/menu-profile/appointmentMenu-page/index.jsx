import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
  Table,
  Tag,
  Typography,
  Spin,
  Input,
  Select,
  Row,
  Col,
  Card,
  Statistic,
  Button,
  Modal,
  Form,
  message,
} from "antd";
import {
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "./index.scss";
import { getAllAppointmentsFollowingDoctor } from "../../../apis/appointmentAPI/getAppointmentFollowingDoctorApi";
import { useSelector } from "react-redux";
import ResultModal from "../../../components/atoms/ModalResult";
import { getResultTestHIV } from "../../../apis/Results/getResultTestHIVAPI";
import { useDispatch } from 'react-redux';
import { addFeedback, editFeedback, fetchFeedbacks } from '../../../redux/feature/feedbackSlice';

const { Title } = Typography;
const { Option } = Select;

const AppointmentMenuPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const accountID = useSelector((store) => store?.user?.accountID);
  const [resultData, setResultData] = useState({});
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  // Add state for feedback modal
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedFeedbackAppointmentId, setSelectedFeedbackAppointmentId] = useState(null);

  useEffect(() => {
    const fetchingDataAppointmentCustomer = async () => {
      setLoading(true);
      try {
        const response = await getAllAppointmentsFollowingDoctor(accountID);
        const sortedData = (response.data.data.rowDatas || []).sort(
          (a, b) => b.appointmentId - a.appointmentId
        );
        setData(sortedData);
        setFilteredData(sortedData);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Error loading appointments"
        );
      }
      setLoading(false);
    };

    if (accountID) {
      fetchingDataAppointmentCustomer();
    }
  }, [accountID]);

  // Filter and search functionality
  useEffect(() => {
    let filtered = data;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(
        (item) =>
          item.appointmentService
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          item.doctor?.account?.fullName
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          item.patient?.account?.fullName
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          item.appointmentId?.toString().includes(searchText)
      );
    }

    setFilteredData(filtered);
  }, [data, searchText, statusFilter]);

  // Calculate statistics
  const getStatistics = () => {
    const total = data.length;
    const scheduled = data.filter((item) => item.status === "Scheduled").length;
    const pending = data.filter(
      (item) => item.status === "PendingConfirmation"
    ).length;
    const cancelled = data.filter((item) => item.status === "Cancelled").length;
    const completed = data.filter((item) => item.status === "Completed").length;

    return { total, scheduled, pending, cancelled, completed };
  };

  const stats = getStatistics();

  // HIV Screening Process Steps
  const getHIVScreeningProcess = () => {
    const processSteps = [
      {
        title: "Pre-test counseling",
        description: "Pre-test counseling",
        color: "#3b82f6", // Blue
      },
      {
        title: "Test RapidTest", 
        description: "Rapid HIV test",
        color: "#ec4899", // Pink
      },
      {
        title: "Post-test counseling",
        description: "Post-test counseling",
        color: "#06b6d4", // Cyan
      },
      {
        title: "Test PCR or ELISA",
        description: "Confirmatory testing",
        color: "#f59e0b", // Yellow
      },
      {
        title: "Post-test counseling (PCR/ELISA)",
        description: "Post-confirmatory counseling",
        color: "#10b981", // Green
      },
      {
        title: "HIV Treatment",
        description: "HIV Treatment",
        color: "#8b5cf6", // Purple
      },
    ];

    return processSteps;
  };

  const hivProcess = getHIVScreeningProcess();

  const handleOpenModalResult = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setOpen(true);
  };

  const handleOpenFeedback = (appointmentId) => {
    setSelectedFeedbackAppointmentId(appointmentId);
    setFeedbackModalOpen(true);
  };

  const fetchAppointmentResult = useCallback(async () => {
    try {
      // Fetch appointment result logic here
      const result = await getResultTestHIV(selectedAppointmentId);
      const firstResult = result.data.data;
      setResultData(firstResult);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error fetching appointment result"
      );
    }
  }, [selectedAppointmentId]);
  
  useEffect(() => {
    if (open && selectedAppointmentId) {
      fetchAppointmentResult();
    }
  }, [open, selectedAppointmentId, fetchAppointmentResult]);

  // Feedback tags (customize as needed)
  const feedbackTags = [
    "Long waiting time",
    "Unclear instructions",
    "Unfriendly staff",
    "Uncomfortable environment",
    "Other"
  ];

  // FeedbackModal component
  const FeedbackModal = ({ open, onClose, appointmentId }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [loadingFeedback, setLoadingFeedback] = useState(false);
    const [feedbackId, setFeedbackId] = useState(null);
    const [patientId, setPatientId] = useState(null);
    const [, forceUpdate] = useState({}); // Add this line

    useEffect(() => {
      if (open && appointmentId) {
        setLoadingFeedback(true);
        dispatch(fetchFeedbacks({ appointmentId }))
          .unwrap()
          .then(res => {
            let fb = null;
            if (Array.isArray(res.data?.data?.feedbacks)) {
              const feedbacks = res.data.data.feedbacks.filter(f => f.appointmentId === appointmentId);
              fb = feedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
            } else if (res.data?.data && !Array.isArray(res.data.data)) {
              fb = res.data.data;
            }
            if (fb) {
              setFeedbackId(fb.feedbackId);
              setPatientId(fb.patientId);
              form.setFieldsValue({
                comment: fb.comment || '',
                rating: fb.rating,
              });
            } else {
              setFeedbackId(null);
              setPatientId(null);
              form.resetFields();
            }
          })
          .finally(() => setLoadingFeedback(false));
      } else if (!open) {
        setFeedbackId(null);
        setPatientId(null);
        form.resetFields();
      }
    }, [open, appointmentId, dispatch, form]);

    const handleTagClick = (tag) => {
      const currentComment = form.getFieldValue('comment') || '';
      const tags = currentComment.split(',').map(t => t.trim()).filter(Boolean);
      let newTags;
      if (tags.includes(tag)) {
        newTags = tags.filter(t => t !== tag);
      } else {
        newTags = [...tags, tag];
      }
      form.setFieldsValue({ comment: newTags.join(', ') });
      forceUpdate({}); // Force re-render so tag UI updates
    };

    const handleSubmit = async (values) => {
      if (!values.rating) {
        message.warning('Please select your rating!');
        return;
      }
      setSubmitting(true);
      const comment = values.comment || '';
      try {
        if (feedbackId) {
          await dispatch(
            editFeedback({ id: feedbackId, data: { appointmentId, patientId, rating: values.rating, comment } })
          ).unwrap();
        } else {
          await dispatch(
            addFeedback({ appointmentId, rating: values.rating, comment })
          ).unwrap();
        }
        toast.success('Feedback submitted successfully!');
        onClose();
      } catch {
        toast.error('Failed to submit feedback!');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <Modal open={open} onCancel={onClose} footer={null} title="Feedback" destroyOnClose>
        {loadingFeedback ? (
          <Spin style={{ margin: '32px 0' }} />
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ rating: null, comment: '' }}
          >
            <Form.Item name="rating" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, margin: '16px 0' }}>
                {[1,2,3,4,5].map((num) => (
                  <span
                    key={num}
                    style={{
                      fontSize: 32,
                      cursor: 'pointer',
                      filter: form.getFieldValue('rating') === num ? 'none' : 'grayscale(1)',
                      transition: 'filter 0.2s',
                    }}
                    onClick={() => {
                      form.setFieldsValue({ rating: num });
                      forceUpdate({});
                    }}
                    role="img"
                    aria-label={`rating-${num}`}
                  >
                    {num === 1 ? '😡' : num === 2 ? '😕' : num === 3 ? '🙂' : num === 4 ? '😊' : '😍'}
                  </span>
                ))}
              </div>
            </Form.Item>
            <Form.Item name="comment" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
                {feedbackTags.map((tag) => {
                  const tags = (form.getFieldValue('comment') || '').split(',').map(t => t.trim()).filter(Boolean);
                  return (
                    <span
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 8,
                        background: tags.includes(tag) ? '#6366f1' : '#e0e7ff',
                        color: tags.includes(tag) ? '#fff' : '#222',
                        cursor: 'pointer',
                        border: tags.includes(tag) ? '1px solid #6366f1' : '1px solid #e0e7ff',
                        fontWeight: 500,
                      }}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
              <textarea
                placeholder="Other suggestions…"
                style={{ width: '100%', minHeight: 60, borderRadius: 8, border: '1px solid #cbd5e1', padding: 8, resize: 'vertical' }}
                value={form.getFieldValue('comment') || ''}
                onChange={e => {
                  form.setFieldsValue({ comment: e.target.value });
                  forceUpdate({});
                }}
              />
            </Form.Item>
            <Button
              htmlType="submit"
              loading={submitting}
              style={{
                width: '100%',
                background: '#6366f1',
                color: '#fff',
                fontWeight: 600,
                borderRadius: 8,
                height: 40,
                fontSize: 16,
                marginTop: 8
              }}
            >
              {feedbackId ? 'Update Feedback' : 'Submit'}
            </Button>
          </Form>
        )}
      </Modal>
    );
  };

  const columns = [
    {
      title: "Appointment ID",
      dataIndex: "appointmentId",
      key: "appointmentId",
      width: 120,
      render: (text) => <div style={{ color: "#000" }}>#{text}</div>,
    },
    {
      title: "Service",
      dataIndex: "appointmentService",
      key: "appointmentService",
      width: 150,
      render: (text) => (
        <div style={{ fontWeight: 600, color: "#000" }}>{text}</div>
      ),
    },
    {
      title: "Date",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      width: 110,
      render: (text) => <div>{dayjs(text).format("DD/MM/YYYY")}</div>,
    },
    {
      title: "Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      width: 80,
      render: (text) => <div>{text?.slice(0, 5)}</div>,
    },
    {
      title: "Type",
      dataIndex: "appointmentType",
      key: "appointmentType",
      width: 120,
      render: (text) => (
        <div style={{ fontWeight: 600, color: "#000" }}>{text}</div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status) => {
        let color = "default";
        let statusText = status;

        if (status === "PendingConfirmation") {
          color = "orange";
          statusText = "Pending";
        } else if (status === "Scheduled") {
          color = "green";
          statusText = "Scheduled";
        } else if (status === "Cancelled") {
          color = "red";
          statusText = "Cancelled";
        } else if (status === "Completed") {
          color = "green";
          statusText = "Completed";
        }

        return <Tag color={color}>{statusText}</Tag>;
      },
    },
    {
      title: "Doctor Information",
      key: "doctor",
      width: 220,
      render: (_, record) => {
        const doctor = record.doctor?.account;
        return (
          <div>
            <strong>{doctor?.fullName || "N/A"}</strong>
            <div>📧 {doctor?.email || "N/A"}</div>
            <div>📞 {doctor?.phoneNumber || "N/A"}</div>
          </div>
        );
      },
    },
    {
      title: "Patient Information",
      key: "patient",
      width: 220,
      render: (_, record) => {
        const patient = record.patient?.account;
        return (
          <div>
            <strong>{patient?.fullName || "N/A"}</strong>
            <div>📧 {patient?.email || "N/A"}</div>
            <div>📞 {patient?.phoneNumber || "N/A"}</div>
            <div>🏥 {record.patient?.patientCodeAtFacility || "N/A"}</div>
          </div>
        );
      },
    },

    // view results

   {
  title: "Action",
  dataIndex: "appointmentId",
  key: "appointmentId",
  width: 120,
  render: (appointmentId, record) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {record.appointmentType === "Consultation" ? (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="large"
          style={{
            backgroundColor: "orange",
            fontWeight: "500",
            borderRadius: "26px",
          }}
        >
          View Note
        </Button>
      ) : (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleOpenModalResult(appointmentId)}
          size="large"
          style={{
            backgroundColor: "#1976d2",
            borderColor: "#1976d2",
            fontWeight: "500",
            borderRadius: "6px",
          }}
        >
          Check Result
        </Button>
      )}
      <Button
        type="default"
        size="small"
        style={{ borderRadius: "6px", fontWeight: "500", background: "#f59e42", color: "#fff" }}
        onClick={() => handleOpenFeedback(record.appointmentId)}
      >
        Feedback
      </Button>
    </div>
  ),
}

  ];
  
  return (
    <div className="appointment-history-page">
      {loading ? (
        <div className="appointment-content-wrapper">
          <Spin
            size="large"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
            }}
          />
        </div>
      ) : (
        <div className="appointment-content-wrapper">
          {/* Statistics Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card">
                <Statistic
                  title="Total Appointments"
                  value={stats.total}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: "#000", fontWeight: "bold" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card">
                <Statistic
                  title="Scheduled"
                  value={stats.scheduled}
                  prefix={<MedicineBoxOutlined />}
                  valueStyle={{ color: "#52c41a", fontWeight: "bold" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card">
                <Statistic
                  title="Pending"
                  value={stats.pending}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#faad14", fontWeight: "bold" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card">
                <Statistic
                  title="Cancelled"
                  value={stats.cancelled}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: "#ff4d4f", fontWeight: "bold" }}
                />
              </Card>
            </Col>
          </Row>

          {/* HIV Screening Process Timeline */}
          {data.length > 0 && (
            <div className="hiv-timeline-container" style={{ marginBottom: 32 }}>
              <div className="timeline-header">
                <h3 style={{ 
                  textAlign: 'center', 
                  color: '#1a365d', 
                  marginBottom: 24,
                  fontSize: '18px',
                  fontWeight: 600
                }}>
                  Quy trình sàng lọc & điều trị HIV
                </h3>
              </div>
              
              <div className="hiv-timeline">
                {hivProcess.map((step, index) => (
                  <div key={index} className="timeline-step">
                    <div className="timeline-circle-container">
                      <div 
                        className={`timeline-circle`}
                        style={{ backgroundColor: step.color }}
                      >
                        <ClockCircleOutlined style={{ color: 'white', fontSize: '20px' }} />
                      </div>
                      {index < hivProcess.length - 1 && (
                        <div className={`timeline-line`}></div>
                      )}
                    </div>
                    
                    <div className="timeline-content">
                      <div className="step-number">Step {index + 1}</div>
                      <div className="step-title">{step.title}</div>
                      <div className="step-description">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search and Filter Controls */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} md={16}>
              <Input
                placeholder="Search by service, doctor, patient, or appointment ID..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="search-input"
                size="large"
              />
            </Col>
            <Col xs={24} md={8}>
              <Select
                placeholder="Filter by status"
                value={statusFilter}
                onChange={setStatusFilter}
                className="status-filter"
                size="large"
                style={{ width: "100%" }}
              >
                <Option value="all">All Status</Option>
                <Option value="Scheduled">Scheduled</Option>
                <Option value="PendingConfirmation">Pending</Option>
                <Option value="Cancelled">Cancelled</Option>
                <Option value="Completed">Completed</Option>
              </Select>
            </Col>
          </Row>

          <div className="appointment-table-wrapper">
            <Table
              rowKey="appointmentId"
              columns={columns}
              dataSource={filteredData}
              pagination={{
                pageSize: 3,
              }}
              size="middle"
            />
          </div>
        </div>
      )}

      <ResultModal
        isOpen={open}
        onClose={() => {
          setOpen(false); setResultData({});
          setSelectedAppointmentId(null);
        }}
        resultData={resultData}
      />
      <FeedbackModal
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        appointmentId={selectedFeedbackAppointmentId}
      />
    </div>
  );
};

export default AppointmentMenuPage;
