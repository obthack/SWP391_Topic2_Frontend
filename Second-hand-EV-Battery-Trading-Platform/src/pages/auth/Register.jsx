// Register.jsx - Trang đăng ký cho member mới
import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './auth.css';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    
    try {
      // Simulate API call để tạo tài khoản mới
      console.log('Registering user:', values);
      
      // Giả lập thời gian xử lý
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error) {
      message.error('Có lỗi xảy ra khi đăng ký!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card" title="Đăng ký tài khoản - EV Trading Platform">
        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập họ tên!' },
              { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Nhập họ và tên"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Nhập email của bạn"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="Nhập số điện thoại"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
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
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <div className="auth-links">
          <Button type="link" onClick={() => navigate('/login')}>
            Đã có tài khoản? Đăng nhập ngay
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Register;