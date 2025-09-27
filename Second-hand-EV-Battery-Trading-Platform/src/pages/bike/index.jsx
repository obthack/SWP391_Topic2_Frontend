import { Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const ManageBike = () => {

  const [bikes, setBikes] = useState([]);



const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'description',
    dataIndex: 'description',
    key: 'description',
  },
 
];  

  const fetchBike = async () => {
    const response = await axios.get("https://68ce4f646dc3f350777ea04f.mockapi.io/bike");
    console.log(response.data);
    setBikes(response.data);
  };
  // source => BE => response.data =>



  useEffect(() => {
      fetchBike();
  }, []);

  

  return (
    <div>
      <Table dataSource={bikes} columns={columns} />

    </div>
  )
}

export default ManageBike;
