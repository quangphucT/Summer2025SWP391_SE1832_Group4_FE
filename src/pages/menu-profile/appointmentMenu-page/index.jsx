import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Table, Tag, Typography, Spin, Modal, Form, Button } from "antd";
import "./index.scss";
import { getAllAppointmentsOfCustomer } from "../../../apis/appointmentAPI/getAllAppointmentsOfCustomerApi";
import { useDispatch } from 'react-redux';
import { addFeedback, editFeedback, fetchFeedbacks } from '../../../redux/feature/feedbackSlice';

const { Title } = Typography;

const feedbackTags = [
  'Overall Service',
  'Customer Support',
  'Pickup & Delivery Service',
  'Service & Efficiency',
  'Transparency',
];

const FeedbackModal = ({ open, onClose, appointmentId }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [feedbackId, setFeedbackId] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [, forceUpdate] = useState({});

  // Khi mở modal, fetch feedback cũ nếu có
  useEffect(() => {
    let isMounted = true;
    if (open && appointmentId) {
      setLoadingFeedback(true);
      dispatch(fetchFeedbacks({ appointmentId }))
        .unwrap()
        .then(res => {
          if (!isMounted) return;
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
        .finally(() => {
          if (isMounted) setLoadingFeedback(false);
        });
    } else if (!open) {
      setFeedbackId(null);
      setPatientId(null);
      form.resetFields();
    }
    return () => { isMounted = false; };
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
    forceUpdate({}); // Trigger re-render để màu tag cập nhật ngay
  };

  const handleSubmit = async (values) => {
    if (!values.rating) {
      toast.warning('Please select your rating!');
      return;
    }
    setSubmitting(true);
    const comment = values.comment || '';
    try {
      if (feedbackId) {
        await dispatch(
          editFeedback({ id: feedbackId, data: { appointmentId, patientId, rating: values.rating, comment } })
        ).unwrap();
        toast.success('Feedback updated successfully!');
      } else {
        await dispatch(
          addFeedback({ appointmentId, rating: values.rating, comment })
        ).unwrap();
        toast.success('Thank you for your feedback!');
      }
    } catch {
      toast.error('Failed to submit feedback!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
      destroyOnClose
    >
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h3 style={{ fontWeight: 700, fontSize: 20 }}>Feedback</h3>
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
                    onClick={() => form.setFieldsValue({ rating: num })}
                    role="img"
                    aria-label={`rating-${num}`}
                  >
                    {num === 1 ? '😡' : num === 2 ? '😕' : num === 3 ? '😐' : num === 4 ? '😊' : '😍'}
                  </span>
                ))}
              </div>
            </Form.Item>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>Tell us what can be Improved?</div>
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
                onChange={e => form.setFieldsValue({ comment: e.target.value })}
              />
            </Form.Item>
            <Button
              htmlType="submit"
              loading={submitting}
              style={{
                width: '100%',
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 0',
                fontWeight: 700,
                fontSize: 16,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {feedbackId ? 'Update Feedback' : 'Submit'}
            </Button>
          </Form>
        )}
      </div>
    </Modal>
  );
};

const AppointmentMenuPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [feedbackModal, setFeedbackModal] = useState({ open: false, appointmentId: null });

  const fetchingDataAppointmentCustomer = async () => {
    setLoading(true);
    try {
      const response = await getAllAppointmentsOfCustomer();
    const sortedData =  (response.data.data || []).sort((a,b ) => b.appointmentId - a.appointmentId);
    setData(sortedData)
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error loading appointments"
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchingDataAppointmentCustomer();
  }, []);

  const columns = [
    { title: "Appointment ID", dataIndex: "appointmentId", key: "appointmentId", width: 100 },
    { title: "Service", dataIndex: "appointmentService", key: "appointmentService", width: 140, ellipsis: true },
    { title: "Date", dataIndex: "appointmentDate", key: "appointmentDate", width: 110 },
    { title: "Time", dataIndex: "appointmentTime", key: "appointmentTime", width: 90 },
    { title: "Type", dataIndex: "appointmentType", key: "appointmentType", width: 120 },
    { title: "Status", dataIndex: "status", key: "status", width: 140 },
    { title: "Doctor Info", key: "doctor", width: 180, ellipsis: true, render: (_, record) => {
      const doctor = record.doctor?.account;
      return (
        <div>
          <strong>{doctor?.fullName}</strong>
          <div>Email: {doctor?.email}</div>
          <div>Phone: {doctor?.phoneNumber}</div>
        </div>
      );
    } },
    { title: "Patient Info", key: "patient", width: 180, ellipsis: true, render: (_, record) => {
      const patient = record.patient?.account;
      return (
        <div>
          <strong>{patient?.fullName}</strong>
          <div>Email: {patient?.email}</div>
          <div>Phone: {patient?.phoneNumber}</div>
          <div>Code: {record.patient?.patientCodeAtFacility}</div>
        </div>
      );
    } },
    { title: "Feedback", key: "feedback", width: 120, render: (_, record) => (
      <button
        style={{
          background: '#f59e42',
          border: 'none',
          borderRadius: 6,
          padding: '4px 12px',
          color: '#fff',
          cursor: 'pointer',
          fontWeight: 600
        }}
        onClick={() => handleOpenFeedback(record.appointmentId)}
      >
        Feedback
      </button>
    ) },
  ];

  const handleOpenFeedback = (appointmentId) => {
    setFeedbackModal({ open: true, appointmentId });
  };

  const handleCloseFeedback = () => {
    setFeedbackModal({ open: false, appointmentId: null });
  };

  return (
    <div
      style={{ backgroundColor: "#e0e7ff", minHeight: "100vh", padding: 24 }}
    >
      {loading ? (
        <Spin
          size="large"
          style={{ display: "flex", justifyContent: "center", marginTop: 100 }}
        />
      ) : (
        <div style={{ background: "#fff", padding: 16, borderRadius: 28, width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
          <Title
            level={3}
            style={{
              color: "#1e3a8a",
              textAlign: "center",
              fontSize: "30px",
              fontWeight: "700",
            }}
          >
            Appointment List History
          </Title>

            <Table
              rowKey="appointmentId"
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 3 }}
            />
          {/* Feedback Modal */}
          <FeedbackModal
            open={feedbackModal.open}
            onClose={handleCloseFeedback}
            appointmentId={feedbackModal.appointmentId}
          />
        </div>
      )}
    </div>
  );
};

export default AppointmentMenuPage;
