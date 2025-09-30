// Member/search-buy/index.jsx - Trang tìm kiếm và mua cho member
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Input, 
  Select, 
  Button, 
  Tag, 
  Image, 
  Space, 
  Modal, 
  Descriptions,
  InputNumber,
  Slider,
  Checkbox
} from 'antd';
import { 
  SearchOutlined, 
  HeartOutlined, 
  HeartFilled, 
  EyeOutlined, 
  ShoppingCartOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { toast } from 'react-toastify';

const { Search } = Input;
const { Option } = Select;

const SearchBuy = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000000000]);

  // Dữ liệu demo listings
  const demoListings = [
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
      createdAt: '2024-01-15',
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
      createdAt: '2024-01-18',
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
      createdAt: '2024-01-20',
      status: 'available'
    },
    {
      id: 4,
      name: 'Bộ sạc nhanh DC 50kW',
      category: 'Phụ kiện',
      price: 25000000,
      year: 2023,
      mileage: 0,
      condition: 'Như mới',
      batteryCapacity: 0,
      location: 'Hà Nội',
      seller: 'Phạm Thị D',
      image: 'https://images.pexels.com/photos/7078666/pexels-photo-7078666.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Bộ sạc nhanh DC 50kW, sử dụng 6 tháng. Còn bảo hành 18 tháng.',
      createdAt: '2024-01-22',
      status: 'available'
    },
    {
      id: 5,
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
      createdAt: '2024-01-25',
      status: 'available'
    },
    {
      id: 6,
      name: 'Pin NCM 80kWh',
      category: 'Pin xe điện',
      price: 180000000,
      year: 2022,
      mileage: 0,
      condition: 'Tốt',
      batteryCapacity: 80,
      location: 'Hà Nội',
      seller: 'Vũ Thị F',
      image: 'https://images.pexels.com/photos/4254557/pexels-photo-4254557.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Pin NCM 80kWh, độ chai 15%. Còn sử dụng tốt, phù hợp thay thế.',
      createdAt: '2024-01-28',
      status: 'available'
    }
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

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    const filtered = listings.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase()) ||
      item.category.toLowerCase().includes(value.toLowerCase()) ||
      item.seller.toLowerCase().includes(value.toLowerCase()) ||
      item.location.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredListings(filtered);
  };

  // Lọc theo danh mục
  const handleCategoryFilter = (category) => {
    if (category === 'all') {
      setFilteredListings(listings);
    } else {
      setFilteredListings(listings.filter(item => item.category === category));
    }
  };

  // Lọc theo giá
  const handlePriceFilter = (range) => {
    setPriceRange(range);
    const filtered = listings.filter(item => 
      item.price >= range[0] && item.price <= range[1]
    );
    setFilteredListings(filtered);
  };

  // Thêm/xóa yêu thích
  const toggleFavorite = (listingId) => {
    if (favorites.includes(listingId)) {
      setFavorites(favorites.filter(id => id !== listingId));
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } else {
      setFavorites([...favorites, listingId]);
      toast.success('Đã thêm vào danh sách yêu thích');
    }
  };

  // Xem chi tiết
  const handleViewDetail = (listing) => {
    setSelectedListing(listing);
    setDetailModalVisible(true);
  };

  // Mua ngay
  const handleBuyNow = (listing) => {
    Modal.confirm({
      title: 'Xác nhận mua hàng',
      content: `Bạn có chắc chắn muốn mua "${listing.name}" với giá ${new Intl.NumberFormat('vi-VN').format(listing.price)} VNĐ?`,
      onOk() {
        toast.success('Đã gửi yêu cầu mua hàng! Người bán sẽ liên hệ với bạn sớm.');
      },
    });
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2>Tìm kiếm & Mua xe điện, pin</h2>
        
        {/* Thanh tìm kiếm và bộ lọc */}
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={12}>
              <Search
                placeholder="Tìm kiếm xe, pin, phụ kiện..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
              />
            </Col>
            <Col xs={24} md={8}>
              <Select
                placeholder="Chọn danh mục"
                style={{ width: '100%' }}
                size="large"
                onChange={handleCategoryFilter}
                defaultValue="all"
              >
                <Option value="all">Tất cả danh mục</Option>
                <Option value="Xe điện">Xe điện</Option>
                <Option value="Pin xe điện">Pin xe điện</Option>
                <Option value="Phụ kiện">Phụ kiện</Option>
              </Select>
            </Col>
            <Col xs={24} md={4}>
              <Button 
                icon={<FilterOutlined />} 
                size="large"
                onClick={() => setFilterVisible(true)}
                style={{ width: '100%' }}
              >
                Bộ lọc
              </Button>
            </Col>
          </Row>
        </div>

        {/* Thống kê kết quả */}
        <div style={{ marginBottom: 16, color: '#666' }}>
          Tìm thấy <strong>{filteredListings.length}</strong> kết quả
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <Row gutter={[16, 16]}>
        {filteredListings.map(listing => (
          <Col xs={24} sm={12} lg={8} xl={6} key={listing.id}>
            <Card
              hoverable
              cover={
                <div style={{ position: 'relative' }}>
                  <Image
                    alt={listing.name}
                    src={listing.image}
                    style={{ height: 200, objectFit: 'cover' }}
                    preview={false}
                  />
                  <Button
                    type="text"
                    icon={favorites.includes(listing.id) ? <HeartFilled /> : <HeartOutlined />}
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      background: 'rgba(255, 255, 255, 0.8)',
                      color: favorites.includes(listing.id) ? '#ff4d4f' : '#666'
                    }}
                    onClick={() => toggleFavorite(listing.id)}
                  />
                </div>
              }
              actions={[
                <Button 
                  type="text" 
                  icon={<EyeOutlined />}
                  onClick={() => handleViewDetail(listing)}
                >
                  Xem
                </Button>,
                <Button 
                  type="primary" 
                  icon={<ShoppingCartOutlined />}
                  onClick={() => handleBuyNow(listing)}
                >
                  Mua
                </Button>
              ]}
            >
              <Card.Meta
                title={
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>
                      {listing.name}
                    </div>
                    <Tag color="blue">{listing.category}</Tag>
                  </div>
                }
                description={
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 'bold', color: '#f50', marginBottom: 8 }}>
                      {new Intl.NumberFormat('vi-VN').format(listing.price)} VNĐ
                    </div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      <div>Năm: {listing.year} | Tình trạng: {listing.condition}</div>
                      {listing.mileage > 0 && <div>Đã đi: {new Intl.NumberFormat('vi-VN').format(listing.mileage)} km</div>}
                      {listing.batteryCapacity > 0 && <div>Pin: {listing.batteryCapacity} kWh</div>}
                      <div>Địa điểm: {listing.location}</div>
                      <div>Người bán: {listing.seller}</div>
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
        title="Chi tiết sản phẩm"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        footer={[
          <Button key="favorite" onClick={() => toggleFavorite(selectedListing?.id)}>
            {favorites.includes(selectedListing?.id) ? <HeartFilled /> : <HeartOutlined />}
            {favorites.includes(selectedListing?.id) ? 'Đã yêu thích' : 'Yêu thích'}
          </Button>,
          <Button key="cancel" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          <Button key="buy" type="primary" onClick={() => handleBuyNow(selectedListing)}>
            Mua ngay
          </Button>
        ]}
      >
        {selectedListing && (
          <div>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Image
                  src={selectedListing.image}
                  alt={selectedListing.name}
                  style={{ width: '100%', borderRadius: 8 }}
                />
              </Col>
              <Col xs={24} md={12}>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Tên sản phẩm">
                    <strong>{selectedListing.name}</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Danh mục">
                    <Tag color="blue">{selectedListing.category}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Giá">
                    <span style={{ fontSize: 20, fontWeight: 'bold', color: '#f50' }}>
                      {new Intl.NumberFormat('vi-VN').format(selectedListing.price)} VNĐ
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Năm sản xuất">
                    {selectedListing.year}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tình trạng">
                    <Tag color="green">{selectedListing.condition}</Tag>
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
                  <Descriptions.Item label="Địa điểm">
                    {selectedListing.location}
                  </Descriptions.Item>
                  <Descriptions.Item label="Người bán">
                    {selectedListing.seller}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
            <div style={{ marginTop: 16 }}>
              <h4>Mô tả chi tiết:</h4>
              <p>{selectedListing.description}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal bộ lọc */}
      <Modal
        title="Bộ lọc tìm kiếm"
        open={filterVisible}
        onCancel={() => setFilterVisible(false)}
        onOk={() => setFilterVisible(false)}
      >
        <div style={{ marginBottom: 16 }}>
          <h4>Khoảng giá (VNĐ):</h4>
          <Slider
            range
            min={0}
            max={2000000000}
            step={10000000}
            value={priceRange}
            onChange={handlePriceFilter}
            tipFormatter={(value) => new Intl.NumberFormat('vi-VN').format(value)}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span>{new Intl.NumberFormat('vi-VN').format(priceRange[0])}</span>
            <span>{new Intl.NumberFormat('vi-VN').format(priceRange[1])}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SearchBuy;