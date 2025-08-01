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
    Spin,
    Tooltip
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
    fetchDoctorExperience,
    createNewExperience,
    updateExperienceById,
    deleteExperienceById
} from '../../../redux/feature/experienceWorkingSlice';
import endPoint from '../../../routers/router';
import dayjs from 'dayjs';

const ExperienceManagement = () => {
    const { doctorId } = useParams();
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { doctorExperiences, status, error, isLoading } = useSelector((state) => state.experienceWorking);
    const user = useSelector((state) => state.user);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingExperience, setEditingExperience] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortedExperiences, setSortedExperiences] = useState([]);

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

        dispatch(fetchDoctorExperience(doctorId));
    }, [dispatch, user, navigate, doctorId]);

    useEffect(() => {
        const sorted = [...doctorExperiences].sort((a, b) => {
            const aDate = dayjs(a.fromDate);
            const bDate = dayjs(b.fromDate);
            return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
        });
        setSortedExperiences(sorted);
    }, [doctorExperiences, sortOrder]);

    const safeExperiences = Array.isArray(doctorExperiences) ? doctorExperiences : [];
    console.log('Current experiences:', safeExperiences);

    const handleBack = () => {
        navigate('/dashboard/doctor-management');
    };

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
                            console.log('Retrying fetch for doctor:', doctorId);
                            dispatch(fetchDoctorExperience(doctorId));
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
            dispatch(fetchDoctorExperience(doctorId));
        } catch (error) {
            console.error('Delete error:', error);
            message.error('Failed to delete experience: ' + (error.message || 'An unknown error occurred'));
        } finally {
            setLoading(false);
        }
    };

    const isOverlap = (newFrom, newTo, existingFrom, existingTo) => {
        const newFromDate = dayjs(newFrom);
        const newToDate = newTo ? dayjs(newTo) : dayjs();
        const existFromDate = dayjs(existingFrom);
        const existToDate = existingTo ? dayjs(existingTo) : dayjs();
        return (
            newFromDate.isBefore(existToDate) &&
            existFromDate.isBefore(newToDate)
        );
    };

    const getDisabledDates = (excludeId = null) => {
        return safeExperiences
            .filter(exp => !excludeId || exp.id !== excludeId)
            .map(exp => ({
                from: dayjs(exp.fromDate).valueOf(),
                to: exp.toDate ? dayjs(exp.toDate).valueOf() : dayjs().valueOf()
            }));
    };

    const isDateInAnyRange = (date, excludeId = null) => {
        if (!date) return false;
        const timestamp = dayjs(date).valueOf();
        const ranges = getDisabledDates(excludeId);
        return ranges.some(range =>
            timestamp >= range.from && timestamp <= range.to
        );
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const newFrom = values.fromDate;
            const newTo = values.toDate;
            const overlap = safeExperiences.some(exp => {
                if (editingExperience && exp.id === editingExperience.id) return false;
                return isOverlap(newFrom, newTo, exp.fromDate, exp.toDate);
            });
            if (overlap) {
                message.error('Khoảng thời gian này bị trùng với một kinh nghiệm khác!');
                setLoading(false);
                return;
            }
            console.log('Form values:', values);
            const data = {
                doctorId: doctorId,
                hospitalName: values.hospitalName,
                position: values.position,
                fromDate: values.fromDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                toDate: values.toDate ? values.toDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : null,
            };

            if (editingExperience) {
                console.log('Updating experience with ID:', editingExperience.id);
                try {
                    const result = await dispatch(updateExperienceById({ 
                        id: editingExperience.id,
                        data: data
                    })).unwrap();
                    console.log('Update result:', result);
                    
                    if (result) {
                        await dispatch(fetchDoctorExperience(doctorId));
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
                await dispatch(createNewExperience(data)).unwrap();
                await dispatch(fetchDoctorExperience(doctorId));
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
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={handleBack}
                        className="mr-4"
                    >
                        Back to Doctors
                    </Button>
                    <h1 className="text-[#1890ff] text-3xl font-bold m-0">Experience Management</h1>
                </div>
                <Button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                    Sắp xếp {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
            </div>
            <Card
                className="experience-management-card"
                extra={
                    <Tooltip title="Add Experience">
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
                    dataSource={sortedExperiences}
                    loading={{ 
                        spinning: status === 'loading' || isLoading,
                        indicator: <LoadingOutlined style={{ fontSize: 24 }} spin />
                    }}
                    rowKey={record => record.key || record.id}
                    locale={{
                        emptyText: status === 'loading' ? 'Loading...' : 'No experience records found'
                    }}
                    pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} items`,
                        className: 'flex justify-center',
                        position: ['bottomCenter']
                    }}
                    className="experience-table"
                />
            </Card>

            <style jsx="true">{`
                .experience-management-card {
                    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                }
                
                .experience-management-card :global(.ant-card-head) {
                    background-color: #f0f5ff;
                    border-bottom: 2px solid #1890ff;
                }

                .experience-table :global(.ant-table-thead > tr > th) {
                    background-color: #f0f5ff;
                    font-weight: 600;
                    color: #1890ff;
                }

                .experience-table :global(.ant-table-tbody > tr:hover > td) {
                    background-color: #f0f5ff;
                }

                .experience-table :global(.ant-pagination) {
                    margin-top: 20px;
                    display: flex;
                    justify-content: center;
                }
            `}</style>

            <Modal
                title={editingExperience ? "Update Experience" : "Add New Experience"}
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
                    className="experience-form"
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
                            disabledDate={current => {
                                return (
                                    current && (
                                        current > dayjs().endOf('day') ||
                                        isDateInAnyRange(current, editingExperience?.id)
                                    )
                                );
                            }}
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
                                    current && (
                                        current > dayjs().endOf('day') ||
                                        (fromDate && current.isBefore(fromDate)) ||
                                        isDateInAnyRange(current, editingExperience?.id)
                                    )
                                );
                            }}
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
                                {editingExperience ? 'Update' : 'Add'}
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

export default ExperienceManagement; 