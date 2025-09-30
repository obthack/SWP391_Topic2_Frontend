// Admin/bike/index.jsx - Quản lý xe và pin cho admin
import { Table, Button, Modal, Form, Input, Select, InputNumber, Tag, Space, Image, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const { Option } = Select;
const { TextArea } = Input;

const ManageBike = () => {
  // State management
  const [bikes, setBikes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingBike, setEditingBike] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = useForm();

  // Định nghĩa columns cho table
  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image) => (
        <Image
          width={60}
          height={60}
          src={image || 'https://via.placeholder.com/60'}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: 'Tên xe/pin',
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
      title: 'Năm sản xuất',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Tình trạng',
      dataIndex: 'condition',
      key: 'condition',
      render: (condition) => {
        const colorMap = {
          'Mới': 'green',
          'Như mới': 'cyan',
          'Tốt': 'blue',
          'Khá': 'orange',
          'Cần sửa chữa': 'red'
        };
        return <Tag color={colorMap[condition]}>{condition}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colorMap = {
          'Đang bán': 'green',
          'Đã bán': 'red',
          'Tạm ngưng': 'orange'
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
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
            onClick={() => handleView(record)}
          />
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
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
        </Space>
      ),
    },
  ];

  // Fetch dữ liệu bikes từ API
  const fetchBikes = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://68ce4f646dc3f350777ea04f.mockapi.io/bikes");
      setBikes(response.data);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu xe/pin!");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://68ce4f646dc3f350777ea04f.mockapi.io/Categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Xử lý submit form (tạo mới hoặc cập nhật)
  const handleSubmitForm = async (values) => {
    setLoading(true);
    try {
      if (editingBike) {
        // Cập nhật
        const response = await axios.put(
          `https://68ce4f646dc3f350777ea04f.mockapi.io/bikes/${editingBike.id}`,
          values
        );
        toast.success("Cập nhật thành công!");
      } else {
        // Tạo mới
        const response = await axios.post(
          "https://68ce4f646dc3f350777ea04f.mockapi.io/bikes",
          { ...values, status: 'Đang bán' }
        );
        toast.success("Thêm mới thành công!");
      }
      
      setOpen(false);
      setEditingBike(null);
      form.resetFields();
      fetchBikes();
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xem chi tiết
  const handleView = (record) => {
    Modal.info({
      title: `Chi tiết: ${record.name}`,
      width: 600,
      content: (
        <div>
          <p><strong>Danh mục:</strong> {record.category}</p>
          <p><strong>Giá:</strong> {new Intl.NumberFormat('vi-VN').format(record.price)} VNĐ</p>
          <p><strong>Năm sản xuất:</strong> {record.year}</p>
          <p><strong>Số km đã đi:</strong> {record.mileage} km</p>
          <p><strong>Tình trạng:</strong> {record.condition}</p>
          <p><strong>Dung lượng pin:</strong> {record.batteryCapacity} kWh</p>
          <p><strong>Mô tả:</strong> {record.description}</p>
        </div>
      ),
    });
  };

  // Xử lý chỉnh sửa
  const handleEdit = (record) => {
    setEditingBike(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  // Xử lý xóa
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://68ce4f646dc3f350777ea04f.mockapi.io/bikes/${id}`);
      toast.success("Xóa thành công!");
      fetchBikes();
    } catch (error) {
      toast.error("Lỗi khi xóa!");
    }
  };

  // Xử lý mở modal thêm mới
  const handleAdd = () => {
    setEditingBike(null);
    form.resetFields();
    setOpen(true);
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    fetchBikes();
    fetchCategories();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Quản lý Xe điện & Pin</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm xe/pin mới
        </Button>
      </div>

      <Table 
        dataSource={bikes} 
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} mục`,
        }}
      />

      {/* Modal thêm/sửa */}
      <Modal
        title={editingBike ? "Chỉnh sửa xe/pin" : "Thêm xe/pin mới"}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditingBike(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={loading}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitForm}
        >
          <Form.Item
            label="Tên xe/pin"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên!" },
              { min: 3, message: "Tên phải có ít nhất 3 ký tự!" }
            ]}
          >
            <Input placeholder="Nhập tên xe hoặc pin" />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            <Select placeholder="Chọn danh mục">
              <Option value="Xe điện">Xe điện</Option>
              <Option value="Pin xe điện">Pin xe điện</Option>
              <Option value="Phụ kiện">Phụ kiện</Option>
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              label="Giá (VNĐ)"
              name="price"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                placeholder="Nhập giá"
              />
            </Form.Item>

            <Form.Item
              label="Năm sản xuất"
              name="year"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Vui lòng nhập năm!" }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={2000}
                max={new Date().getFullYear()}
                placeholder="Năm sản xuất"
              />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              label="Số km đã đi"
              name="mileage"
              style={{ flex: 1 }}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                placeholder="Số km"
              />
            </Form.Item>

            <Form.Item
              label="Dung lượng pin (kWh)"
              name="batteryCapacity"
              style={{ flex: 1 }}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={0.1}
                placeholder="Dung lượng pin"
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Tình trạng"
            name="condition"
            rules={[{ required: true, message: "Vui lòng chọn tình trạng!" }]}
          >
            <Select placeholder="Chọn tình trạng">
              <Option value="Mới">Mới</Option>
              <Option value="Như mới">Như mới</Option>
              <Option value="Tốt">Tốt</Option>
              <Option value="Khá">Khá</Option>
              <Option value="Cần sửa chữa">Cần sửa chữa</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="URL hình ảnh"
            name="image"
          >
            <Input placeholder="Nhập URL hình ảnh" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Mô tả chi tiết về xe/pin"
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageBike;