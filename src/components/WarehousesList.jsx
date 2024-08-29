import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from '@iconify/react';
import { Space, Table, Modal, Input, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const { Search } = Input;

const WarehousesList = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [warehouseName, setWarehouseName] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [phone, setPhone] = useState("");
  const [capacity, setCapacity] = useState("");

  const showLoading = () => {
    setOpen(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/warehouses/getallwarehouse");
      setWarehouses(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSearch = (value) => console.log(value);

  const addWarehouse = async (event) => {
    event.preventDefault();
    const warehouse = {
      warehouseName,
      district,
      province,
      phone,
      capacity
    };
    try {
      const result = await axios.post("http://localhost:5000/api/warehouses/addwarehouse", warehouse);
      console.log(result.data);
      window.location.reload();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'warehouseName',
      key: 'name',
      render: (text) => <button>{text}</button>,
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
          <button  onClick={showLoading} className="mr-3">
            <Icon icon="grommet-icons:update" className="text-green-500 text-2xl" />
          </button>
          <button className="mr-3">
            <Icon icon="mingcute:delete-line" className="text-red-500 text-2xl" />
          </button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center h-[70px] bg-white rounded-[11px] m-[15px] px-[15px]">
        <h1 className="text-2xl font-semibold font-Poppins">All Warehouses</h1>
        <Search
          placeholder="Search by name"
          onSearch={onSearch}
          style={{ width: 200 }}
        />
        <Button
          icon={<Icon icon="ic:outline-plus" className="text-white" />}
          className="bg-green-700 text-white"
          size="large"
          onClick={showLoading}
        >
          Add warehouse
        </Button>
        <Modal
          title={<p>Enter warehouse details...</p>}
          footer={null}
          open={open}
          onCancel={() => setOpen(false)}
        >
          <form onSubmit={addWarehouse} className="max-w-md mx-auto">
            {/* Warehouse Name Input */}
            <div className="relative z-0 w-full mb-5 group mt-2">
              <input
                type="text"
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
                required
              />
              <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Warehouse Name</label>
            </div>
            {/* Province Select */}
            <label className="block mb-2 text-sm font-medium text-gray-900">Select Province</label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            >
              <option value="Province1">Province 1</option>
              <option value="Province2">Province 2</option>
              <option value="Province3">Province 3</option>
            </select>
            {/* District Select */}
            <label className="block mb-2 text-sm font-medium text-gray-900 mt-4">Select District</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            >
              <option value="DistrictA">District A</option>
              <option value="DistrictB">District B</option>
              <option value="DistrictC">District C</option>
            </select>
            {/* Phone Number Input */}
            <div className="relative z-0 w-full mb-5 group mt-2">
              <input
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
                required
              />
              <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone Number</label>
            </div>
            {/* Capacity Input */}
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
                required
              />
              <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Capacity</label>
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Submit
            </button>
          </form>
        </Modal>

        


      </div>
      <Table columns={columns} dataSource={warehouses} className="ml-4 mr-3" />
    </>
  );
};

export default WarehousesList;
