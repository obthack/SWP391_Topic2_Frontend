// Member/profile/index.jsx - Trang thông tin cá nhân của member
import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Avatar, 
  Upload, 
  Row, 
  Col,
  Descriptions,
  Statistic,
  Divider,
  Modal,
  Rate
} from 'antd';
import { 
  UserOutlined, 
  UploadOutlined, 
  EditOutlined,
  StarOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';

const MemberProfile = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dữ liệu demo profile
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Nguyễn Văn A',
    email: user?.email || 'member@evtrading.com',
    phone: user?.phone || '0987654321',
    address: 'Số 123, Đường ABC, Quận 1, TP.HCM',
    bio: 'Tôi là người yêu thích xe điện và công nghệ xanh. Mong muốn góp phần vào việc phát triển giao thông bền vững.',
    joinDate: '2024-01-20',
    avatar: null,
    // Thống kê
    totalListings: 5,
    activeListing: 3,
    soldItems: 2,
    totalPurchases: 3,
    totalFavorites: 8,
    profileViews: 156,
    averageRating: 4.8,
    totalReviews: 12
  });

  // Dữ liệu demo reviews
  const reviews = [
    {
      id: 1,
      reviewer: 'Trần Thị B',
      rating: 5,
      comment: 'Người bán rất uy tín, xe đúng như mô tả. Giao dịch nhanh chóng!',
      date: '2024-01-25',
      transaction: 'VinFast VF8 2023'
    },
    {
      id: 2,
      reviewer: 'Lê Văn C',
      rating: 5,
      comment: 'Pin chất lượng tốt, đóng gói cẩn thận. Sẽ mua lại lần sau.',
      date: '2024-01-22',
      transaction: 'Pin LFP 60kWh'
    },
    {
      id: 3,
      reviewer: 'Phạm Thị D',
      rating: 4,
      comment: 'Sản phẩm ok, giá hợp lý. Người bán nhiệt tình tư vấn.',
      date: '2024-01-20',
      transaction: 'Bộ sạc nhanh DC'
    }
  ];

  // Xử lý cập nhật profile
  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfileData({ ...profileData, ...values });
      setEditing(false);
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin!');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý upload avatar
  const handleAvatarUpload = (info) => {
    if (info.file.status === 'done') {
      toast.success('Cập nhật ảnh đại diện thành công!');
    }
  };

  // Bắt đầu chỉnh sửa
  const startEditing = () => {
    form.setFieldsValue(profileData);
    setEditing(true);
  };

  // Hủy chỉnh sửa
  const cancelEditing = () => {
    setEditing(false);
    form.resetFields();
  };

  return (
    <div>
      <Row gutter={[24, 24]}>
        {/* Cột trái - Thông tin cá nhân */}
        <Col xs={24} lg={16}>
          <Card 
            title="Thông tin cá nhân" 
            extra={
              !editing && (
                <Button 
                  type="primary" 
                  icon={<EditOutlined />}
                  onClick={startEditing}
                >
                  Chỉnh sửa
                </Button>
              )
            }
          >
            {editing ? (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdateProfile}
                initialValues={profileData}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Họ và tên"
                      name="name"
                      rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Số điện thoại"
                      name="phone"
                      rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      label="Địa chỉ"
                      name="address"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      label="Giới thiệu bản thân"
                      name="bio"
                    >
                      <Input.TextArea 
                        rows={4} 
                        placeholder="Viết vài dòng giới thiệu về bản thân..."
                        maxLength={500}
                        showCount
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <div style={{ textAlign: 'right', marginTop: 16 }}>
                  <Button onClick={cancelEditing} style={{ marginRight: 8 }}>
                    Hủy
                  </Button>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Lưu thay đổi
                  </Button>
                </div>
              </Form>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                  <Avatar 
                    size={80} 
                    icon={<UserOutlined />}
                    style={{ backgroundColor: '#52c41a', marginRight: 16 }}
                  >
                    {profileData.name.charAt(0)}
                  </Avatar>
                  <div>
                    <h3 style={{ margin: 0 }}>{profileData.name}</h3>
                    <div style={{ color: '#666', marginTop: 4 }}>
                      Thành viên từ {new Date(profileData.joinDate).toLocaleDateString('vi-VN')}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <Rate disabled value={profileData.averageRating} />
                      <span style={{ marginLeft: 8, color: '#666' }}>
                        ({profileData.totalReviews} đánh giá)
                      </span>
                    </div>
                  </div>
                </div>

                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Email">
                    {profileData.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    {profileData.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">
                    {profileData.address || 'Chưa cập nhật'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giới thiệu">
                    {profileData.bio || 'Chưa có giới thiệu'}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            )}
          </Card>

          {/* Card đánh giá */}
          <Card title="Đánh giá từ người dùng khác" style={{ marginTop: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <Row gutter={[16, 16]} align="middle">
                <Col>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold', color: '#faad14' }}>
                      {profileData.averageRating}
                    </div>
                    <Rate disabled value={profileData.averageRating} />
                    <div style={{ color: '#666', fontSize: 12 }}>
                      {profileData.totalReviews} đánh giá
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            
            <Divider />
            
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {reviews.map(review => (
                <div key={review.id} style={{ marginBottom: 16, padding: 16, background: '#fafafa', borderRadius: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div>
                      <strong>{review.reviewer}</strong>
                      <div style={{ fontSize: 12, color: '#666' }}>
                        Giao dịch: {review.transaction}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Rate disabled value={review.rating} style={{ fontSize: 14 }} />
                      <div style={{ fontSize: 12, color: '#666' }}>
                        {new Date(review.date).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                  <div>{review.comment}</div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Cột phải - Thống kê */}
        <Col xs={24} lg={8}>
          <Card title="Thống kê hoạt động">
            <Row gutter={[16, 16]}>
              <Col xs={12}>
                <Statistic
                  title="Tin đăng"
                  value={profileData.totalListings}
                  prefix={<ShoppingCartOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={12}>
                <Statistic
                  title="Đang bán"
                  value={profileData.activeListing}
                  prefix={<ShoppingCartOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col xs={12}>
                <Statistic
                  title="Đã bán"
                  value={profileData.soldItems}
                  prefix={<ShoppingCartOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Col>
              <Col xs={12}>
                <Statistic
                  title="Đã mua"
                  value={profileData.totalPurchases}
                  prefix={<ShoppingCartOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
              <Col xs={12}>
                <Statistic
                  title="Yêu thích"
                  value={profileData.totalFavorites}
                  prefix={<HeartOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
              <Col xs={12}>
                <Statistic
                  title="Lượt xem"
                  value={profileData.profileViews}
                  prefix={<EyeOutlined />}
                  valueStyle={{ color: '#13c2c2' }}
                />
              </Col>
            </Row>
          </Card>

          {/* Card thành tích */}
          <Card title="Thành tích" style={{ marginTop: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: 16 }}>
                <StarOutlined style={{ fontSize: 32, color: '#faad14' }} />
                <div style={{ marginTop: 8 }}>
                  <strong>Người bán uy tín</strong>
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  Đánh giá trung bình 4.8/5
                </div>
              </div>
              
              <Divider />
              
              <div style={{ marginBottom: 16 }}>
                <ShoppingCartOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                <div style={{ marginTop: 8 }}>
                  <strong>Thành viên tích cực</strong>
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  Đã có 5 giao dịch thành công
                </div>
              </div>
            </div>
          </Card>

          {/* Card cài đặt nhanh */}
          <Card title="Cài đặt nhanh" style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Button block>Thay đổi mật khẩu</Button>
              <Button block>Cài đặt thông báo</Button>
              <Button block>Chính sách bảo mật</Button>
              <Button block>Liên hệ hỗ trợ</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MemberProfile;