import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from '@iconify/react';
import { Table, Space, Input, Button, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons'; // Import the search icon

const { Search } = Input;

const columns = (approve, disapprove) => [
  {
    title: <div className="text-center">Fertilizer Name</div>,
    dataIndex: 'fertilizerName',
    key: 'fertilizerName',
    render: (text) => <a>{text}</a>,
  },
  {
    title: <div className="text-center">Request Date</div>,
    dataIndex: 'requestDate',
    key: 'requestDate',
  },
  {
    title: <div className="text-center">Wanted Date</div>,
    dataIndex: 'wantedDate',
    key: 'wantedDate',
  },
  {
    title: <div className="text-center">Quantity (Kg)</div>,
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: <div className="text-center">Description</div>,
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: <div className="text-center">Status</div>,
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      let color = '';
      if (status === "Pending") {
        color = 'blue';
      } else if (status === "Approved") {
        color = 'green';
      } else if (status === "Disapproved") {
        color = 'red';
      }
      return (
        <Tag
          color={color}
          style={{
            fontSize: '14px',
            padding: '4px 10px',
            width: '100px',
            textAlign: 'center',
          }}
        >
          {status}
        </Tag>
      );
    },
  },
  {
    title: <div className="text-center">Action</div>,
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        {record.status === "Pending" ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="mr-3 bg-green-700 hover:bg-green-600 text-white font-light py-2 px-4 border rounded h-8 shadow transition-transform duration-300 ease-in-out transform hover:scale-110 w-24 flex items-center justify-center"
              onClick={() => approve(record._id)}
            >
              Approve
            </button>
            <button
              className="mr-3 bg-red-500 hover:bg-red-400 text-white font-light py-2 px-4 border rounded h-8 shadow transition-transform duration-300 ease-in-out transform hover:scale-110 w-24 flex items-center justify-center"
              onClick={() => disapprove(record._id)}
            >
              Disapprove
            </button>
          </div>
        ) : (
          <span>
            <div className="flex justify-between">
              <button
                className="mr-3 bg-gray-300 text-white font-light py-2 px-4 border rounded h-8 shadow w-24 flex items-center justify-center"
              >
                Approve
              </button>
              <button
                className="ml-2 bg-gray-300 text-white font-light py-2 px-4 border rounded h-8 shadow w-24 flex items-center justify-center"
              >
                Disapprove
              </button>
            </div>
          </span>
        )}
      </Space>
    ),
  },
];

function FertilizerRequests() {
  const [fertilizerRequests, setFertilizerRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/fertilizers/getallFertilizerRequest");
      setFertilizerRequests(response.data);
      setFilteredRequests(response.data); // Initialize filteredRequests with all data
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function approve(requestid) {
    try {
      const result = await axios.post("http://localhost:5000/api/fertilizers/approveFertilizerRequest", {
        requestid,
      });
      console.log(result.data);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }

  async function disapprove(requestid) {
    try {
      const result = await axios.post("http://localhost:5000/api/fertilizers/disapproveFertilizerRequest", {
        requestid,
      });
      console.log(result.data);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }

  const handleSearch = (event) => {
    const { value } = event.target;
    const filtered = fertilizerRequests.filter(request =>
      request.fertilizerName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRequests(filtered);
  };

  return (
    <>
      <div className="flex justify-between items-center h-[70px] bg-white rounded-[11px] m-[15px] px-[15px]">
        <h1 className="text-2xl font-semibold font-Poppins">Fertilizer Requests</h1>
        <Input
          placeholder="Search by Name"
          onChange={handleSearch}
          prefix={<Icon icon="material-symbols:search" className="text-gray-500 text-xl" />} // Add search icon here
          style={{ width: 200 }}
        />
        <Button
          icon={<Icon icon="ph:printer" className="text-gray-300" />}
          className="bg-green-700 text-white"
        >
          Explore
        </Button>
      </div>

      <Table 
        columns={columns(approve, disapprove)} 
        dataSource={filteredRequests} 
        rowKey="_id" 
        className="ml-4 mr-3" 
      />
    </>
  );
}

export default FertilizerRequests;
