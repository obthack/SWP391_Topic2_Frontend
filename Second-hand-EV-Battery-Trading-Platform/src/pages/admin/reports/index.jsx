// Admin/reports/index.jsx - Báo cáo và thống kê cho admin
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Select, DatePicker, Space } from 'antd';
import { 
  DollarOutlined, 
  ShoppingCartOutlined, 
  UserOutlined, 
  CarOutlined,
  TrendingUpOutlined,
  TrendingDownOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const AdminReports = () => {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month');

  // Dữ liệu demo cho báo cáo
  const reportData = {
    overview: {
      totalRevenue: 2195000000,
      totalCommission: 109750000,
      totalTransactions: 156,
      totalUsers: 1247,
      totalListings: 89,
      activeListings: 67,
    },
    revenueGrowth: 15.3,
    transactionGrowth: 8.7,
    userGrowth: 12.1,
    topCategories: [
      { category: 'Xe điện', transactions: 45, revenue: 1850000000, percentage: 84.3 },
      { category: 'Pin xe điện', transactions: 23, revenue: 280000000, percentage: 12.8 },
      { category: 'Phụ kiện', transactions: 12, revenue: 65000000, percentage: 2.9 },
    ],
    monthlyData: [
      { month: 'T1', revenue: 180000000, transactions: 12, users: 45 },
      { month: 'T2', revenue: 220000000, transactions: 15, users: 52 },
      { month: 'T3', revenue: 195000000, transactions: 13, users: 38 },
      { month: 'T4', revenue: 250000000, transactions: 18, users: 61 },
      { month: 'T5', revenue: 280000000, transactions: 21, users: 73 },
      { month: 'T6', revenue: 320000000, transactions: 25, users: 89 },
    ],
    topSellers: [
      { name: 'Nguyễn Văn A', transactions: 8, revenue: 450000000 },
      { name: 'Trần Thị B', transactions: 6, revenue: 380000000 },
      { name: 'Lê Văn C', transactions: 5, revenue: 290000000 },
      { name: 'Phạm Thị D', transactions: 4, revenue: 220000000 },
      { name: 'Hoàng Văn E', transactions: 3, revenue: 180000000 },
    ]
  };

  // Columns cho bảng top sellers
  const topSellersColumns = [
    {
      title: 'Xếp hạng',
      key: 'rank',
      width: 80,
      render: (_, __, index) => (
        <span style={{ 
          fontWeight: 'bold', 
          color: index === 0 ? '#gold' : index === 1 ? '#silver' : index === 2 ? '#bronze' : '#666'
        }}>
          #{index + 1}
        </span>
      ),
    },
    {
      title: 'Người bán',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số giao dịch',
      dataIndex: 'transactions',
      key: 'transactions',
      align: 'center',
    },
    {
      title: 'Doanh thu (VNĐ)',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => (
        <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
          {new Intl.NumberFormat('vi-VN').format(revenue)}
        </span>
      ),
    },
  ];

  // Columns cho bảng danh mục
  const categoryColumns = [
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Số giao dịch',
      dataIndex: 'transactions',
      key: 'transactions',
      align: 'center',
    },
    {
      title: 'Doanh thu (VNĐ)',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => (
        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
          {new Intl.NumberFormat('vi-VN').format(revenue)}
        </span>
      ),
    },
    {
      title: 'Tỷ lệ (%)',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage) => `${percentage}%`,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Báo cáo & Thống kê</h2>
        <Space>
          <Select
            value={timeRange}
            onChange={setTimeRange}
            style={{ width: 120 }}
          >
            <Option value="week">Tuần này</Option>
            <Option value="month">Tháng này</Option>
            <Option value="quarter">Quý này</Option>
            <Option value="year">Năm này</Option>
          </Select>
          <RangePicker />
        </Space>
      </div>

      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={reportData.overview.totalRevenue}
              formatter={(value) => new Intl.NumberFormat('vi-VN').format(value)}
              suffix="VNĐ"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              <TrendingUpOutlined style={{ color: '#3f8600' }} /> +{reportData.revenueGrowth}% so với kỳ trước
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng hoa hồng"
              value={reportData.overview.totalCommission}
              formatter={(value) => new Intl.NumberFormat('vi-VN').format(value)}
              suffix="VNĐ"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              Tỷ lệ hoa hồng: 5%
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng giao dịch"
              value={reportData.overview.totalTransactions}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              <TrendingUpOutlined style={{ color: '#3f8600' }} /> +{reportData.transactionGrowth}% so với kỳ trước
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={reportData.overview.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              <TrendingUpOutlined style={{ color: '#3f8600' }} /> +{reportData.userGrowth}% so với kỳ trước
            </div>
          </Card>
        </Col>
      </Row>

      {/* Thống kê tin đăng */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Tổng tin đăng"
              value={reportData.overview.totalListings}
              prefix={<CarOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Tin đăng đang hoạt động"
              value={reportData.overview.activeListings}
              prefix={<CarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ và bảng thống kê */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Top người bán" style={{ height: 400 }}>
            <Table
              dataSource={reportData.topSellers}
              columns={topSellersColumns}
              pagination={false}
              size="small"
              rowKey="name"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Thống kê theo danh mục" style={{ height: 400 }}>
            <Table
              dataSource={reportData.topCategories}
              columns={categoryColumns}
              pagination={false}
              size="small"
              rowKey="category"
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ doanh thu theo tháng (placeholder) */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="Biểu đồ doanh thu theo tháng">
            <div style={{ 
              height: 300, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: '#fafafa',
              border: '2px dashed #d9d9d9',
              borderRadius: 6
            }}>
              <div style={{ textAlign: 'center', color: '#999' }}>
                <TrendingUpOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>Biểu đồ doanh thu sẽ được hiển thị ở đây</div>
                <div style={{ fontSize: 12, marginTop: 8 }}>
                  (Có thể tích hợp Chart.js hoặc Recharts)
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminReports;