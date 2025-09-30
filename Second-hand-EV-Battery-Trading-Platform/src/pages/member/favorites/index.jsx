// Member/favorites/index.jsx - Danh sách yêu thích của member
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Tag, 
  Image, 
  Modal, 
  Descriptions,
  Empty,
  Space,
  Popconfirm
} from 'antd';
import { 
  HeartFilled, 
  EyeOutlined, 
  ShoppingCartOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import { toast } from 'react-toastify';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Dữ liệu demo favorites
  const demoFavorites = [
    {
      id: 1,
      name: 'VinFast VF8 2023',
      category: 'Xe điện',
      price: 850000000,
      year: 2023,
      mileage: 5000,
      condition: 'Như mới',
      batteryCapacity: 87.7,
      location: 'Hà Nội',
      seller: 'Nguyễn Văn A',
      image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'VinFast VF8 2023 màu trắng, đi ít, bảo hành còn 2 năm. Xe như mới, không tai nạn.',
      addedAt: '2024-01-15',
      status: 'available'
    },
    {
      id: 2,
      name: 'Tesla Model 3 2022',
      category: 'Xe điện',
      price: 1200000000,
      year: 2022,
      mileage: 15000,
      condition: 'Tốt',
      batteryCapacity: 75,
      location: 'TP.HCM',
      seller: 'Trần Thị B',
      image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Tesla Model 3 2022, xe nhập khẩu chính hãng. Đầy đủ giấy tờ, bảo dưỡng định kỳ.',
      addedAt: '2024-01-18',
      status: 'available'
    },
    {
      id: 3,
      name: 'Pin LFP 60kWh',
      category: 'Pin xe điện',
      price: 120000000,
      year: 2023,
      mileage: 0,
      condition: 'Mới',
      batteryCapacity: 60,
      location: 'Đà Nẵng',
      seller: 'Lê Văn C',
      image: 'https://images.pexels.com/photos/4254557/pexels-photo-4254557.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Pin LFP 60kWh mới 100%, chưa sử dụng. Bảo hành 5 năm từ nhà sản xuất.',
      addedAt: '2024-01-20',
      status: 'available'
    },
    {
      id: 4,
      name: 'VinFast VF9 2023',
      category: 'Xe điện',
      price: 1500000000,
      year: 2023,
      mileage: 8000,
      condition: 'Tốt',
      batteryCapacity: 123,
      location: 'TP.HCM',
      seller: 'Hoàng Văn E',
      image: 'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'VinFast VF9 2023 7 chỗ, xe gia đình sử dụng cẩn thận. Đầy đủ phụ kiện.',
      addedAt: '2024-01-25',
      status: 'sold' // Đã bán
    },
  ];

  // Load dữ liệu
  const fetchFavorites = () => {
    setLoading(true);
    setTimeout(() => {
      setFavorites(demoFavorites);
      setLoading(false);
    }, 500);
  };

  // Xóa khỏi danh sách yêu thích
  const handleRemoveFavorite = (itemId) => {
    setFavorites(favorites.filter(item => item.id !== itemId));
    toast.success('Đã xóa khỏi danh sách yêu thích');
  };

  // Xem chi tiết
  const handleViewDetail = (item) => {
    setSelectedItem(item);
    setDetailModalVisible(true);
  };

  // Mua ngay
  const handleBuyNow = (item) => {
    if (item.status === 'sold') {
      toast.error('Sản phẩm này đã được bán!');
      return;
    }
    
    Modal.confirm({
      title: 'Xác nhận mua hàng',
      content: `Bạn có chắc chắn muốn mua "${item.name}" với giá ${new Intl.NumberFormat('vi-VN').format(item.price)} VNĐ?`,
      onOk() {
        toast.success('Đã gửi yêu cầu mua hàng! Người bán sẽ liên hệ với bạn sớm.');
      },
    });
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (favorites.length === 0 && !loading) {
    return (
      <div>
        <h2>Danh sách yêu thích</h2>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Bạn chưa có sản phẩm yêu thích nào"
          style={{ marginTop: 50 }}
        >
          <Button type="primary" href="/member/search-buy">
            Khám phá sản phẩm
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Danh sách yêu thích</h2>
        <div style={{ color: '#666' }}>
          <HeartFilled style={{ color: '#ff4d4f', marginRight: 8 }} />
          {favorites.length} sản phẩm
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {favorites.map(item => (
          <Col xs={24} sm={12} lg={8} xl={6} key={item.id}>
            <Card
              hoverable
              cover={
                <div style={{ position: 'relative' }}>
                  <Image
                    alt={item.name}
                    src={item.image}
                    style={{ height: 200, objectFit: 'cover' }}
                    preview={false}
                  />
                  {item.status === 'sold' && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 18,
                      fontWeight: 'bold'
                    }}>
                      ĐÃ BÁN
                    </div>
                  )}
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa khỏi danh sách yêu thích?"
                    onConfirm={() => handleRemoveFavorite(item.id)}
                    okText="Có"
                    cancelText="Không"
                  >
                    <Button
                      type="text"
                      icon={<HeartFilled />}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: 'rgba(255, 255, 255, 0.8)',
                        color: '#ff4d4f'
                      }}
                    />
                  </Popconfirm>
                </div>
              }
              actions={[
                <Button 
                  type="text" 
                  icon={<EyeOutlined />}
                  onClick={() => handleViewDetail(item)}
                >
                  Xem
                </Button>,
                <Button 
                  type="primary" 
                  icon={<ShoppingCartOutlined />}
                  onClick={() => handleBuyNow(item)}
                  disabled={item.status === 'sold'}
                >
                  {item.status === 'sold' ? 'Đã bán' : 'Mua'}
                </Button>,
                <Popconfirm
                  title="Xóa khỏi yêu thích?"
                  onConfirm={() => handleRemoveFavorite(item.id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button 
                    type="text" 
                    danger
                    icon={<DeleteOutlined />}
                  >
                    Xóa
                  </Button>
                </Popconfirm>
              ]}
            >
              <Card.Meta
                title={
                  <div>
                    <div style={{ 
                      fontSize: 16, 
                      fontWeight: 'bold', 
                      marginBottom: 4,
                      color: item.status === 'sold' ? '#999' : 'inherit'
                    }}>
                      {item.name}
                    </div>
                    <Space>
                      <Tag color="blue">{item.category}</Tag>
                      {item.status === 'sold' && <Tag color="red">Đã bán</Tag>}
                    </Space>
                  </div>
                }
                description={
                  <div>
                    <div style={{ 
                      fontSize: 18, 
                      fontWeight: 'bold', 
                      color: item.status === 'sold' ? '#999' : '#f50', 
                      marginBottom: 8 
                    }}>
                      {new Intl.NumberFormat('vi-VN').format(item.price)} VNĐ
                    </div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      <div>Năm: {item.year} | Tình trạng: {item.condition}</div>
                      {item.mileage > 0 && <div>Đã đi: {new Intl.NumberFormat('vi-VN').format(item.mileage)} km</div>}
                      {item.batteryCapacity > 0 && <div>Pin: {item.batteryCapacity} kWh</div>}
                      <div>Địa điểm: {item.location}</div>
                      <div>Người bán: {item.seller}</div>
                      <div style={{ marginTop: 4, color: '#999' }}>
                        Yêu thích: {new Date(item.addedAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal chi tiết sản phẩm */}
      <Modal
        title="Chi tiết sản phẩm yêu thích"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        footer={[
          <Popconfirm
            key="remove"
            title="Bạn có chắc chắn muốn xóa khỏi danh sách yêu thích?"
            onConfirm={() => {
              handleRemoveFavorite(selectedItem?.id);
              setDetailModalVisible(false);
            }}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa khỏi yêu thích
            </Button>
          </Popconfirm>,
          <Button key="cancel" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          <Button 
            key="buy" 
            type="primary" 
            onClick={() => handleBuyNow(selectedItem)}
            disabled={selectedItem?.status === 'sold'}
          >
            {selectedItem?.status === 'sold' ? 'Đã bán' : 'Mua ngay'}
          </Button>
        ]}
      >
        {selectedItem && (
          <div>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  style={{ width: '100%', borderRadius: 8 }}
                />
              </Col>
              <Col xs={24} md={12}>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Tên sản phẩm">
                    <strong>{selectedItem.name}</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Danh mục">
                    <Tag color="blue">{selectedItem.category}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    {selectedItem.status === 'sold' ? (
                      <Tag color="red">Đã bán</Tag>
                    ) : (
                      <Tag color="green">Còn hàng</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giá">
                    <span style={{ 
                      fontSize: 20, 
                      fontWeight: 'bold', 
                      color: selectedItem.status === 'sold' ? '#999' : '#f50' 
                    }}>
                      {new Intl.NumberFormat('vi-VN').format(selectedItem.price)} VNĐ
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Năm sản xuất">
                    {selectedItem.year}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tình trạng">
                    <Tag color="green">{selectedItem.condition}</Tag>
                  </Descriptions.Item>
                  {selectedItem.mileage > 0 && (
                    <Descriptions.Item label="Số km đã đi">
                      {new Intl.NumberFormat('vi-VN').format(selectedItem.mileage)} km
                    </Descriptions.Item>
                  )}
                  {selectedItem.batteryCapacity > 0 && (
                    <Descriptions.Item label="Dung lượng pin">
                      {selectedItem.batteryCapacity} kWh
                    </Descriptions.Item>
                  )}
                  <Descriptions.Item label="Địa điểm">
                    {selectedItem.location}
                  </Descriptions.Item>
                  <Descriptions.Item label="Người bán">
                    {selectedItem.seller}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thêm vào yêu thích">
                    {new Date(selectedItem.addedAt).toLocaleDateString('vi-VN')}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
            <div style={{ marginTop: 16 }}>
              <h4>Mô tả chi tiết:</h4>
              <p>{selectedItem.description}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Favorites;