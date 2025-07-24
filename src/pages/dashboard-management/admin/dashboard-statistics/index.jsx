import './index.scss';
import { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Alert, Statistic } from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';
import {
  getAppointmentStatsByMonth,
  getAppointmentStatsByDay,
  getAppointmentStatsByYear,
  getPatientStatsByMonth,
  getPatientStatsByDay,
  getPatientStatsByYear
} from '../../../../apis/dashboardApi/dashboardApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

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
        // Log response từ API
        console.log('API appMonth.data:', appMonth.data);
        console.log('API appDay.data:', appDay.data);
        console.log('API appYear.data:', appYear.data);
        console.log('API patMonth.data:', patMonth.data);
        console.log('API patDay.data:', patDay.data);
        console.log('API patYear.data:', patYear.data);
        // Hàm lấy đúng mảng data từ response (hỗ trợ cả trường hợp lồng data)
        const extractArray = (res) => {
          if (res && Array.isArray(res.data)) return res.data;
          if (res && res.data && Array.isArray(res.data.data)) return res.data.data;
          return [];
        };
        // Chuyển đổi dữ liệu cho phù hợp với recharts, kiểm tra kỹ từng phần tử
        const mapData = (data) => {
          if (!Array.isArray(data)) {
            console.warn('mapData: data is not an array', data);
            return [];
          }
          return data.map((item, idx) => {
            if (!item || (typeof item !== 'object')) {
              console.warn('mapData: item is not object', idx, item);
              return { label: '', count: 0 };
            }
            const label = (typeof item.period === 'string' && item.period) || (typeof item.date === 'string' && item.date) || '';
            const count = typeof item.count === 'number' ? item.count : 0;
            if (!label || count === undefined) {
              console.warn('mapData: missing label or count', idx, item);
            }
            return { label, count };
          });
        };
        // Log mapped data
        const mappedAppMonth = mapData(extractArray(appMonth));
        const mappedAppDay = mapData(extractArray(appDay));
        const mappedAppYear = mapData(extractArray(appYear));
        const mappedPatMonth = mapData(extractArray(patMonth));
        const mappedPatDay = mapData(extractArray(patDay));
        const mappedPatYear = mapData(extractArray(patYear));
        console.log('Mapped appMonth:', mappedAppMonth);
        console.log('Mapped appDay:', mappedAppDay);
        console.log('Mapped appYear:', mappedAppYear);
        console.log('Mapped patMonth:', mappedPatMonth);
        console.log('Mapped patDay:', mappedPatDay);
        console.log('Mapped patYear:', mappedPatYear);
        setStats({
          appointment: {
            month: mappedAppMonth,
            day: mappedAppDay,
            year: mappedAppYear
          },
          patient: {
            month: mappedPatMonth,
            day: mappedPatDay,
            year: mappedPatYear
          }
        });
      } catch (err) {
        setError(err.message || 'Error fetching statistics');
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  // Thêm log để debug dữ liệu truyền vào biểu đồ
  console.log('Appointment Month:', stats.appointment.month);
  console.log('Patient Month:', stats.patient.month);

  return (
    <div className="dashboard-statistics-container">
      <h2 style={{ marginBottom: 24 }}>Dashboard Statistics</h2>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <>
          <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false} style={{ background: '#e6f7ff' }}>
                <Statistic
                  title="Appointments (This Month)"
                  value={Array.isArray(stats.appointment.month) ? stats.appointment.month.reduce((a, b) => a + (b.count || 0), 0) : 0}
                  prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false} style={{ background: '#fffbe6' }}>
                <Statistic
                  title="Appointments (Today)"
                  value={Array.isArray(stats.appointment.day) ? stats.appointment.day.reduce((a, b) => a + (b.count || 0), 0) : 0}
                  prefix={<CalendarOutlined style={{ color: '#faad14' }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false} style={{ background: '#f6ffed' }}>
                <Statistic
                  title="Patients (This Month)"
                  value={Array.isArray(stats.patient.month) ? stats.patient.month.reduce((a, b) => a + (b.count || 0), 0) : 0}
                  prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false} style={{ background: '#fff0f6' }}>
                <Statistic
                  title="Patients (Today)"
                  value={Array.isArray(stats.patient.day) ? stats.patient.day.reduce((a, b) => a + (b.count || 0), 0) : 0}
                  prefix={<UserOutlined style={{ color: '#eb2f96' }} />}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Card title="Appointment Statistics by Month" bordered={false}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Array.isArray(stats.appointment.month) ? stats.appointment.month : []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Appointments" fill="#1890ff" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Patient Statistics by Month" bordered={false}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Array.isArray(stats.patient.month) ? stats.patient.month : []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Patients" fill="#52c41a" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
          <Row gutter={24} style={{ marginTop: 24 }}>
            <Col xs={24} md={12}>
              <Card title="Appointment Statistics by Day" bordered={false}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={Array.isArray(stats.appointment.day) ? stats.appointment.day : []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Appointments" fill="#faad14" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Patient Statistics by Day" bordered={false}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={Array.isArray(stats.patient.day) ? stats.patient.day : []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Patients" fill="#eb2f96" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
          <Row gutter={24} style={{ marginTop: 24 }}>
            <Col xs={24} md={12}>
              <Card title="Appointment Statistics by Year" bordered={false}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={Array.isArray(stats.appointment.year) ? stats.appointment.year : []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Appointments" fill="#1890ff" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Patient Statistics by Year" bordered={false}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={Array.isArray(stats.patient.year) ? stats.patient.year : []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Patients" fill="#52c41a" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default DashboardStatistics;
