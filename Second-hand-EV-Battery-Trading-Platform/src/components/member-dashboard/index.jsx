// MemberDashboard/index.jsx - Dashboard cho Member với navigation khác
import React, { useState } from 'react';
import {
  SearchOutlined,
  PlusOutlined,
  UserOutlined,
  UnorderedListOutlined,
  TransactionOutlined,
  HeartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Avatar, Dropdown } from 'antd';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Header, Content, Footer, Sider } = Layout;

// Hàm helper để tạo menu items
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={key}>{label}</Link>,
  };
}

// Định nghĩa các menu items cho member
const items = [
  getItem('Tìm kiếm & Mua', '/member/search-buy', <SearchOutlined />),
  getItem('Đăng tin bán', '/member/post-listing', <PlusOutlined />),
  getItem('Tin đăng của tôi', '/member/my-listings', <UnorderedListOutlined />),
  getItem('Yêu thích', '/member/favorites', <HeartOutlined />),
  getItem('Lịch sử giao dịch', '/member/transactions', <TransactionOutlined />),
  getItem('Thông tin cá nhân', '/member/profile', <UserOutlined />),
];

const MemberDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Xử lý đăng xuất
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menu dropdown cho user profile
  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Thông tin cá nhân',
        onClick: () => navigate('/member/profile'),
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Đăng xuất',
        onClick: handleLogout,
      },
    ],
  };

  // Tạo breadcrumb dựa trên đường dẫn hiện tại
  const getBreadcrumbItems = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbMap = {
      member: 'Thành viên',
      'search-buy': 'Tìm kiếm & Mua',
      'post-listing': 'Đăng tin bán',
      'my-listings': 'Tin đăng của tôi',
      favorites: 'Yêu thích',
      transactions: 'Lịch sử giao dịch',
      profile: 'Thông tin cá nhân',
    };

    return pathSegments.map(segment => ({
      title: breadcrumbMap[segment] || segment,
    }));
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={value => setCollapsed(value)}
        theme="light"
      >
        <div style={{ 
          height: 32, 
          margin: 16, 
          background: '#1890ff',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {collapsed ? 'EV' : 'EV Trading'}
        </div>
        <Menu 
          theme="light" 
          selectedKeys={[location.pathname]} 
          mode="inline" 
          items={items} 
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header 
          style={{ 
            padding: '0 24px', 
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0'
          }}
        >
          <h2 style={{ margin: 0, color: '#1890ff' }}>
            Nền tảng giao dịch xe điện & pin
          </h2>
          
          {/* User info và logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span>Xin chào, {user?.name}</span>
            <Dropdown menu={userMenu} placement="bottomRight">
              <Avatar 
                style={{ backgroundColor: '#52c41a', cursor: 'pointer' }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb 
            style={{ margin: '16px 0' }} 
            items={getBreadcrumbItems()}
          />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* Outlet sẽ render các component con dựa trên route */}
            <Outlet />
          </div>
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: 'center' }}>
          EV Trading Platform ©{new Date().getFullYear()} - Nền tảng giao dịch xe điện & pin
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MemberDashboard;