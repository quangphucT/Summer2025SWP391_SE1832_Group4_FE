import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    Button,
    Table,
    Modal,
    Form,
    Input,
    Space,
    message,
    Result,
    Descriptions,
    Tabs
} from 'antd';
import {
    EyeOutlined,
    LoadingOutlined,
    CloseOutlined,
    FileTextOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import {
    fetchAllDoctors,
} from '../../../redux/feature/doctorSlice';
import { fetchDoctorExperience } from '../../../redux/feature/experienceWorkingSlice';
import { fetchCertificatesByDoctorId } from '../../../redux/feature/certificateSlice';
import dayjs from 'dayjs';
import endPoint from '../../../routers/router';

const { TabPane } = Tabs;

const DoctorManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { doctors, status, error, isLoading } = useSelector((state) => state.doctor);
    const user = useSelector((state) => state.user);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const { doctorExperiences } = useSelector((state) => state.experienceWorking);
    const { certificates } = useSelector((state) => state.certificates);
    const [activeTab, setActiveTab] = useState('1');

    useEffect(() => {
        if (!user?.accountID) {
            message.error('Please login to access this page');
            navigate(endPoint.LOGIN);
            return;
        }

        if (user?.role !== 'Admin') {
            message.error('You don\'t have permission to access this page');
            navigate('/');
            return;
        }

        dispatch(fetchAllDoctors());
    }, [dispatch, user, navigate]);

    // Transform the data structure to match the table requirements
    const transformedDoctors = React.useMemo(() => {
        if (!doctors?.data) return [];
        return doctors.data.map(doctor => ({
            key: doctor.doctorId,
            doctorId: doctor.doctorId,
            fullName: doctor.fullName,
            email: doctor.email,
            phoneNumber: doctor.phoneNumber,
            specialty: doctor.specialty || '-',
            qualifications: doctor.qualifications || '-',
            yearsOfExperience: doctor.yearsOfExperience || '-',
            shortDescription: doctor.shortDescription || '-',
            profileImage: doctor.profileImage || '-'
        }));
    }, [doctors]);

    if (status === 'failed') {
        return (
            <Result
                status="error"
                title="Failed to load data"
                subTitle={error || "An error occurred while loading doctor data"}
                extra={[
                    <Button 
                        type="primary" 
                        key="retry" 
                        onClick={() => dispatch(fetchAllDoctors())}
                    >
                        Try Again
                    </Button>
                ]}
            />
        );
    }

    const handleViewDetail = (record) => {
        setSelectedDoctor(record);
        setIsModalVisible(true);
        dispatch(fetchDoctorExperience(record.doctorId));
        dispatch(fetchCertificatesByDoctorId(record.doctorId));
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedDoctor(null);
    };

    const handleViewCertificates = (doctorId) => {
        navigate(`/dashboard/certificate-management/${doctorId}`);
    };

    const handleViewExperience = (doctorId) => {
        navigate(`/dashboard/experience-management/${doctorId}`);
    };

    const experienceColumns = [
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
            width: '20%'
        },
        {
            title: 'Hospital/Clinic',
            dataIndex: 'hospitalName',
            key: 'hospitalName',
            width: '25%'
        },
        {
            title: 'Start Date',
            dataIndex: 'fromDate',
            key: 'fromDate',
            width: '15%',
            render: (date) => dayjs(date).format('DD/MM/YYYY')
        },
        {
            title: 'End Date',
            dataIndex: 'toDate',
            key: 'toDate',
            width: '15%',
            render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : 'Present'
        }
    ];

    const certificateColumns = [
        {
            title: 'Certificate Title',
            dataIndex: 'title',
            key: 'title',
            width: '25%'
        },
        {
            title: 'Issued By',
            dataIndex: 'issuedBy',
            key: 'issuedBy',
            width: '20%'
        },
        {
            title: 'Issue Date',
            dataIndex: 'issuedDate',
            key: 'issuedDate',
            width: '15%',
            render: (date) => dayjs(date).format('DD/MM/YYYY')
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '40%',
            ellipsis: true
        }
    ];

    const columns = [
        {
            title: 'Doctor ID',
            dataIndex: 'doctorId',
            key: 'doctorId',
            width: 100,
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 200,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 250,
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: 150,
        },
        {
            title: 'Specialty',
            dataIndex: 'specialty',
            key: 'specialty',
            width: 150,
        },
        {
            title: 'Actions',
            key: 'action',
            width: 200,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                        size="middle"
                        title="View Details"
                    />
                    <Button
                        type="default"
                        icon={<FileTextOutlined />}
                        onClick={() => handleViewCertificates(record.doctorId)}
                        size="middle"
                        title="Manage Certificates"
                    >
                        Certificates
                    </Button>
                    <Button
                        type="default"
                        icon={<HistoryOutlined />}
                        onClick={() => handleViewExperience(record.doctorId)}
                        size="middle"
                        title="Manage Experience"
                    >
                        Experience
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-[#1890ff] text-3xl font-bold mb-6">Doctor Management</h1>
            <Card className="doctor-management-card">
                <Table
                    columns={columns}
                    dataSource={transformedDoctors}
                    loading={{ 
                        spinning: status === 'loading' || isLoading,
                        indicator: <LoadingOutlined style={{ fontSize: 24 }} spin />
                    }}
                    rowKey="doctorId"
                    locale={{
                        emptyText: status === 'loading' ? 'Loading...' : 'No doctors found'
                    }}
                    className="doctor-table"
                    pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} items`,
                        className: 'flex justify-center',
                        position: ['bottomCenter']
                    }}
                    scroll={{ x: 1000 }}
                />
            </Card>

            <Modal
                title="Doctor Details"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button 
                        key="close"
                        onClick={handleCancel}
                        icon={<CloseOutlined />}
                    >
                        Close
                    </Button>
                ]}
                width={800}
            >
                {selectedDoctor && (
                    <Tabs defaultActiveKey="1" onChange={setActiveTab}>
                        <TabPane tab="Basic Information" key="1">
                            <Descriptions bordered column={1}>
                                <Descriptions.Item label="Doctor ID">
                                    {selectedDoctor.doctorId}
                                </Descriptions.Item>
                                <Descriptions.Item label="Full Name">
                                    {selectedDoctor.fullName}
                                </Descriptions.Item>
                                <Descriptions.Item label="Email">
                                    {selectedDoctor.email}
                                </Descriptions.Item>
                                <Descriptions.Item label="Phone Number">
                                    {selectedDoctor.phoneNumber}
                                </Descriptions.Item>
                                <Descriptions.Item label="Specialty">
                                    {selectedDoctor.specialty}
                                </Descriptions.Item>
                                <Descriptions.Item label="Qualifications">
                                    {selectedDoctor.qualifications}
                                </Descriptions.Item>
                                <Descriptions.Item label="Years of Experience">
                                    {selectedDoctor.yearsOfExperience}
                                </Descriptions.Item>
                                <Descriptions.Item label="Short Description">
                                    {selectedDoctor.shortDescription}
                                </Descriptions.Item>
                            </Descriptions>
                        </TabPane>
                        <TabPane tab="Experience" key="2">
                            <Table
                                columns={experienceColumns}
                                dataSource={doctorExperiences}
                                rowKey={(record) => record.id}
                                pagination={false}
                                className="experience-table"
                            />
                        </TabPane>
                        <TabPane tab="Certificates" key="3">
                            <Table
                                columns={certificateColumns}
                                dataSource={certificates}
                                rowKey={(record) => record.certificateId}
                                pagination={false}
                                className="certificate-table"
                            />
                        </TabPane>
                    </Tabs>
                )}
            </Modal>

            <style jsx="true">{`
                .doctor-management-card {
                    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                }
                
                .doctor-management-card :global(.ant-card-head) {
                    background-color: #f0f5ff;
                    border-bottom: 2px solid #1890ff;
                }

                .doctor-table :global(.ant-table-thead > tr > th) {
                    background-color: #f0f5ff;
                    font-weight: 600;
                    color: #1890ff;
                }

                .doctor-table :global(.ant-table-tbody > tr:hover > td) {
                    background-color: #f0f5ff;
                }

                .doctor-table :global(.ant-pagination) {
                    margin-top: 20px;
                    display: flex;
                    justify-content: center;
                }

                .experience-table, .certificate-table {
                    margin-top: 16px;
                }

                :global(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
                    color: #1890ff;
                }
            `}</style>
        </div>
    );
};

export default DoctorManagement; 