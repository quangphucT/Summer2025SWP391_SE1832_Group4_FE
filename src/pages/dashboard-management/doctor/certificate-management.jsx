import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Card,
    Button,
    Table,
    Modal,
    Form,
    Input,
    DatePicker,
    Space,
    Popconfirm,
    message,
    Result,
    Tooltip,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    LoadingOutlined,
    CloseOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import {
    fetchCertificatesByDoctorId,
    createNewCertificate,
    updateCertificateById,
    deleteCertificateById,
} from '../../../redux/feature/certificateSlice';
import endPoint from '../../../routers/router';
import dayjs from 'dayjs';

const CertificateManagement = () => {
    const { doctorId } = useParams();
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { certificates, status, error, isLoading } = useSelector((state) => state.certificates);
    const user = useSelector((state) => state.user);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCertificate, setEditingCertificate] = useState(null);
    const [loading, setLoading] = useState(false);

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

        if (!doctorId) {
            message.error('Doctor ID is required');
            navigate('/dashboard/doctor-management');
            return;
        }

        console.log('Component mounted with doctorId:', doctorId); // Debug log
        dispatch(fetchCertificatesByDoctorId(doctorId));
    }, [dispatch, user, navigate, doctorId]);

    // Debug logs
    console.log('Current certificates:', certificates);
    console.log('Loading status:', status);
    console.log('Error:', error);

    const safeCertificates = Array.isArray(certificates) ? certificates : [];
    console.log('Current certificates:', safeCertificates);

    const handleBack = () => {
        navigate('/dashboard/doctor-management');
    };

    const handleAdd = () => {
        form.resetFields();
        setEditingCertificate(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        console.log('Edit record:', record);
        setEditingCertificate(record);
        const formData = {
            ...record,
            issuedDate: record.issuedDate ? dayjs(record.issuedDate) : null,
            title: record.title || '',
            issuedBy: record.issuedBy || '',
            description: record.description || ''
        };
        console.log('Form data being set:', formData);
        form.setFieldsValue(formData);
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await dispatch(deleteCertificateById(id)).unwrap();
            message.success('Certificate has been deleted successfully');
            dispatch(fetchCertificatesByDoctorId(doctorId));
        } catch (error) {
            console.error('Delete error:', error);
            message.error('Failed to delete certificate: ' + (error.message || 'An unknown error occurred'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            console.log('Form values:', values);
            console.log('Current doctorId:', doctorId); // Debug log

            const data = {
                title: values.title,
                issuedBy: values.issuedBy,
                description: values.description,
                issuedDate: values.issuedDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                doctorId: doctorId
            };

            console.log('Submitting data:', data); // Debug log

            if (editingCertificate) {
                try {
                    const result = await dispatch(updateCertificateById({ 
                        id: editingCertificate.certificateId,
                        data: {
                            ...data,
                            certificateId: editingCertificate.certificateId
                        }
                    })).unwrap();
                    
                    if (result) {
                        await dispatch(fetchCertificatesByDoctorId(doctorId));
                        message.success('Certificate has been updated successfully');
                    } else {
                        throw new Error('Update operation failed');
                    }
                } catch (updateError) {
                    console.error('Update error:', updateError);
                    message.error('Failed to update certificate: ' + (updateError.message || 'An unknown error occurred'));
                    return;
                }
            } else {
                try {
                    await dispatch(createNewCertificate(data)).unwrap();
                    await dispatch(fetchCertificatesByDoctorId(doctorId));
                    message.success('New certificate has been added successfully');
                } catch (createError) {
                    console.error('Create error:', createError);
                    message.error('Failed to create certificate: ' + (createError.message || 'An unknown error occurred'));
                    return;
                }
            }
        } catch (error) {
            console.error('Submit error:', error);
            message.error('Operation failed: ' + (error.message || 'An unknown error occurred'));
            return;
        } finally {
            setLoading(false);
            if (!error) {
                form.resetFields();
                setIsModalVisible(false);
                if (editingCertificate) {
                    setEditingCertificate(null);
                }
            }
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalVisible(false);
        setEditingCertificate(null);
    };

    // Add debug log for certificates data
    console.log('Current certificates state:', certificates);

    const columns = [
        {
            title: 'Certificate Title',
            dataIndex: 'title',
            key: 'title',
            render: (text) => text || '-',
            width: '20%'
        },
        {
            title: 'Issued By',
            dataIndex: 'issuedBy',
            key: 'issuedBy',
            render: (text) => text || '-',
            width: '15%'
        },
        {
            title: 'Issue Date',
            dataIndex: 'issuedDate',
            key: 'issuedDate',
            render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
            width: '15%'
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (text) => text || '-',
            width: '20%'
        },
        {
            title: 'Doctor Name',
            dataIndex: 'doctorName',
            key: 'doctorName',
            render: (text) => text || '-',
            width: '15%'
        },
        {
            title: 'Actions',
            key: 'action',
            width: '15%',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        size="middle"
                        title="Edit Certificate"
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this certificate?"
                        onConfirm={() => handleDelete(record.certificateId)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button 
                            danger 
                            icon={<DeleteOutlined />}
                            size="middle"
                            title="Delete Certificate"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Ensure certificates is always an array and each item has a unique key
    const certificateData = Array.isArray(certificates) ? 
        certificates.filter(cert => cert && typeof cert === 'object').map(cert => ({
            ...cert,
            key: `cert-${cert.certificateId || Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })) : [];
    console.log('Certificate data for table:', certificateData);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={handleBack}
                        className="mr-4"
                    >
                        Back to Doctors
                    </Button>
                    <h1 className="text-[#1890ff] text-3xl font-bold m-0">Certificate Management</h1>
                </div>
            </div>
            <Card
                className="certificate-management-card"
                extra={
                    <Tooltip title="Add Certificate">
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />} 
                            onClick={handleAdd}
                            loading={loading}
                            disabled={isLoading}
                            size="large"
                        />
                    </Tooltip>
                }
            >
                {status === 'failed' && (
                    <div style={{ color: 'red', marginBottom: 16 }}>
                        {error || "An error occurred while loading certificate data"}
                    </div>
                )}
                <Table
                    columns={columns}
                    dataSource={certificateData}
                    loading={{ 
                        spinning: status === 'loading' || isLoading,
                        indicator: <LoadingOutlined style={{ fontSize: 24 }} spin />
                    }}
                    rowKey={(record) => record.key}
                    locale={{
                        emptyText: status === 'loading'
                            ? 'Loading...'
                            : (status === 'failed'
                                ? 'Failed to load data'
                                : 'No certificates found')
                    }}
                    pagination={false}
                    className="certificate-table"
                />
            </Card>

            <style jsx="true">{`
                .certificate-management-card {
                    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                }
                
                .certificate-management-card :global(.ant-card-head) {
                    background-color: #f0f5ff;
                    border-bottom: 2px solid #1890ff;
                }

                .certificate-table :global(.ant-table-thead > tr > th) {
                    background-color: #f0f5ff;
                    font-weight: 600;
                    color: #1890ff;
                }

                .certificate-table :global(.ant-table-tbody > tr:hover > td) {
                    background-color: #f0f5ff;
                }

                .certificate-table :global(.ant-pagination) {
                    margin-top: 20px;
                    display: flex;
                    justify-content: center;
                }
            `}</style>

            <Modal
                title={editingCertificate ? "Update Certificate" : "Add New Certificate"}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                maskClosable={!loading}
                closable={!loading}
                keyboard={!loading}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="certificate-form"
                >
                    <Form.Item
                        name="title"
                        label="Certificate Title"
                        rules={[{ required: true, message: 'Please enter the certificate title' }]}
                    >
                        <Input placeholder="Enter certificate title" disabled={loading} />
                    </Form.Item>

                    <Form.Item
                        name="issuedBy"
                        label="Issued By"
                        rules={[{ required: true, message: 'Please enter the issuing organization' }]}
                    >
                        <Input placeholder="Enter issuing organization" disabled={loading} />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter a description' }]}
                    >
                        <Input.TextArea 
                            placeholder="Enter certificate description" 
                            disabled={loading}
                            rows={4}
                        />
                    </Form.Item>

                    <Form.Item
                        name="issuedDate"
                        label="Issue Date"
                        rules={[{ required: true, message: 'Please select issue date' }]}
                    >
                        <DatePicker 
                            format="DD/MM/YYYY" 
                            style={{ width: '100%' }}
                            disabledDate={current => current && current > dayjs().endOf('day')}
                            disabled={loading}
                        />
                    </Form.Item>

                    <Form.Item className="form-actions">
                        <Space>
                            <Button 
                                type="primary" 
                                htmlType="submit"
                                loading={loading}
                                disabled={isLoading}
                            >
                                {editingCertificate ? 'Update' : 'Add'}
                            </Button>
                            <Button 
                                onClick={handleCancel}
                                disabled={loading || isLoading}
                                icon={<CloseOutlined />}
                            />
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CertificateManagement;