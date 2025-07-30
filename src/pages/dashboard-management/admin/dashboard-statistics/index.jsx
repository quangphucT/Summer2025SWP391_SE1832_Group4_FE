import './index.scss';
import { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Alert, Statistic, Button, Form, Select, DatePicker, Space, Divider } from 'antd';
import { UserOutlined, CalendarOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  getTreatments,
  getTestResultSummary
} from '../../../../apis/dashboardApi/dashboardApi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const { RangePicker } = DatePicker;

const DashboardStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [testResultSummary, setTestResultSummary] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [currentFilter, setCurrentFilter] = useState({
    entity: 'patient',
    groupBy: 'Year'
  });
  const [groupBy, setGroupBy] = useState('Year');
  const [form] = Form.useForm();

  // Params cho treatments (có thể thay đổi nếu có UI filter)
  const treatmentParams = {
    statusFilter: '',
    sortBy: '',
    sortDesc: false,
    pageNumber: 1,
    pageSize: 20
  };

  // Hàm gọi API dashboard
  const fetchDashboardData = async (params) => {
    setDashboardLoading(true);
    try {
      // Chỉ gửi entity và groupBy nếu không có date range
      const queryParams = {
        entity: params.entity || 'Patient',
        groupBy: params.groupBy || 'Year'
      };
      
      // Chỉ thêm from và to nếu có giá trị
      if (params.from && params.from.trim() !== '') {
        queryParams.from = params.from;
      }
      if (params.to && params.to.trim() !== '') {
        queryParams.to = params.to;
      }
      
      const response = await fetch(`https://localhost:7252/api/dashboard?${new URLSearchParams(queryParams)}`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data');
    } finally {
      setDashboardLoading(false);
    }
  };

  // Hàm xử lý filter
  const handleFilter = async (values) => {
    const params = {
      entity: values.entity || 'Patient',
      groupBy: values.groupBy || 'Year',
      from: values.dateRange?.[0]?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') || '',
      to: values.dateRange?.[1]?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') || ''
    };
    
    // Cập nhật current filter
    setCurrentFilter({
      entity: params.entity,
      groupBy: params.groupBy
    });
    
    await fetchDashboardData(params);
  };

  // Hàm reset filter
  const handleReset = () => {
    form.resetFields();
    setCurrentFilter({
      entity: 'Patient',
      groupBy: 'Year'
    });
    fetchDashboardData({
      entity: 'Patient',
      groupBy: 'Year'
    });
  };

  // Khi đổi groupBy trong form, cập nhật state groupBy
  const handleGroupByChange = (value) => {
    setGroupBy(value);
    form.setFieldsValue({ dateRange: null }); // reset date khi đổi groupBy
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Gọi API treatments
        const treatmentsRes = await getTreatments(treatmentParams);
        // Gọi API test result summary
        const testResultRes = await getTestResultSummary();
        // Gọi API dashboard với params mặc định
        await fetchDashboardData({
          entity: 'Patient',
          groupBy: 'Year'
        });
        
        // Map treatments data (giả sử trả về mảng trong data.data)
        const extractArray = (res) => {
          if (res && Array.isArray(res.data)) return res.data;
          if (res && res.data && Array.isArray(res.data.data)) return res.data.data;
          return [];
        };
        const mappedTreatments = extractArray(treatmentsRes).map((item) => {
          // Giả sử item có trường date và count, nếu không thì cần chỉnh lại
          const label = (typeof item.date === 'string' && item.date) || (typeof item.period === 'string' && item.period) || '';
          const count = typeof item.count === 'number' ? item.count : 0;
          return { label, count };
        });
        setTreatments(mappedTreatments);
        // Map test result summary (giả sử trả về object trong data)
        setTestResultSummary(testResultRes?.data?.data || null);
      } catch (err) {
        setError(err.message || 'Error fetching statistics');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Pie chart colors
  const pieColors = ['#52c41a', '#ff4d4f'];

  return (
    <div className="dashboard-statistics-container">
      
      {/* Filter Section */}
      <Card title="Filter Options" style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="inline"
          onFinish={handleFilter}
          initialValues={{
            entity: 'patient',
            groupBy: 'Year',
            dateRange: null
          }}
        >
          <Form.Item name="entity" label="Entity">
            <Select style={{ width: 120 }}>
              <Select.Option value="patient">Patient</Select.Option>
              <Select.Option value="Appointment">Appointment</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="groupBy" label="Group By">
            <Select style={{ width: 120 }} value={groupBy} onChange={handleGroupByChange}>
              <Select.Option value="Year">Year</Select.Option>
              <Select.Option value="Month">Month</Select.Option>
              <Select.Option value="Week">Week</Select.Option>
              <Select.Option value="Day">Day</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="dateRange" label="Date Range">
            {groupBy === 'Month' ? (
              <DatePicker.RangePicker picker="month" format="MM/YYYY" style={{ width: 300 }} />
            ) : groupBy === 'Year' ? (
              <DatePicker.RangePicker picker="year" format="YYYY" style={{ width: 300 }} />
            ) : groupBy === 'Week' ? (
              <DatePicker.RangePicker picker="week" format="GGGG-[W]WW" style={{ width: 300 }} />
            ) : (
              <DatePicker.RangePicker format="DD/MM/YYYY" style={{ width: 300 }} />
            )}
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                icon={<FilterOutlined />} 
                htmlType="submit"
                loading={dashboardLoading}
              >
                Apply Filter
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleReset}
              >
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <>
          {/* Dashboard API Data Card */}
          <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
            <Col xs={24}>
              <Card 
                title="Dashboard API Data" 
                bordered={false}
                extra={
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={() => handleFilter(form.getFieldsValue())}
                    loading={dashboardLoading}
                  >
                    Refresh
                  </Button>
                }
              >
                {dashboardLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin size="large" />
                    <p style={{ marginTop: 16 }}>Loading dashboard data...</p>
                  </div>
                ) : dashboardData ? (
                  <div>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={8}>
                        <Card size="small">
                          <Statistic
                            title="Total Records"
                            value={dashboardData?.data?.items?.[0]?.count || 0}
                            prefix={<UserOutlined />}
                          />
                        </Card>
                      </Col>
                      <Col xs={24} md={8}>
                        <Card size="small">
                          <Statistic
                            title="Entity Type"
                            value={currentFilter.entity || 'N/A'}
                            prefix={<CalendarOutlined />}
                          />
                        </Card>
                      </Col>
                      <Col xs={24} md={8}>
                        <Card size="small">
                          <Statistic
                            title="Grouped By"
                            value={currentFilter.groupBy || 'N/A'}
                            prefix={<CalendarOutlined />}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <Alert 
                    type="info" 
                    message="No dashboard data available. Please apply filters to fetch data."
                  />
                )}
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
            <Col xs={24} md={12}>
              <Card title="Treatments Statistics (Line Chart)" bordered={false}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={treatments}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" name="Treatments" stroke="#1890ff" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Test Result Summary (Pie Chart)" bordered={false}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={testResultSummary ? [
                        { name: 'Positive', value: testResultSummary.positiveCount },
                        { name: 'Negative', value: testResultSummary.negativeCount }
                      ] : []}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {testResultSummary && [
                        <Cell key="positive" fill={pieColors[0]} />,
                        <Cell key="negative" fill={pieColors[1]} />
                      ]}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
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
