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
    DatePicker,
    Space,
    Popconfirm,
    message,
    Result,
    Spin,
    Tooltip,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    LoadingOutlined,
    CloseOutlined,
} from '@ant-design/icons';
import {
    fetchCertificates,
    createNewCertificate,
    updateCertificateById,
    deleteCertificateById,
    setPagination
} from '../../../redux/feature/certificateSlice';
import endPoint from '../../../routers/router';
import dayjs from 'dayjs';

const CertificateManagement = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { certificates, status, error, isLoading, pagination } = useSelector((state) => state.certificates);
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

        if (user?.role !== 'Doctor') {
            message.error('You don\'t have permission to access this page');
            navigate('/'); // Navigate to home or previous page
            return;
        }

        dispatch(fetchCertificates());
    }, [dispatch, user, navigate]);

    const safeCertificates = Array.isArray(certificates) ? certificates : [];
    console.log('Current certificates:', safeCertificates);

    if (status === 'failed') {
        console.error('Failed to load certificates:', error);
        return (
            <Result
                status="error"
                title="Failed to load data"
                subTitle={error || "An error occurred while loading certificate data"}
                extra={[
                    <Button 
                        type="primary" 
                        key="retry" 
                        onClick={() => {
                            console.log('Retrying fetch for doctor:', user.accountID);
                            dispatch(fetchCertificates());
                        }}
                    >
                        Try Again
                    </Button>
                ]}
            />
        );
    }

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
            dispatch(fetchCertificates());
        } catch {
            message.error('Failed to delete certificate');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            console.log('Form values:', values);
            const data = {
                doctorId: user.accountID,
                title: values.title,
                issuedBy: values.issuedBy,
                description: values.description,
                issuedDate: values.issuedDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : null,
                doctor: {
                    doctorId: user.accountID,
                    fullName: user.fullName,
                    specialty: user.specialty || null,
                    qualifications: user.qualifications || null,
                    yearsOfExperience: user.yearsOfExperience || null,
                    description: user.description || null
                }
            };

            if (editingCertificate) {
                console.log('Updating certificate with ID:', editingCertificate.id);
                try {
                    const result = await dispatch(updateCertificateById({ 
                        id: editingCertificate.id,
                        data: data
                    })).unwrap();
                    console.log('Update result:', result);
                    
                    if (result) {
                        await dispatch(fetchCertificates());
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
                await dispatch(createNewCertificate(data)).unwrap();
                await dispatch(fetchCertificates());
                message.success('New certificate has been added successfully');
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

    const columns = [
        {
            title: 'Certificate Title',
            dataIndex: 'title',
            key: 'title',
            render: (text) => text || '-',
        },
        {
            title: 'Issued By',
            dataIndex: 'issuedBy',
            key: 'issuedBy',
            render: (text) => text || '-',
        },
        {
            title: 'Issue Date',
            dataIndex: 'issuedDate',
            key: 'issuedDate',
            render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
        },
        {
            title: 'Expiry Date',
            dataIndex: 'expiryDate',
            key: 'expiryDate',
            render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : 'No Expiry',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (text) => text || '-',
        },
        {
            title: 'Doctor Name',
            dataIndex: 'doctorName',
            key: 'doctorName',
            render: (text) => text || '-',
        },
        {
            title: 'Actions',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <Space size="small" key={`actions-${record.key}`}>
                    <Button
                        key={`edit-${record.key}`}
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        size="middle"
                    />
                    <Popconfirm
                        key={`delete-${record.key}`}
                        title="Are you sure you want to delete?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button 
                            danger 
                            icon={<DeleteOutlined />}
                            size="middle"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-[#1890ff] text-3xl font-bold mb-6">Certificate Management</h1>
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
                <Table
                    columns={columns}
                    dataSource={safeCertificates}
                    loading={{ 
                        spinning: status === 'loading' || isLoading,
                        indicator: <LoadingOutlined style={{ fontSize: 24 }} spin />
                    }}
                    rowKey={record => record.key || record.id}
                    locale={{
                        emptyText: status === 'loading' ? 'Loading...' : 'No certificates found'
                    }}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        onChange: (page, pageSize) => {
                            dispatch(setPagination({ current: page, pageSize }));
                        },
                        className: 'flex justify-center',
                        position: ['bottomCenter']
                    }}
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

                    <Form.Item
                        name="expiryDate"
                        label="Expiry Date"
                        dependencies={['issuedDate']}
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const issuedDate = getFieldValue('issuedDate');
                                    if (!value || !issuedDate) {
                                        return Promise.resolve();
                                    }
                                    if (value.isBefore(issuedDate)) {
                                        return Promise.reject(new Error('Expiry date cannot be earlier than issue date'));
                                    }
                                    return Promise.resolve();
                                }
                            })
                        ]}
                    >
                        <DatePicker 
                            format="DD/MM/YYYY" 
                            style={{ width: '100%' }}
                            disabledDate={current => {
                                const issuedDate = form.getFieldValue('issuedDate');
                                return issuedDate && current && current.isBefore(issuedDate);
                            }}
                            disabled={loading}
                            placeholder="Leave empty if no expiry date"
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
