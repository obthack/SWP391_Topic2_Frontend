// Member/post-listing/index.jsx - Trang đăng tin bán cho member
import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Button, 
  Upload, 
  Card, 
  Row, 
  Col,
  Steps,
  Alert,
  Tag
} from 'antd';
import { PlusOutlined, UploadOutlined, DollarOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const PostListing = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  const [formData, setFormData] = useState({});

  // AI gợi ý giá (demo)
  const suggestPrice = (category, year, condition, mileage, batteryCapacity) => {
    let basePrice = 0;
    
    // Giá cơ sở theo danh mục
    switch (category) {
      case 'Xe điện':
        basePrice = 800000000; // 800 triệu
        break;
      case 'Pin xe điện':
        basePrice = batteryCapacity * 2000000; // 2 triệu/kWh
        break;
      case 'Phụ kiện':
        basePrice = 20000000; // 20 triệu
        break;
      default:
        basePrice = 100000000;
    }

    // Điều chỉnh theo năm sản xuất
    const currentYear = new Date().getFullYear();
    const ageDiscount = (currentYear - year) * 0.1;
    basePrice *= (1 - ageDiscount);

    // Điều chỉnh theo tình trạng
    const conditionMultiplier = {
      'Mới': 1.0,
      'Như mới': 0.9,
      'Tốt': 0.8,
      'Khá': 0.7,
      'Cần sửa chữa': 0.5
    };
    basePrice *= conditionMultiplier[condition] || 0.8;

    // Điều chỉnh theo số km (chỉ với xe)
    if (category === 'Xe điện' && mileage > 0) {
      const mileageDiscount = Math.min(mileage / 100000, 0.3); // Tối đa giảm 30%
      basePrice *= (1 - mileageDiscount);
    }

    return Math.round(basePrice);
  };

  // Xử lý thay đổi form để gợi ý giá
  const handleFormChange = (changedFields, allFields) => {
    const values = form.getFieldsValue();
    if (values.category && values.year && values.condition) {
      const suggested = suggestPrice(
        values.category,
        values.year,
        values.condition,
        values.mileage || 0,
        values.batteryCapacity || 0
      );
      setSuggestedPrice(suggested);
    }
  };

  // Xử lý submit form
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      console.log('Posting listing:', values);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Đăng tin thành công! Tin của bạn đang chờ duyệt.');
      form.resetFields();
      setCurrentStep(0);
      setSuggestedPrice(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng tin!');
    } finally {
      setLoading(false);
    }
  };

  // Bước tiếp theo
  const nextStep = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
      setFormData({ ...formData, ...form.getFieldsValue() });
    });
  };

  // Bước trước
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Render step 1: Thông tin cơ bản
  const renderBasicInfo = () => (
    <Card title="Thông tin cơ bản">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
              { min: 5, message: 'Tên sản phẩm phải có ít nhất 5 ký tự!' }
            ]}
          >
            <Input placeholder="VD: VinFast VF8 2023" size="large" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select placeholder="Chọn danh mục" size="large">
              <Option value="Xe điện">Xe điện</Option>
              <Option value="Pin xe điện">Pin xe điện</Option>
              <Option value="Phụ kiện">Phụ kiện</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Năm sản xuất"
            name="year"
            rules={[{ required: true, message: 'Vui lòng nhập năm sản xuất!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={2000}
              max={new Date().getFullYear()}
              placeholder="2023"
              size="large"
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Tình trạng"
            name="condition"
            rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
          >
            <Select placeholder="Chọn tình trạng" size="large">
              <Option value="Mới">Mới</Option>
              <Option value="Như mới">Như mới</Option>
              <Option value="Tốt">Tốt</Option>
              <Option value="Khá">Khá</Option>
              <Option value="Cần sửa chữa">Cần sửa chữa</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  // Render step 2: Thông số kỹ thuật
  const renderTechnicalSpecs = () => (
    <Card title="Thông số kỹ thuật">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Số km đã đi"
            name="mileage"
            help="Để trống nếu là sản phẩm mới"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="15000"
              size="large"
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Dung lượng pin (kWh)"
            name="batteryCapacity"
            help="Chỉ áp dụng cho xe điện và pin"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.1}
              placeholder="87.7"
              size="large"
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            label="Mô tả chi tiết"
            name="description"
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả!' },
              { min: 50, message: 'Mô tả phải có ít nhất 50 ký tự!' }
            ]}
          >
            <TextArea
              rows={6}
              placeholder="Mô tả chi tiết về sản phẩm: tình trạng, lịch sử sử dụng, lý do bán..."
              showCount
              maxLength={1000}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  // Render step 3: Giá và hình ảnh
  const renderPriceAndImages = () => (
    <div>
      <Card title="Định giá sản phẩm" style={{ marginBottom: 16 }}>
        {suggestedPrice && (
          <Alert
            message="AI gợi ý giá"
            description={
              <div>
                <div style={{ fontSize: 18, fontWeight: 'bold', color: '#52c41a', marginBottom: 8 }}>
                  <DollarOutlined /> {new Intl.NumberFormat('vi-VN').format(suggestedPrice)} VNĐ
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  Giá được tính dựa trên dữ liệu thị trường và thông tin sản phẩm của bạn
                </div>
                <Button 
                  type="link" 
                  size="small"
                  onClick={() => form.setFieldsValue({ price: suggestedPrice })}
                >
                  Sử dụng giá gợi ý
                </Button>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        
        <Form.Item
          label="Giá bán (VNĐ)"
          name="price"
          rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            placeholder="850000000"
            size="large"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>
      </Card>

      <Card title="Hình ảnh sản phẩm">
        <Form.Item
          label="Upload hình ảnh"
          name="images"
          help="Tối đa 5 hình ảnh, mỗi hình không quá 5MB"
        >
          <Upload
            listType="picture-card"
            multiple
            maxCount={5}
            beforeUpload={() => false} // Prevent auto upload
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Hoặc nhập URL hình ảnh"
          name="imageUrl"
          help="Nhập đường dẫn hình ảnh từ internet"
        >
          <Input placeholder="https://example.com/image.jpg" />
        </Form.Item>
      </Card>
    </div>
  );

  const steps = [
    {
      title: 'Thông tin cơ bản',
      content: renderBasicInfo(),
    },
    {
      title: 'Thông số kỹ thuật',
      content: renderTechnicalSpecs(),
    },
    {
      title: 'Giá & Hình ảnh',
      content: renderPriceAndImages(),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2>Đăng tin bán xe điện & pin</h2>
        <p style={{ color: '#666' }}>
          Điền đầy đủ thông tin để tin đăng của bạn thu hút nhiều người mua hơn
        </p>
      </div>

      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onFieldsChange={handleFormChange}
      >
        <div style={{ marginBottom: 24 }}>
          {steps[currentStep].content}
        </div>

        <div style={{ textAlign: 'center' }}>
          {currentStep > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={prevStep}>
              Quay lại
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={nextStep}>
              Tiếp theo
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" htmlType="submit" loading={loading}>
              Đăng tin
            </Button>
          )}
        </div>
      </Form>

      {/* Hướng dẫn */}
      <Card title="Mẹo để tin đăng hiệu quả" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center', padding: 16 }}>
              <h4>📸 Hình ảnh chất lượng</h4>
              <p>Chụp ảnh rõ nét, đầy đủ các góc độ của sản phẩm</p>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center', padding: 16 }}>
              <h4>📝 Mô tả chi tiết</h4>
              <p>Cung cấp thông tin đầy đủ về tình trạng và lịch sử sử dụng</p>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center', padding: 16 }}>
              <h4>💰 Giá cạnh tranh</h4>
              <p>Tham khảo giá thị trường và sử dụng AI gợi ý giá</p>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PostListing;