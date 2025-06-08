import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import {
    fetchDoctorExperience,
    createNewExperience,
    updateExperienceById,
    deleteExperienceById
} from '../../../redux/feature/experienceWorkingSlice';
import dayjs from 'dayjs';

const ExperienceManagement = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { doctorExperiences, status, error, isLoading } = useSelector((state) => state.experienceWorking);
    const user = useSelector((state) => state.user);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingExperience, setEditingExperience] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.accountID) {
            console.log('Fetching experience for doctor:', user.accountID);
            dispatch(fetchDoctorExperience(user.accountID));
        }
    }, [dispatch, user]);

    const safeExperiences = Array.isArray(doctorExperiences) ? doctorExperiences : [];
    console.log('Current experiences:', safeExperiences);

    if (!user?.accountID) {
        return (
            <Result
                status="403"
                title="Access Denied"
                subTitle="Please log in to view this page"
            />
        );
    }

    if (user?.role !== 'Doctor') {
        return (
            <Result
                status="403"
                title="Access Denied"
                subTitle="You don't have permission to view this page"
            />
        );
    }

    if (status === 'failed') {
        console.error('Failed to load experiences:', error);
        return (
            <Result
                status="error"
                title="Failed to load data"
                subTitle={error || "An error occurred while loading experience data"}
                extra={[
                    <Button 
                        type="primary" 
                        key="retry" 
                        onClick={() => {
                            console.log('Retrying fetch for doctor:', user.accountID);
                            dispatch(fetchDoctorExperience(user.accountID));
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
        setEditingExperience(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        console.log('Edit record:', record);
        setEditingExperience(record);
        const formData = {
            ...record,
            fromDate: record.fromDate ? dayjs(record.fromDate) : null,
            toDate: record.toDate ? dayjs(record.toDate) : null,
            hospitalName: record.hospitalName || '',
            position: record.position || ''
        };
        console.log('Form data being set:', formData);
        form.setFieldsValue(formData);
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await dispatch(deleteExperienceById(id)).unwrap();
            message.success('Experience has been deleted successfully');
            dispatch(fetchDoctorExperience(user.accountID));
        } catch {
            message.error('Failed to delete experience');
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
                hospitalName: values.hospitalName,
                position: values.position,
                fromDate: values.fromDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                toDate: values.toDate ? values.toDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : null,
            };

            if (editingExperience) {
                console.log('Updating experience with ID:', editingExperience.id);
                const updateData = {
                    doctorId: user.accountID,
                    hospitalName: values.hospitalName,
                    position: values.position,
                    fromDate: values.fromDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                    toDate: values.toDate ? values.toDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : null,
                };
                console.log('Update payload:', updateData);
                
                try {
                    const result = await dispatch(updateExperienceById({ 
                        id: editingExperience.id,
                        data: updateData
                    })).unwrap();
                    console.log('Update result:', result);
                    
                    if (result) {
                        await dispatch(fetchDoctorExperience(user.accountID));
                        message.success('Experience has been updated successfully');
                    } else {
                        throw new Error('Update operation failed');
                    }
                } catch (updateError) {
                    console.error('Update error:', updateError);
                    message.error('Failed to update experience: ' + (updateError.message || 'An unknown error occurred'));
                    return;
                }
            } else {
                await dispatch(createNewExperience({
                    ...data,
                    doctorId: user.accountID
                })).unwrap();
                await dispatch(fetchDoctorExperience(user.accountID));
                message.success('New experience has been added successfully');
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
                if (editingExperience) {
                    setEditingExperience(null);
                }
            }
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalVisible(false);
        setEditingExperience(null);
    };

    const columns = [
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Hospital/Clinic',
            dataIndex: 'hospitalName',
            key: 'hospitalName',
        },
        {
            title: 'Start Date',
            dataIndex: 'fromDate',
            key: 'fromDate',
            render: (date) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'End Date',
            dataIndex: 'toDate',
            key: 'toDate',
            render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : 'Present',
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <Card
                title="Experience Management"
                extra={
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={handleAdd}
                        loading={loading}
                        disabled={isLoading}
                    >
                        Add Experience
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={safeExperiences}
                    loading={{ 
                        spinning: status === 'loading' || isLoading,
                        indicator: <LoadingOutlined style={{ fontSize: 24 }} spin />
                    }}
                    rowKey="id"
                    locale={{
                        emptyText: status === 'loading' ? 'Loading...' : 'No experience records found'
                    }}
                />
            </Card>

            <Modal
                title={editingExperience ? "Update Experience" : "Add New Experience"}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                maskClosable={!loading}
                closable={!loading}
                keyboard={!loading}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="position"
                        label="Position"
                        rules={[{ required: true, message: 'Please enter the position' }]}
                    >
                        <Input placeholder="Enter position" disabled={loading} />
                    </Form.Item>

                    <Form.Item
                        name="hospitalName"
                        label="Hospital/Clinic"
                        rules={[{ required: true, message: 'Please enter hospital/clinic name' }]}
                    >
                        <Input placeholder="Enter hospital/clinic name" disabled={loading} />
                    </Form.Item>

                    <Form.Item
                        name="fromDate"
                        label="Start Date"
                        rules={[{ required: true, message: 'Please select start date' }]}
                    >
                        <DatePicker 
                            format="DD/MM/YYYY" 
                            style={{ width: '100%' }}
                            disabledDate={current => current && current > dayjs().endOf('day')}
                            disabled={loading}
                        />
                    </Form.Item>

                    <Form.Item
                        name="toDate"
                        label="End Date"
                        dependencies={['fromDate']}
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const fromDate = getFieldValue('fromDate');
                                    if (!value || !fromDate) {
                                        return Promise.resolve();
                                    }
                                    if (value.isBefore(fromDate)) {
                                        return Promise.reject(new Error('End date cannot be earlier than start date'));
                                    }
                                    if (value.isAfter(dayjs())) {
                                        return Promise.reject(new Error('End date cannot be in the future'));
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
                                const fromDate = form.getFieldValue('fromDate');
                                return (
                                    (current && current > dayjs().endOf('day')) || 
                                    (fromDate && current && current.isBefore(fromDate))
                                );
                            }}
                            disabled={loading}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button 
                                type="primary" 
                                htmlType="submit"
                                loading={loading}
                                icon={loading ? <LoadingOutlined /> : null}
                                disabled={isLoading}
                            >
                                {editingExperience ? 'Update' : 'Add'}
                            </Button>
                            <Button 
                                onClick={handleCancel}
                                disabled={loading || isLoading}
                            >
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ExperienceManagement; 