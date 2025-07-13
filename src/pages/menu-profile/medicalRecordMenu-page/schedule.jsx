import React, { useState, useEffect } from 'react';
import { Button, Typography, Card, Tag, Spin, Empty, Select, Space } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getAllScheduledActivities } from '../../../apis/scheduledActivities/scheduledActivities';
import { getPatientByAccountId } from '../../../apis/patientApi/updateProfileApi';
const { Title, Text } = Typography;
const { Option } = Select;
import "./schedule.scss";

const MedicalRecordSchedule = ({ setSelectedKey }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [filters, setFilters] = useState({
    activityType: '',
    status: '',
  });
  const user = useSelector((state) => state.user);

  useEffect(() => {
    fetchPatientId();
  }, [user]);

  useEffect(() => {
    if (patientId) {
      fetchActivities();
    }
  }, [patientId, filters]);

  const fetchPatientId = async () => {
    if (!user?.accountID) return;
    
    try {
      const res = await getPatientByAccountId(user.accountID);
      const fetchedPatientId = res?.data?.data?.patientId;
      if (fetchedPatientId) {
        setPatientId(fetchedPatientId);
      }
    } catch (error) {
      toast.error("Unable to retrieve patient information");
    }
  };

  const fetchActivities = async () => {
    if (!patientId) return;
    
    setLoading(true);
    setError(null);
    try {
      const cleanFilters = { patientId };
      if (filters.activityType) cleanFilters.activityType = filters.activityType;
      if (filters.status) cleanFilters.status = filters.status;
      
      const params = new URLSearchParams(cleanFilters);
      const queryString = params.toString();
      const data = await getAllScheduledActivities(queryString);
      setActivities(data);
    } catch (err) {
      toast.error("Failed to load schedule: " + (err.message || "Unknown error"));
      setError(err.message);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'blue';
      case 'Completed':
        return 'green';
      case 'Canceled':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Scheduled':
        return <ClockCircleOutlined />;
      case 'Completed':
        return <CheckCircleOutlined />;
      case 'Canceled':
        return <CloseCircleOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getActivityTypeLabel = (type) => {
    switch (type) {
      case 'ReExamination':
        return 'Re-examination';
      case 'LabTest':
        return 'Lab Test';
      case 'MedicationPickup':
        return 'Medication Pickup';
      default:
        return type;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredActivities = activities.filter(activity => {
    if (filters.activityType && activity.activityType !== filters.activityType) return false;
    if (filters.status && activity.status !== filters.status) return false;
    return true;
  });

  return (
    <div className="medical-record-schedule-container">
      <div className="schedule-header">
        <Button
          icon={<ArrowLeftOutlined />}
          type="link"
          className="back-button"
          onClick={() => setSelectedKey && setSelectedKey('medical')}
        >
          Back to Medical Records
        </Button>
        <Title level={2} className="schedule-title">Medical Schedule</Title>
      </div>

      <div className="schedule-filters">
        <Space size="large">
          <div className="filter-group">
            <Text strong>Activity Type:</Text>
            <Select
              placeholder="All Types"
              value={filters.activityType}
              onChange={(value) => handleFilterChange('activityType', value)}
              allowClear
              style={{ width: 150 }}
            >
              <Option value="ReExamination">Re-examination</Option>
              <Option value="LabTest">Lab Test</Option>
              <Option value="MedicationPickup">Medication Pickup</Option>
            </Select>
          </div>
          
          <div className="filter-group">
            <Text strong>Status:</Text>
            <Select
              placeholder="All Status"
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              allowClear
              style={{ width: 150 }}
            >
              <Option value="Scheduled">Scheduled</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Canceled">Canceled</Option>
            </Select>
          </div>
        </Space>
      </div>

      {loading && (
        <div className="loading-container">
          <Spin size="large" />
          <Text>Loading schedule...</Text>
        </div>
      )}

      {error && (
        <div className="error-container">
          <Text type="danger">Error: {error}</Text>
        </div>
      )}

      {!loading && !error && (
        <div className="schedule-content">
          {filteredActivities.length > 0 ? (
            <div className="activities-grid">
              {filteredActivities.map((activity) => (
                <Card
                  key={activity.scheduledActivityId || activity.id}
                  className="activity-card"
                  hoverable
                >
                  <div className="activity-header">
                    <div className="activity-type">
                      <CalendarOutlined className="activity-icon" />
                      <Text strong>{getActivityTypeLabel(activity.activityType)}</Text>
                    </div>
                    <Tag 
                      color={getStatusColor(activity.status)}
                      icon={getStatusIcon(activity.status)}
                    >
                      {activity.status === 'Scheduled' ? 'Scheduled' :
                       activity.status === 'Completed' ? 'Completed' :
                       activity.status === 'Canceled' ? 'Canceled' : activity.status}
                    </Tag>
                  </div>
                  
                  <div className="activity-details">
                    <div className="detail-item">
                      <Text type="secondary">Date & Time:</Text>
                      <Text strong>{formatDate(activity.scheduledDate)}</Text>
                    </div>
                    
                    {activity.description && (
                      <div className="detail-item">
                        <Text type="secondary">Description:</Text>
                        <Text>{activity.description}</Text>
                      </div>
                    )}
                    
                    <div className="detail-item">
                      <Text type="secondary">Activity ID:</Text>
                      <Text code>{activity.scheduledActivityId || activity.id}</Text>
                    </div>
                    
                    <div className="detail-item">
                      <Text type="secondary">Created:</Text>
                      <Text>{formatDate(activity.createdAt)}</Text>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Empty
              description="No schedules found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MedicalRecordSchedule;
