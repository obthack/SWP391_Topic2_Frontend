// Member/my-listings/index.jsx - Quản lý tin đăng của member
import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Tag, 
  Space, 
  Modal, 
  Image, 
  Descriptions,
  Popconfirm,
  Select,
  Input
} from 'antd';
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PauseCircleOutlined,
  PlayCircleOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { toast } from 'react-toastify';

const { Option } = Select;
const { Search } = Input;

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Dữ liệu demo listings của user hiện tại
  const demoListings = [
    {
      id: 1,
      name: 'VinFast VF8 2023',
      category: 'Xe điện',
      price: 850000000,
      status: 'active',
      views: 245,
      favorites: 12,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'VinFast VF8 2023 màu trắng, đi ít, bảo hành còn 2 năm.',
      year: 2023,
      mileage: 5000,
      condition: 'Như mới',
      batteryCapacity: 87.7,
    },
    {
      id: 2,
      name: 'Pin LFP 60kWh',
      category: 'Pin xe điện',
      price: 120000000,
      status: 'pending',
      views: 89,
      favorites: 5,
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20',
      image: 'https://images.pexels.com/photos/4254557/pexels-photo-4254557.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Pin LFP 60kWh mới 100%, chưa sử dụng.',
      year: 2023,
      mileage: 0,
      condition: 'Mới',
      batteryCapacity: 60,
    },
    {
      id: 3,
      name: 'Bộ sạc nhanh DC 50kW',
      category: 'Phụ kiện',
      price: 25000000,
      status: 'paused',
      views: 156,
      favorites: 8,
      createdAt: '2024-01-18',
      updatedAt: '2024-01-25',
      image: 'https://images.pexels.com/photos/7078666/pexels-photo-7078666.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Bộ sạc nhanh DC 50kW, sử dụng 6 tháng.',
      year: 2023,
      mileage: 0,
      condition: 'Như mới',
      batteryCapacity: 0,
    },
    {
      id: 4,
      name: 'Tesla Model 3 2022',
      category: 'Xe điện',
      price: 1200000000,
      status: 'sold',
      views: 432,
      favorites: 28,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-28',
      image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Tesla Model 3 2022, xe nhập khẩu chính hãng.',
      year: 2022,
      mileage: 15000,
      condition: 'Tốt',
      batteryCapacity: 75,
    },
  ];

  // Định nghĩa columns cho table
  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image) => (
        <Image
          width={50}
          height={50}
          src={image}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <span style={{ fontWeight: 'bold', color: '#f50' }}>
          {new Intl.NumberFormat('vi-VN').format(price)}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          'active': { color: 'green', text: 'Đang bán' },
          'pending': { color: 'orange', text: 'Chờ duyệt' },
          'paused': { color: 'default', text: 'Tạm ngưng' },
          'sold': { color: 'red', text: 'Đã bán' },
          'rejected': { color: 'red', text: 'Bị từ chối' }
        };
        const statusInfo = statusMap[status];
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
      align: 'center',
    },
    {
      title: 'Yêu thích',
      dataIndex: 'favorites',
      key: 'favorites',
      align: 'center',
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetail(record)}
          />
          {record.status !== 'sold' && (
            <>
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEdit(record)}
              />
              {record.status === 'active' ? (
                <Button
                  icon={<PauseCircleOutlined />}
                  size="small"
                  onClick={() => handlePause(record.id)}
                />
              ) : record.status === 'paused' && (
                <Button
                  icon={<PlayCircleOutlined />}
                  size="small"
                  onClick={() => handleResume(record.id)}
                />
              )}
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa tin đăng này?"
                onConfirm={() => handleDelete(record.id)}
                okText="Có"
                cancelText="Không"
              >
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  // Load dữ liệu
  const fetchListings = () => {
    setLoading(true);
    setTimeout(() => {
      setListings(demoListings);
      setFilteredListings(demoListings);
      setLoading(false);
    }, 500);
  };

  // Xem chi tiết
  const handleViewDetail = (listing) => {
    setSelectedListing(listing);
    setDetailModalVisible(true);
  };

  // Chỉnh sửa
  const handleEdit = (listing) => {
    toast.info('Chức năng chỉnh sửa sẽ được phát triển trong phiên bản tiếp theo');
  };

  // Tạm ngưng tin đăng
  const handlePause = (id) => {
    setListings(listings.map(item => 
      item.id === id ? { ...item, status: 'paused' } : item
    ));
    setFilteredListings(filteredListings.map(item => 
      item.id === id ? { ...item, status: 'paused' } : item
    ));
    toast.success('Đã tạm ngưng tin đăng');
  };

  // Tiếp tục tin đăng
  const handleResume = (id) => {
    setListings(listings.map(item => 
      item.id === id ? { ...item, status: 'active' } : item
    ));
    setFilteredListings(filteredListings.map(item => 
      item.id === id ? { ...item, status: 'active' } : item
    ));
    toast.success('Đã kích hoạt lại tin đăng');
  };

  // Xóa tin đăng
  const handleDelete = (id) => {
    setListings(listings.filter(item => item.id !== id));
    setFilteredListings(filteredListings.filter(item => item.id !== id));
    toast.success('Đã xóa tin đăng');
  };

  // Lọc theo trạng thái
  const handleStatusFilter = (status) => {
    if (status === 'all') {
      setFilteredListings(listings);
    } else {
      setFilteredListings(listings.filter(item => item.status === status));
    }
  };

  // Tìm kiếm
  const handleSearch = (value) => {
    const filtered = listings.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase()) ||
      item.category.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredListings(filtered);
  };

  // Thống kê
  const getStatistics = () => {
    const total = listings.length;
    const active = listings.filter(item => item.status === 'active').length;
    const pending = listings.filter(item => item.status === 'pending').length;
    const sold = listings.filter(item => item.status === 'sold').length;
    const totalViews = listings.reduce((sum, item) => sum + item.views, 0);
    const totalFavorites = listings.reduce((sum, item) => sum + item.favorites, 0);

    return { total, active, pending, sold, totalViews, totalFavorites };
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const stats = getStatistics();

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2>Tin đăng của tôi</h2>
        
        {/* Thống kê */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
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
            <div>Tổng tin đăng</div>
          </div>
          <div style={{ 
            background: '#f6ffed', 
            padding: 16, 
            borderRadius: 8, 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
              {stats.active}
            </div>
            <div>Đang bán</div>
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
            <div>Chờ duyệt</div>
          </div>
          <div style={{ 
            background: '#fff2f0', 
            padding: 16, 
            borderRadius: 8, 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>
              {stats.sold}
            </div>
            <div>Đã bán</div>
          </div>
          <div style={{ 
            background: '#e6f7ff', 
            padding: 16, 
            borderRadius: 8, 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
              {stats.totalViews}
            </div>
            <div>Lượt xem</div>
          </div>
          <div style={{ 
            background: '#f6ffed', 
            padding: 16, 
            borderRadius: 8, 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#52c41a' }}>
              {stats.totalFavorites}
            </div>
            <div>Yêu thích</div>
          </div>
        </div>

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
            <Option value="all">Tất cả</Option>
            <Option value="active">Đang bán</Option>
            <Option value="pending">Chờ duyệt</Option>
            <Option value="paused">Tạm ngưng</Option>
            <Option value="sold">Đã bán</Option>
          </Select>
          
          <Search
            placeholder="Tìm kiếm tin đăng..."
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
        </div>
      </div>

      <Table
        dataSource={filteredListings}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} tin đăng`,
        }}
      />

      {/* Modal chi tiết */}
      <Modal
        title="Chi tiết tin đăng"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedListing && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Image
                src={selectedListing.image}
                alt={selectedListing.name}
                style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
              />
            </div>
            
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Tên sản phẩm" span={2}>
                <strong>{selectedListing.name}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Danh mục">
                <Tag color="blue">{selectedListing.category}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={
                  selectedListing.status === 'active' ? 'green' :
                  selectedListing.status === 'pending' ? 'orange' :
                  selectedListing.status === 'paused' ? 'default' : 'red'
                }>
                  {selectedListing.status === 'active' ? 'Đang bán' :
                   selectedListing.status === 'pending' ? 'Chờ duyệt' :
                   selectedListing.status === 'paused' ? 'Tạm ngưng' : 'Đã bán'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Giá bán">
                <span style={{ fontWeight: 'bold', color: '#f50' }}>
                  {new Intl.NumberFormat('vi-VN').format(selectedListing.price)} VNĐ
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Năm sản xuất">
                {selectedListing.year}
              </Descriptions.Item>
              <Descriptions.Item label="Tình trạng">
                {selectedListing.condition}
              </Descriptions.Item>
              {selectedListing.mileage > 0 && (
                <Descriptions.Item label="Số km đã đi">
                  {new Intl.NumberFormat('vi-VN').format(selectedListing.mileage)} km
                </Descriptions.Item>
              )}
              {selectedListing.batteryCapacity > 0 && (
                <Descriptions.Item label="Dung lượng pin">
                  {selectedListing.batteryCapacity} kWh
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Lượt xem">
                {selectedListing.views}
              </Descriptions.Item>
              <Descriptions.Item label="Yêu thích">
                {selectedListing.favorites}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đăng">
                {new Date(selectedListing.createdAt).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật cuối">
                {new Date(selectedListing.updatedAt).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>
                {selectedListing.description}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyListings;