import { Button, Form, Input, Modal, Table } from 'antd';
import { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';


const ManageCategory = () => {
  //dinh nghia du lieu
  //lay qua API
  //1. TEN BIEN
  //2, SETTER




  const [categories, setCategories] = useState();
  const [open, setOpen] = useState(false);
  const [form] = useForm(); 





  //columns (hien thi cot nhu nao)
  const colums = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "name",
    },
  ];

  const fetchCategories =   async() => {
    //goi toi API va lay du lieu categories
    console.log("fetching data from API...");
    //doi Backend tra ve du lieu
    const response =  await axios.get("https://68ce4f646dc3f350777ea04f.mockapi.io/Categories");
    console.log(response.data);
    setCategories(response.data);

     };
  const handleSubmitForm = async (values) => {
    console.log(values);
    
    const response = await axios.post("https://68ce4f646dc3f350777ea04f.mockapi.io/Categories", values);
    console.log(response.data);
    setOpen(false);
    fetchCategories();
    form.resetFields();
    toast.success("Create successfully");
  };
     // khi load trang len => fetchCategories()
useEffect(() => {
  // lam gi khi load trang len
  fetchCategories();

},[]);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Add category
        </Button>
      <Table columns={colums} dataSource={categories}/>
      <Modal 
        title="Create new category" 
        open={open} 
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        >
        <Form
          labelCol={{
            span :24,
          }}
          form={form}
          onFinish={handleSubmitForm}
        >
           <Form.Item
        label="Name"
        name="name"
        rules={[
          { required: true, message: "Please input your name!" },
          { min: 3, message: "Name must be at least 3 characters!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[
          { required: true, message: "Please input description!" },
          { max: 200, message: "Description cannot exceed 200 characters!" },
        ]}
      >
        <Input.TextArea rows={5} />
      </Form.Item>

   

        
        </Form>
      </Modal>
    </>
  );
};


export default ManageCategory;
