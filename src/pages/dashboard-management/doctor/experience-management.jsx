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
    Result
} from 'antd';
import {
    fetchDoctorExperience,
    createNewExperience,
    updateExperienceById,
    deleteExperienceById
} from '../../../redux/feature/experienceWorkingSlice';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const ExperienceManagement = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { doctorExperiences, status, error } = useSelector((state) => state.experienceWorking);
    const { user } = useSelector((state) => state.user || { user: null });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingExperience, setEditingExperience] = useState(null);

    useEffect(() => {
        // Kiểm tra nếu không có user hoặc không phải là bác sĩ
        if (!user) {
            message.error('Vui lòng đăng nhập để truy cập trang này');
            navigate('/login-page');
            return;
        }

        // Nếu có user và là bác sĩ, fetch dữ liệu
        dispatch(fetchDoctorExperience(user.id));
    }, [dispatch, user, navigate]);

    const handleAdd = () => {
        if (!user) {
            message.error('Vui lòng đăng nhập để thực hiện chức năng này');
            return;
        }
        form.resetFields();
        setEditingExperience(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        if (!user) {
            message.error('Vui lòng đăng nhập để thực hiện chức năng này');
            return;
        }
        setEditingExperience(record);
        form.setFieldsValue({
            ...record,
            fromDate: dayjs(record.fromDate),
            toDate: record.toDate ? dayjs(record.toDate) : null,
            hospitalName: record.hospitalName,
            position: record.position
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        if (!user) {
            message.error('Vui lòng đăng nhập để thực hiện chức năng này');
            return;
        }
        try {
            await dispatch(deleteExperienceById(id)).unwrap();
            message.success('Xóa kinh nghiệm làm việc thành công');
        } catch {
            message.error('Xóa kinh nghiệm làm việc thất bại');
        }
    };

    const handleSubmit = async (values) => {
        if (!user) {
            message.error('Vui lòng đăng nhập để thực hiện chức năng này');
            return;
        }
        try {
            const data = {
                doctorId: user.id,
                hospitalName: values.hospitalName,
                position: values.position,
                fromDate: values.fromDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                toDate: values.toDate ? values.toDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : null,
            };

            if (editingExperience) {
                await dispatch(updateExperienceById({ id: editingExperience.id, data })).unwrap();
                message.success('Cập nhật kinh nghiệm làm việc thành công');
            } else {
                await dispatch(createNewExperience(data)).unwrap();
                message.success('Thêm kinh nghiệm làm việc thành công');
            }
            setIsModalVisible(false);
        } catch {
            message.error('Thao tác thất bại');
        }
    };

    const columns = [
        {
            title: 'Vị trí',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Bệnh viện/Phòng khám',
            dataIndex: 'hospitalName',
            key: 'hospitalName',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'fromDate',
            key: 'fromDate',
            render: (date) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'toDate',
            key: 'toDate',
            render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : 'Hiện tại',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger icon={<DeleteOutlined />}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Nếu không có user, hiển thị thông báo
    if (!user) {
        return (
            <Result
                status="403"
                title="Không có quyền truy cập"
                subTitle="Vui lòng đăng nhập để truy cập trang này"
                extra={
                    <Button type="primary" onClick={() => navigate('/login-page')}>
                        Đăng nhập
                    </Button>
                }
            />
        );
    }

    if (error) {
        return (
            <Result
                status="error"
                title="Đã có lỗi xảy ra"
                subTitle="Không thể tải dữ liệu kinh nghiệm làm việc"
                extra={
                    <Button type="primary" onClick={() => dispatch(fetchDoctorExperience(user.id))}>
                        Thử lại
                    </Button>
                }
            />
        );
    }

    return (
        <div className="p-6">
            <Card
                title="Quản lý kinh nghiệm làm việc"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Thêm kinh nghiệm
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={doctorExperiences}
                    loading={status === 'loading'}
                    rowKey="id"
                />
            </Card>

            <Modal
                title={editingExperience ? "Cập nhật kinh nghiệm làm việc" : "Thêm kinh nghiệm làm việc"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="position"
                        label="Vị trí"
                        rules={[{ required: true, message: 'Vui lòng nhập vị trí' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="hospitalName"
                        label="Bệnh viện/Phòng khám"
                        rules={[{ required: true, message: 'Vui lòng nhập tên bệnh viện/phòng khám' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="fromDate"
                        label="Ngày bắt đầu"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                    >
                        <DatePicker format="DD/MM/YYYY" />
                    </Form.Item>

                    <Form.Item
                        name="toDate"
                        label="Ngày kết thúc"
                    >
                        <DatePicker format="DD/MM/YYYY" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingExperience ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ExperienceManagement; 