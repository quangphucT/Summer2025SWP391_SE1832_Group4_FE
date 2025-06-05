import { Table, Typography } from "antd";
import { useState } from "react";

const { Title } = Typography;

const TransactionMenuPage = () => {
  const [dataTransaction, setDataTransaction] = useState([
    // Demo data (bạn có thể thay bằng API call hoặc dữ liệu thực)
    { key: '1', name: 'Consultation Package', price: '500,000 VND' },
    { key: '2', name: 'Acne Treatment', price: '1,200,000 VND' },
  ]);

  // Tự động tạo STT nếu không có
  const dataWithSTT = dataTransaction.map((item, index) => ({
    ...item,
    stt: index + 1,
  }));

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '60%',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '30%',
    },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <Title level={3} className="text-center mb-6">
        Transaction History
      </Title>
      <Table
        bordered
        columns={columns}
        dataSource={dataWithSTT}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default TransactionMenuPage;
