// Admin/transactions/index.jsx - Quản lý giao dịch cho admin
import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, Modal, Descriptions, Select, Input } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Search } = Input;

const ManageTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Dữ liệu demo transactions
  const demoTransactions = [
    {
      id: 'TXN001',
      buyerName: 'Nguyễn Văn A',
      sellerName: 'Trần Thị B',
      itemName: 'VinFast VF8 2023',
      itemType: 'Xe điện',
      amount: 850000000,
      status: 'completed',
      paymentMethod: 'banking',
      createdAt: '2024-01-15T10:30:00',
      completedAt: '2024-01-16T14:20:00',
      commission: 42500000, // 5% commission
    },
    {
      id: 'TXN002',
      buyerName: 'Lê Văn C',
      sellerName: 'Phạm Thị D',
      itemName: 'Pin LFP 60kWh',
      itemType: 'Pin xe điện',
      amount: 120000000,
      status: 'pending',
      paymentMethod: 'e-wallet',
      createdAt: '2024-01-20T09:15:00',
      completedAt: null,
      commission: 6000000,
    },
    {
      id: 'TXN003',
      buyerName: 'Hoàng Văn E',
      sellerName: 'Nguyễn Thị F',
      itemName: 'Tesla Model 3 2022',
      itemType: 'Xe điện',
      amount: 1200000000,
      status: 'cancelled',
      paymentMethod: 'banking',
      createdAt: '2024-01-18T16:45:00',
      completedAt: null,
      commission: 0,
    },
    {
      id: 'TXN004',
      buyerName: 'Vũ Thị G',
      sellerName: 'Đặng Văn H',
      itemName: 'Bộ sạc nhanh DC',
      itemType: 'Phụ kiện',
      amount: 25000000,
      status: 'completed',
      paymentMethod: 'e-wallet',
      createdAt: '2024-01-22T11:20:00',
      completedAt: '2024-01-22T15:30:00',
      commission: 1250000,
    },
  ];

  // Định nghĩa columns cho table
  const columns = [
    {
      title: 'Mã giao dịch',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: 'Người mua',
      dataIndex: 'buyerName',
      key: 'buyerName',
    },
    {
      title: 'Người bán',
      dataIndex: 'sellerName',
      key: 'sellerName',
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'itemName',
      key: 'itemName',
      ellipsis: true,
    },
    {
      title: 'Loại',
      dataIndex: 'itemType',
      key: 'itemType',
      render: (type) => {
        const colorMap = {
          'Xe điện': 'blue',
          'Pin xe điện': 'green',
          'Phụ kiện': 'orange'
        };
        return <Tag color={colorMap[type]}>{type}</Tag>;
      },
    },
    {
      title: 'Giá trị (VNĐ)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <span style={{ fontWeight: 'bold', color: '#f50' }}>
          {new Intl.NumberFormat('vi-VN').format(amount)}
        </span>
      ),
    },
    {
      title: 'Hoa hồng (VNĐ)',
      dataIndex: 'commission',
      key: 'commission',
      render: (commission) => (
        <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
          {new Intl.NumberFormat('vi-VN').format(commission)}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          'completed': { color: 'green', text: 'Hoàn thành' },
          'pending': { color: 'orange', text: 'Đang xử lý' },
          'cancelled': { color: 'red', text: 'Đã hủy' }
        };
        const statusInfo = statusMap[status];
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => handleViewTransaction(record)}
        />
      ),
    },
  ];

  // Load dữ liệu transactions
  const fetchTransactions = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTransactions(demoTransactions);
      setFilteredTransactions(demoTransactions);
      setLoading(false);
    }, 500);
  };

  // Xem chi tiết giao dịch
  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setDetailModalVisible(true);
  };

  // Lọc theo trạng thái
  const handleStatusFilter = (status) => {
    if (status === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(t => t.status === status));
    }
  };

  // Tìm kiếm
  const handleSearch = (value) => {
    const filtered = transactions.filter(t => 
      t.id.toLowerCase().includes(value.toLowerCase()) ||
      t.buyerName.toLowerCase().includes(value.toLowerCase()) ||
      t.sellerName.toLowerCase().includes(value.toLowerCase()) ||
      t.itemName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTransactions(filtered);
  };

  // Tính tổng thống kê
  const getStatistics = () => {
    const total = filteredTransactions.length;
    const completed = filteredTransactions.filter(t => t.status === 'completed').length;
    const pending = filteredTransactions.filter(t => t.status === 'pending').length;
    const cancelled = filteredTransactions.filter(t => t.status === 'cancelled').length;
    const totalRevenue = filteredTransactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalCommission = filteredTransactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.commission, 0);

    return { total, completed, pending, cancelled, totalRevenue, totalCommission };
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const stats = getStatistics();

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2>Quản lý Giao dịch</h2>
        
        {/* Thống kê tổng quan */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 16, 
          marginBottom: 16 
        }}>
          <div style={{ 
            background: '#f0f2f5', 
            padding: 16, 
            borderRadius: 8, 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
              {stats.total}
            </div>
            <div>Tổng giao dịch</div>
          </div>
          <div style={{ 
            background: '#f6ffed', 
            padding: 16, 
            borderRadius: 8, 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
              {stats.completed}
            </div>
            <div>Hoàn thành</div>
          </div>
          <div style={{ 
            background: '#fff7e6', 
            padding: 16, 
            borderRadius: 8, 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#fa8c16' }}>
              {stats.pending}
            </div>
            <div>Đang xử lý</div>
          </div>
          <div style={{ 
            background: '#fff2f0', 
            padding: 16, 
            borderRadius: 8, 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>
              {stats.cancelled}
            </div>
            <div>Đã hủy</div>
          </div>
          <div style={{ 
            background: '#e6f7ff', 
            padding: 16, 
            borderRadius: 8, 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}>
              {new Intl.NumberFormat('vi-VN').format(stats.totalRevenue)}
            </div>
            <div>Tổng doanh thu (VNĐ)</div>
          </div>
          <div style={{ 
            background: '#f6ffed', 
            padding: 16, 
            borderRadius: 8, 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: 18, fontWeight: 'bold', color: '#52c41a' }}>
              {new Intl.NumberFormat('vi-VN').format(stats.totalCommission)}
            </div>
            <div>Tổng hoa hồng (VNĐ)</div>
          </div>
        </div>

        {/* Bộ lọc và tìm kiếm */}
        <div style={{ 
          display: 'flex', 
          gap: 16, 
          marginBottom: 16, 
          alignItems: 'center' 
        }}>
          <Select
            defaultValue="all"
            style={{ width: 150 }}
            onChange={handleStatusFilter}
          >
            <Option value="all">Tất cả</Option>
            <Option value="completed">Hoàn thành</Option>
            <Option value="pending">Đang xử lý</Option>
            <Option value="cancelled">Đã hủy</Option>
          </Select>
          
          <Search
            placeholder="Tìm kiếm giao dịch..."
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
        </div>
      </div>

      <Table
        dataSource={filteredTransactions}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} giao dịch`,
        }}
      />

      {/* Modal chi tiết giao dịch */}
      <Modal
        title="Chi tiết giao dịch"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedTransaction && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Mã giao dịch" span={2}>
              {selectedTransaction.id}
            </Descriptions.Item>
            <Descriptions.Item label="Người mua">
              {selectedTransaction.buyerName}
            </Descriptions.Item>
            <Descriptions.Item label="Người bán">
              {selectedTransaction.sellerName}
            </Descriptions.Item>
            <Descriptions.Item label="Sản phẩm" span={2}>
              {selectedTransaction.itemName}
            </Descriptions.Item>
            <Descriptions.Item label="Loại sản phẩm">
              <Tag color="blue">{selectedTransaction.itemType}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              {selectedTransaction.paymentMethod === 'banking' ? 'Chuyển khoản' : 'Ví điện tử'}
            </Descriptions.Item>
            <Descriptions.Item label="Giá trị giao dịch">
              <span style={{ fontWeight: 'bold', color: '#f50' }}>
                {new Intl.NumberFormat('vi-VN').format(selectedTransaction.amount)} VNĐ
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Hoa hồng">
              <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
                {new Intl.NumberFormat('vi-VN').format(selectedTransaction.commission)} VNĐ
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={
                selectedTransaction.status === 'completed' ? 'green' :
                selectedTransaction.status === 'pending' ? 'orange' : 'red'
              }>
                {selectedTransaction.status === 'completed' ? 'Hoàn thành' :
                 selectedTransaction.status === 'pending' ? 'Đang xử lý' : 'Đã hủy'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {new Date(selectedTransaction.createdAt).toLocaleString('vi-VN')}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày hoàn thành">
              {selectedTransaction.completedAt ? 
                new Date(selectedTransaction.completedAt).toLocaleString('vi-VN') : 
                'Chưa hoàn thành'
              }
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ManageTransactions;