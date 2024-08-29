import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from '@iconify/react';
import { Space, Table } from 'antd';
import { Input, Button, Dropdown,Modal } from 'antd';
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


  //add warehouses
 
   const [open, setOpen] = React.useState(false);
   const [loading, setLoading] = React.useState(true);
 
   const showLoading = () => {
     setOpen(true);
     setLoading(true);
 
     // Simple loading mock. You should add cleanup logic in real world.
     setTimeout(() => {
       setLoading(false);
     }, 2000);
   };
 //add warehouse for the System
 const [warehouseName, setwarehouseName] = useState("");
 const [province, setprovince] = useState("");
 const [district, setdistrict] = useState("");
 const [phone, setphone] = useState("");
 const [capacity, setcapacity] = useState("");

 async function addwarehouse(event) {
   event.preventDefault();

  
     const warehouse = {
      warehouseName,
      district,
      province,
      phone,
      capacity
     };

     try {
       
       const result = await axios.post(
         "http://localhost:5000/api/warehouses/addwarehouse",
         warehouse
       );

       console.log(result.data);
      
         window.location.reload();
       
      
       
     } catch (error) {
       console.log(error);
       setLoading(false);
     }
   
 }


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
           onClick={showLoading}
        >
          Add warehouse
        </Button>
        <Modal
        title={<p>Enter warehouse details...</p>}
        footer={
          <></>
        }
        loading={loading}
        open={open}
        onCancel={() => setOpen(false)}
      >
        
        <form onSubmit={addwarehouse} className="max-w-md mx-auto">
  <div className="relative w-full mb-5 group">
  <div class="relative z-0 w-full mb-5 group mt-2">
      <input type="text" value={warehouseName} onChange={(e) => setwarehouseName(e.target.value)} name="floating_email" id="floating_email" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
      <label for="floating_email" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone number</label>
  </div>
  <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Select an option</label>
  <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
    <option selected>Choose a Province</option>
    <option value="US">United States</option>
    <option value="CA">Canada</option>
    <option value="FR">France</option>
    <option value="DE">Germany</option>
  </select>
  <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400 mt-4">Select an option</label>
  <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 ">
    <option selected>Choose a District</option>
    <option value="US">A</option>
    <option value="CA">B</option>
    <option value="FR">C</option>
    <option value="DE">D</option>
  </select>
  <div class="relative z-0 w-full mb-5 group mt-2">
      <input type="number" value={phone} onChange={(e) => setphone(e.target.value)} name="floating_email" id="floating_email" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
      <label for="floating_email" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone number</label>
  </div>
  <div class="relative z-0 w-full mb-5 group">
      <input type="number" value={capacity} onChange={(e) => setcapacity(e.target.value)}  name="floating_email" id="floating_email" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
      <label for="floating_email" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Capacity</label>
  </div>
  </div>
  <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>

</form>


      </Modal>
      </div>

      <Table columns={columns} dataSource={warehouses} className="ml-4 mr-3" /> {/* Use warehouses as dataSource */}
    </>
  );
}

export default WarehousesList;
