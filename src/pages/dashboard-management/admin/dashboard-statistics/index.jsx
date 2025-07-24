import './index.scss';
import { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Alert } from 'antd';
import {
  getAppointmentStatsByMonth,
  getAppointmentStatsByDay,
  getAppointmentStatsByYear,
  getPatientStatsByMonth,
  getPatientStatsByDay,
  getPatientStatsByYear
} from '../../../../apis/dashboardApi/dashboardApi';

const DashboardStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    appointment: { month: null, day: null, year: null },
    patient: { month: null, day: null, year: null }
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const [appMonth, appDay, appYear, patMonth, patDay, patYear] = await Promise.all([
          getAppointmentStatsByMonth(),
          getAppointmentStatsByDay(),
          getAppointmentStatsByYear(),
          getPatientStatsByMonth(),
          getPatientStatsByDay(),
          getPatientStatsByYear()
        ]);
        setStats({
          appointment: {
            month: appMonth.data,
            day: appDay.data,
            year: appYear.data
          },
          patient: {
            month: patMonth.data,
            day: patDay.data,
            year: patYear.data
          }
        });
      } catch (err) {
        setError(err.message || 'Error fetching statistics');
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-statistics-container">
      <h2>Dashboard Statistics</h2>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <Row gutter={24}>
          <Col span={12}>
            <Card title="Appointment Statistics" bordered={false}>
              <div>By Month: <b>{JSON.stringify(stats.appointment.month)}</b></div>
              <div>By Day: <b>{JSON.stringify(stats.appointment.day)}</b></div>
              <div>By Year: <b>{JSON.stringify(stats.appointment.year)}</b></div>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Patient Statistics" bordered={false}>
              <div>By Month: <b>{JSON.stringify(stats.patient.month)}</b></div>
              <div>By Day: <b>{JSON.stringify(stats.patient.day)}</b></div>
              <div>By Year: <b>{JSON.stringify(stats.patient.year)}</b></div>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default DashboardStatistics;
