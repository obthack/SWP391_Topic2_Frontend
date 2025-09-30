// Login.jsx - Trang đăng nhập cho cả admin và member
import React, { useState } from 'react';
import { Form, Input, Button, Card, Select, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './auth.css';

const { Option } = Select;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Dữ liệu demo users (trong thực tế sẽ lấy từ API)
  const demoUsers = [
    {
      id: 1,
      email: 'admin@evtrading.com',
      password: 'admin123',
      role: 'admin',
      name: 'Admin User',
      phone: '0123456789'
    },
    {
      id: 2,
      email: 'member@evtrading.com',
      password: 'member123',
      role: 'member',
      name: 'Member User',
      phone: '0987654321'
    }
  ];

  const onFinish = async (values) => {
    setLoading(true);
    
    try {
      // Simulate API call - tìm user trong dữ liệu demo
      const user = demoUsers.find(
        u => u.email === values.email && u.password === values.password
      );

      if (user) {
        // Đăng nhập thành công
        login(user);
        message.success('Đăng nhập thành công!');
        
        // Điều hướng dựa trên role
        if (user.role === 'admin') {
          navigate('/admin/bikes');
        } else {
          navigate('/member/search-buy');
        }
      } else {
        message.error('Email hoặc mật khẩu không đúng!');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi đăng nhập!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card" title="Đăng nhập - EV Trading Platform">
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Nhập email của bạn"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              block
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        {/* Demo accounts info */}
        <div className="demo-accounts">
          <h4>Tài khoản demo:</h4>
          <p><strong>Admin:</strong> admin@evtrading.com / admin123</p>
          <p><strong>Member:</strong> member@evtrading.com / member123</p>
        </div>

        <div className="auth-links">
          <Button type="link" onClick={() => navigate('/register')}>
            Chưa có tài khoản? Đăng ký ngay
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;