import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from '@iconify/react';
import { Space, Table } from 'antd';
import { Input, Button, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const { Search } = Input;

const district = [
  {
    label: 'District',
    key: '1',
    icon: <Icon icon="carbon:location" />,
  },
  // Add more menu items here
];

const province = [
  {
    label: 'Province',
    key: '1',
    icon: <Icon icon="carbon:location" />,
  },
  // Add more menu items here
];

const columns = [
  {
    title: 'Name',
    dataIndex: 'warehouseName',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'District',
    dataIndex: 'district',
    key: 'district',
  },
  {
    title: 'Province',
    dataIndex: 'province',
    key: 'province',
  },
  {
    title: 'Phone',
    key: 'phone',
    dataIndex: 'phone',
  },
  {
    title: 'Capacity',
    key: 'capacity',
    dataIndex: 'capacity',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <button className="mr-3">
          <Icon icon="grommet-icons:update" className="text-green-500 text-2xl" />
        </button>
        <button className="mr-3">
          <Icon icon="mingcute:delete-line" className="text-red-500 text-2xl" />
        </button>
      </Space>
    ),
  },
];

function WarehousesList() {
  const [warehouses, setWarehouses] = useState([]); // Corrected state name

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/warehouses/getallwarehouse"
      );
      setWarehouses(response.data); // Setting fetched data to state
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSearch = (value) => console.log(value);

  return (
    <>
      <div className="flex justify-between items-center h-[70px] bg-white rounded-[11px] m-[15px] px-[15px]">
        <h1 className="text-2xl font-semibold font-Poppins">All Warehouses</h1>
        <Search
          placeholder="Search by name"
          onSearch={onSearch}
          style={{ width: 200 }}
        />
        <div>
          <Dropdown.Button
            menu={{ items: district }}
            icon={<DownOutlined />}
          >
            Select by District
          </Dropdown.Button>
        </div>
        <div>
          <Dropdown.Button
            menu={{ items: province }}
            icon={<DownOutlined />}
          >
            Select by Province
          </Dropdown.Button>
        </div>
        <Button
          icon={
            <Icon
              icon="ic:outline-plus"
              className="text-white"
            />
          }
          className="bg-green-700 text-white"
          size="large"
        >
          Add warehouse
        </Button>
      </div>

      <Table columns={columns} dataSource={warehouses} className="ml-4 mr-3" /> {/* Use warehouses as dataSource */}
    </>
  );
}

export default WarehousesList;
