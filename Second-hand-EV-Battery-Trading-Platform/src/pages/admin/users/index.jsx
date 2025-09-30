// Admin/users/index.jsx - Quản lý người dùng cho admin
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Space, Avatar, Popconfirm } from 'antd';
import { UserOutlined, EditOutlined, LockOutlined, UnlockOutlined, EyeOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const { Option } = Select;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();

  // Dữ liệu demo users
  const demoUsers = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@evtrading.com',
      phone: '0123456789',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-15',
      totalListings: 0,
      totalTransactions: 0,
    },
    {
      id: 2,
      name: 'Nguyễn Văn A',
      email: 'member@evtrading.com',
      phone: '0987654321',
      role: 'member',
      status: 'active',
      createdAt: '2024-01-20',
      totalListings: 5,
      totalTransactions: 3,
    },
    {
      id: 3,
      name: 'Trần Thị B',
      email: 'tranthib@gmail.com',
      phone: '0912345678',
      role: 'member',
      status: 'active',
      createdAt: '2024-02-01',
      totalListings: 2,
      totalTransactions: 1,
    },
    {
      id: 4,
      name: 'Lê Văn C',
      email: 'levanc@gmail.com',
      phone: '0934567890',
      role: 'member',
      status: 'blocked',
      createdAt: '2024-02-10',
      totalListings: 8,
      totalTransactions: 0,
    },
  ];

  // Định nghĩa columns cho table
  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (_, record) => (
        <Avatar 
          size={40} 
          icon={<UserOutlined />}
          style={{ 
            backgroundColor: record.role === 'admin' ? '#1890ff' : '#52c41a' 
          }}
        >
          {record.name.charAt(0)}
        </Avatar>
      ),
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Bị khóa'}
        </Tag>
      ),
    },
    {
      title: 'Tin đăng',
      dataIndex: 'totalListings',
      key: 'totalListings',
      align: 'center',
    },
    {
      title: 'Giao dịch',
      dataIndex: 'totalTransactions',
      key: 'totalTransactions',
      align: 'center',
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewUser(record)}
          />
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditUser(record)}
          />
          {record.status === 'active' ? (
            <Popconfirm
              title="Bạn có chắc chắn muốn khóa tài khoản này?"
              onConfirm={() => handleBlockUser(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                danger
                icon={<LockOutlined />}
                size="small"
              />
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Bạn có chắc chắn muốn mở khóa tài khoản này?"
              onConfirm={() => handleUnblockUser(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                type="primary"
                icon={<UnlockOutlined />}
                size="small"
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // Load dữ liệu users
  const fetchUsers = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUsers(demoUsers);
      setLoading(false);
    }, 500);
  };

  // Xem chi tiết user
  const handleViewUser = (user) => {
    Modal.info({
      title: `Thông tin chi tiết: ${user.name}`,
      width: 600,
      content: (
        <div style={{ marginTop: 16 }}>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Họ tên:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Số điện thoại:</strong> {user.phone}</p>
          <p><strong>Vai trò:</strong> {user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}</p>
          <p><strong>Trạng thái:</strong> {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}</p>
          <p><strong>Ngày tham gia:</strong> {new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
          <p><strong>Tổng tin đăng:</strong> {user.totalListings}</p>
          <p><strong>Tổng giao dịch:</strong> {user.totalTransactions}</p>
        </div>
      ),
    });
  };

  // Chỉnh sửa user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    });
    setEditModalVisible(true);
  };

  // Khóa user
  const handleBlockUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'blocked' } : user
    ));
    toast.success('Đã khóa tài khoản thành công!');
  };

  // Mở khóa user
  const handleUnblockUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'active' } : user
    ));
    toast.success('Đã mở khóa tài khoản thành công!');
  };

  // Lưu thay đổi user
  const handleSaveUser = (values) => {
    setUsers(users.map(user => 
      user.id === selectedUser.id ? { ...user, ...values } : user
    ));
    setEditModalVisible(false);
    setSelectedUser(null);
    form.resetFields();
    toast.success('Cập nhật thông tin thành công!');
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Quản lý Người dùng</h2>
        <div>
          <span style={{ marginRight: 16 }}>
            Tổng: <strong>{users.length}</strong> người dùng
          </span>
          <span style={{ marginRight: 16, color: '#52c41a' }}>
            Hoạt động: <strong>{users.filter(u => u.status === 'active').length}</strong>
          </span>
          <span style={{ color: '#ff4d4f' }}>
            Bị khóa: <strong>{users.filter(u => u.status === 'blocked').length}</strong>
          </span>
        </div>
      </div>

      <Table
        dataSource={users}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} người dùng`,
        }}
      />

      {/* Modal chỉnh sửa user */}
      <Modal
        title="Chỉnh sửa thông tin người dùng"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedUser(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveUser}
        >
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input />
          </Form.Item>

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

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select>
              <Option value="member">Thành viên</Option>
              <Option value="admin">Quản trị viên</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Option value="active">Hoạt động</Option>
              <Option value="blocked">Bị khóa</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageUsers;