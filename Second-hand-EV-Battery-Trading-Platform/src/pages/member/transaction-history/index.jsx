// Member/transaction-history/index.jsx - Lịch sử giao dịch của member
import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Tag, 
  Button, 
  Modal, 
  Descriptions, 
  Rate, 
  Input, 
  Select,
  Space,
  Card,
  Row,
  Col
} from 'antd';
import { EyeOutlined, StarOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const { TextArea } = Input;
const { Option } = Select;

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  // Dữ liệu demo transactions của user hiện tại
  const demoTransactions = [
    {
      id: 'TXN001',
      type: 'buy', // buy hoặc sell
      itemName: 'VinFast VF8 2023',
      itemImage: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=400',
      otherParty: 'Nguyễn Văn A', // Người bán (nếu mình mua) hoặc người mua (nếu mình bán)
      amount: 850000000,
      status: 'completed',
      paymentMethod: 'banking',
      createdAt: '2024-01-15T10:30:00',
      completedAt: '2024-01-16T14:20:00',
      hasReviewed: true,
      myReview: {
        rating: 5,
        comment: 'Xe đúng như mô tả, người bán rất uy tín!'
      }
    },
    {
      id: 'TXN002',
      type: 'sell',
      itemName: 'Pin LFP 60kWh',
      itemImage: 'https://images.pexels.com/photos/4254557/pexels-photo-4254557.jpeg?auto=compress&cs=tinysrgb&w=400',
      otherParty: 'Trần Thị B',
      amount: 120000000,
      status: 'pending',
      paymentMethod: 'e-wallet',
      createdAt: '2024-01-20T09:15:00',
      completedAt: null,
      hasReviewed: false,
    },
    {
      id: 'TXN003',
      type: 'buy',
      itemName: 'Bộ sạc nhanh DC 50kW',
      itemImage: 'https://images.pexels.com/photos/7078666/pexels-photo-7078666.jpeg?auto=compress&cs=tinysrgb&w=400',
      otherParty: 'Lê Văn C',
      amount: 25000000,
      status: 'completed',
      paymentMethod: 'banking',
      createdAt: '2024-01-18T16:45:00',
      completedAt: '2024-01-19T10:30:00',
      hasReviewed: false,
    },
    {
      id: 'TXN004',
      type: 'sell',
      itemName: 'Tesla Model 3 2022',
      itemImage: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=400',
      otherParty: 'Phạm Thị D',
      amount: 1200000000,
      status: 'cancelled',
      paymentMethod: 'banking',
      createdAt: '2024-01-12T11:20:00',
      completedAt: null,
      hasReviewed: false,
    },
  ];

  // Định nghĩa columns cho table
  const columns = [
    {
      title: 'Mã GD',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type) => (
        <Tag color={type === 'buy' ? 'green' : 'blue'}>
          {type === 'buy' ? 'Mua' : 'Bán'}
        </Tag>
      ),
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'itemName',
      key: 'itemName',
      ellipsis: true,
    },
    {
      title: 'Đối tác',
      dataIndex: 'otherParty',
      key: 'otherParty',
      render: (name, record) => (
        <div>
          <div>{name}</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {record.type === 'buy' ? 'Người bán' : 'Người mua'}
          </div>
        </div>
      ),
    },
    {
      title: 'Số tiền (VNĐ)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <span style={{ fontWeight: 'bold', color: '#f50' }}>
          {new Intl.NumberFormat('vi-VN').format(amount)}
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
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetail(record)}
          />
          {record.status === 'completed' && !record.hasReviewed && (
            <Button
              icon={<StarOutlined />}
              size="small"
              onClick={() => handleReview(record)}
            >
              Đánh giá
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Load dữ liệu
  const fetchTransactions = () => {
    setLoading(true);
    setTimeout(() => {
      setTransactions(demoTransactions);
      setFilteredTransactions(demoTransactions);
      setLoading(false);
    }, 500);
  };

  // Xem chi tiết giao dịch
  const handleViewDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setDetailModalVisible(true);
  };

  // Mở modal đánh giá
  const handleReview = (transaction) => {
    setSelectedTransaction(transaction);
    setReviewData({ rating: 5, comment: '' });
    setReviewModalVisible(true);
  };

  // Gửi đánh giá
  const handleSubmitReview = () => {
    // Cập nhật trạng thái đã đánh giá
    setTransactions(transactions.map(t => 
      t.id === selectedTransaction.id 
        ? { ...t, hasReviewed: true, myReview: reviewData }
        : t
    ));
    setFilteredTransactions(filteredTransactions.map(t => 
      t.id === selectedTransaction.id 
        ? { ...t, hasReviewed: true, myReview: reviewData }
        : t
    ));
    
    setReviewModalVisible(false);
    toast.success('Đánh giá đã được gửi thành công!');
  };

  // Lọc theo trạng thái
  const handleStatusFilter = (status) => {
    if (status === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(t => t.status === status));
    }
  };

  // Lọc theo loại giao dịch
  const handleTypeFilter = (type) => {
    if (type === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(t => t.type === type));
    }
  };

  // Thống kê
  const getStatistics = () => {
    const totalBuy = transactions.filter(t => t.type === 'buy' && t.status === 'completed').length;
    const totalSell = transactions.filter(t => t.type === 'sell' && t.status === 'completed').length;
    const totalSpent = transactions
      .filter(t => t.type === 'buy' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalEarned = transactions
      .filter(t => t.type === 'sell' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    const pending = transactions.filter(t => t.status === 'pending').length;

    return { totalBuy, totalSell, totalSpent, totalEarned, pending };
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const stats = getStatistics();

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2>Lịch sử giao dịch</h2>
        
        {/* Thống kê tổng quan */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                  {stats.totalBuy}
                </div>
                <div>Đã mua</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                  {stats.totalSell}
                </div>
                <div>Đã bán</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 'bold', color: '#f50' }}>
                  {new Intl.NumberFormat('vi-VN').format(stats.totalSpent)}
                </div>
                <div>Tổng chi (VNĐ)</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 'bold', color: '#52c41a' }}>
                  {new Intl.NumberFormat('vi-VN').format(stats.totalEarned)}
                </div>
                <div>Tổng thu (VNĐ)</div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Bộ lọc */}
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
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="completed">Hoàn thành</Option>
            <Option value="pending">Đang xử lý</Option>
            <Option value="cancelled">Đã hủy</Option>
          </Select>
          
          <Select
            defaultValue="all"
            style={{ width: 150 }}
            onChange={handleTypeFilter}
          >
            <Option value="all">Tất cả loại</Option>
            <Option value="buy">Mua</Option>
            <Option value="sell">Bán</Option>
          </Select>
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
            <Descriptions.Item label="Loại giao dịch">
              <Tag color={selectedTransaction.type === 'buy' ? 'green' : 'blue'}>
                {selectedTransaction.type === 'buy' ? 'Mua' : 'Bán'}
              </Tag>
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
            <Descriptions.Item label="Sản phẩm" span={2}>
              {selectedTransaction.itemName}
            </Descriptions.Item>
            <Descriptions.Item label={selectedTransaction.type === 'buy' ? 'Người bán' : 'Người mua'}>
              {selectedTransaction.otherParty}
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              {selectedTransaction.paymentMethod === 'banking' ? 'Chuyển khoản' : 'Ví điện tử'}
            </Descriptions.Item>
            <Descriptions.Item label="Số tiền">
              <span style={{ fontWeight: 'bold', color: '#f50' }}>
                {new Intl.NumberFormat('vi-VN').format(selectedTransaction.amount)} VNĐ
              </span>
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
            {selectedTransaction.hasReviewed && selectedTransaction.myReview && (
              <>
                <Descriptions.Item label="Đánh giá của tôi" span={2}>
                  <div>
                    <Rate disabled value={selectedTransaction.myReview.rating} />
                    <div style={{ marginTop: 8 }}>
                      {selectedTransaction.myReview.comment}
                    </div>
                  </div>
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Modal đánh giá */}
      <Modal
        title="Đánh giá giao dịch"
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        onOk={handleSubmitReview}
        okText="Gửi đánh giá"
        cancelText="Hủy"
      >
        {selectedTransaction && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <strong>Giao dịch:</strong> {selectedTransaction.itemName}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>{selectedTransaction.type === 'buy' ? 'Người bán' : 'Người mua'}:</strong> {selectedTransaction.otherParty}
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>Đánh giá:</div>
              <Rate 
                value={reviewData.rating} 
                onChange={(value) => setReviewData({ ...reviewData, rating: value })}
              />
            </div>
            
            <div>
              <div style={{ marginBottom: 8 }}>Nhận xét:</div>
              <TextArea
                rows={4}
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                placeholder="Chia sẻ trải nghiệm của bạn về giao dịch này..."
                maxLength={500}
                showCount
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TransactionHistory;