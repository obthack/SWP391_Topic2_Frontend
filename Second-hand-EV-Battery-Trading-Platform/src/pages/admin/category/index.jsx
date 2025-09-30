// Admin/category/index.jsx - Quản lý danh mục cho admin (cập nhật từ code cũ)
import { Button, Form, Input, Modal, Table, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ManageCategory = () => {
  // State management
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = useForm();

  // Định nghĩa columns cho table
  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa danh mục này?"
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

  // Fetch categories từ API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      console.log("Đang tải dữ liệu danh mục từ API...");
      const response = await axios.get("https://68ce4f646dc3f350777ea04f.mockapi.io/Categories");
      console.log(response.data);
      setCategories(response.data);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu danh mục!");
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý submit form (tạo mới hoặc cập nhật)
  const handleSubmitForm = async (values) => {
    setLoading(true);
    try {
      if (editingCategory) {
        // Cập nhật danh mục
        const response = await axios.put(
          `https://68ce4f646dc3f350777ea04f.mockapi.io/Categories/${editingCategory.id}`,
          values
        );
        console.log("Updated category:", response.data);
        toast.success("Cập nhật danh mục thành công!");
      } else {
        // Tạo danh mục mới
        const response = await axios.post(
          "https://68ce4f646dc3f350777ea04f.mockapi.io/Categories",
          values
        );
        console.log("Created category:", response.data);
        toast.success("Tạo danh mục thành công!");
      }
      
      setOpen(false);
      setEditingCategory(null);
      fetchCategories();
      form.resetFields();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu danh mục!");
      console.error("Error saving category:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý chỉnh sửa danh mục
  const handleEdit = (record) => {
    setEditingCategory(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
    });
    setOpen(true);
  };

  // Xử lý xóa danh mục
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://68ce4f646dc3f350777ea04f.mockapi.io/Categories/${id}`);
      toast.success("Xóa danh mục thành công!");
      fetchCategories();
    } catch (error) {
      toast.error("Lỗi khi xóa danh mục!");
      console.error("Error deleting category:", error);
    }
  };

  // Xử lý mở modal thêm mới
  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setOpen(true);
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Quản lý Danh mục</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm danh mục
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={categories}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} danh mục`,
        }}
      />

      {/* Modal thêm/sửa danh mục */}
      <Modal
        title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditingCategory(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form
          labelCol={{ span: 24 }}
          form={form}
          onFinish={handleSubmitForm}
        >
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên danh mục!" },
              { min: 3, message: "Tên danh mục phải có ít nhất 3 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả!" },
              { max: 200, message: "Mô tả không được vượt quá 200 ký tự!" },
            ]}
          >
            <Input.TextArea 
              rows={5} 
              placeholder="Nhập mô tả cho danh mục"
              showCount
              maxLength={200}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageCategory;