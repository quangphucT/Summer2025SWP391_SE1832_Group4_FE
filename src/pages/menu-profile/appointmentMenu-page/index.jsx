import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Table, Tag, Typography, Spin, Modal, message } from "antd";
import dayjs from "dayjs";
import "./index.scss";
import { getAllAppointmentsOfCustomer } from "../../../apis/appointmentAPI/getAllAppointmentsOfCustomerApi";
import { useDispatch } from 'react-redux';
import { addFeedback, editFeedback, fetchFeedbacks } from '../../../redux/feature/feedbackSlice';
import { useRef } from 'react';

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
  const [rating, setRating] = useState(null); // 1-5
  const [selectedTags, setSelectedTags] = useState([]);
  const [suggestion, setSuggestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackId, setFeedbackId] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const textareaRef = useRef();

  // Parse comment to tags + suggestion
  const parseComment = (comment) => {
    if (!comment) return { tags: [], suggestion: '' };
    const [tagsPart, ...suggestionParts] = comment.split('\n');
    const tags = tagsPart ? tagsPart.split(',').map(t => t.trim()).filter(Boolean) : [];
    const suggestion = suggestionParts.join('\n');
    return { tags, suggestion };
  };

  // Khi mở modal, fetch feedback cũ nếu có
  useEffect(() => {
    if (open && appointmentId) {
      setLoadingFeedback(true);
      dispatch(fetchFeedbacks({ appointmentId }))
        .unwrap()
        .then(res => {
          // Dữ liệu thực tế nằm trong res.data.feedbacks
          const feedbacks = res.data?.feedbacks || [];
          if (Array.isArray(feedbacks) && feedbacks.length > 0) {
            const fb = feedbacks[0];
            setFeedbackId(fb.feedbackId); // dùng feedbackId
            setRating(fb.rating);
            const parsed = parseComment(fb.comment);
            setSelectedTags(parsed.tags);
            setSuggestion(parsed.suggestion);
          } else {
            setFeedbackId(null);
            setRating(null);
            setSelectedTags([]);
            setSuggestion('');
          }
        })
        .finally(() => setLoadingFeedback(false));
    } else if (!open) {
      setFeedbackId(null);
      setRating(null);
      setSelectedTags([]);
      setSuggestion('');
    }
  }, [open, appointmentId, dispatch]);

  const handleTagClick = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!rating) {
      message.warning('Please select your rating!');
      return;
    }
    setSubmitting(true);
    const comment = `${selectedTags.join(', ')}${selectedTags.length && suggestion ? '\n' : ''}${suggestion}`;
    try {
      if (feedbackId) {
        await dispatch(
          editFeedback({ id: feedbackId, data: { appointmentId, rating, comment } })
        ).unwrap();
        message.success('Feedback updated successfully!');
      } else {
        await dispatch(
          addFeedback({ appointmentId, rating, comment })
        ).unwrap();
        message.success('Thank you for your feedback!');
      }
    } catch {
      message.error('Failed to submit feedback!');
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
          <>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, margin: '16px 0' }}>
              {[1,2,3,4,5].map((num) => (
                <span
                  key={num}
                  style={{
                    fontSize: 32,
                    cursor: 'pointer',
                    filter: rating === num ? 'none' : 'grayscale(1)',
                    transition: 'filter 0.2s',
                  }}
                  onClick={() => setRating(num)}
                  role="img"
                  aria-label={`rating-${num}`}
                >
                  {num === 1 ? '😡' : num === 2 ? '😕' : num === 3 ? '😐' : num === 4 ? '😊' : '😍'}
                </span>
              ))}
            </div>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>Tell us what can be Improved?</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
              {feedbackTags.map((tag) => (
                <span
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 8,
                    background: selectedTags.includes(tag) ? '#6366f1' : '#e0e7ff',
                    color: selectedTags.includes(tag) ? '#fff' : '#222',
                    cursor: 'pointer',
                    border: selectedTags.includes(tag) ? '1px solid #6366f1' : '1px solid #e0e7ff',
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={suggestion}
              onChange={e => setSuggestion(e.target.value)}
              placeholder="Other suggestions…"
              style={{ width: '100%', minHeight: 60, borderRadius: 8, border: '1px solid #cbd5e1', padding: 8, marginBottom: 16, resize: 'vertical' }}
            />
            <button
              onClick={handleSubmit}
              disabled={submitting}
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
            </button>
          </>
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
    {
      title: "Appointment ID",
      dataIndex: "appointmentId",
      key: "appointmentId",
    },
    {
      title: "Service",
      dataIndex: "appointmentService",
      key: "appointmentService",
    },
    {
      title: "Date",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Time",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      render: (text) => text?.slice(0, 5),
    },
    {
      title: "Type",
      dataIndex: "appointmentType",
      key: "appointmentType",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "PendingConfirmation") color = "orange";
        else if (status === "Scheduled") color = "green";
        else if (status === "Cancelled") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Doctor Info",
      key: "doctor",
      render: (_, record) => {
        const doctor = record.doctor?.account;
        return (
          <div>
            <strong>{doctor?.fullName}</strong>
            <div>Email: {doctor?.email}</div>
            <div>Phone: {doctor?.phoneNumber}</div>
          </div>
        );
      },
    },
    {
      title: "Patient Info",
      key: "patient",
      render: (_, record) => {
        const patient = record.patient?.account;
        return (
          <div>
            <strong>{patient?.fullName}</strong>
            <div>Email: {patient?.email}</div>
            <div>Phone: {patient?.phoneNumber}</div>
            <div>Code: {record.patient?.patientCodeAtFacility}</div>
          </div>
        );
      },
    },
    {
      title: "Feedback",
      key: "feedback",
      render: (_, record) => (
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
      ),
    },
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
        <div style={{ background: "#fff", padding: 16, borderRadius: 28 }}>
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
