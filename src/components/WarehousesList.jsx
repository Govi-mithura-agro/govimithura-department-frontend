import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Icon } from '@iconify/react';
import { Space, Table, Modal, Input, Button,Menu,Dropdown,message,Popconfirm } from 'antd';
import { DownOutlined  } from '@ant-design/icons';

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
  const [uopen, usetOpen] = useState(false);
  const [uloading, usetLoading] = useState(false);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [districtOptions, setDistrictOptions] = useState([]);
  
  const showLoading = () => {
    setOpen(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  
  const [selectedwarehouse,setselectedwarehouse]=useState(null);
  const [warehouse, setwarehouse] = useState('');

 

  const closeUpdateModal = () => {
    usetOpen(false);
    setselectedwarehouse(null);

    
  };


  
  
 // Mapping of provinces to their respective districts
 const provinceDistrictMap = {
  "North Central": ["Anuradhapura", "Polonnaruwa"],
  "NorthWestern": ["Kurunegala", "Puttalam"],
  "North sss": ["Kssssurunegala", "Pssssuttalam"],
  "Central": ["Kalutara", "Pssssuttalam"],

};

const provinces = Object.keys(provinceDistrictMap);

const fetchData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/warehouses/getallwarehouse");
    setWarehouses(response.data);
    setFilteredWarehouses(response.data);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  fetchData();
}, []);

const handleProvinceChange = (province) => {
  setProvince(province);
  setDistrict(""); // Reset district on province change
  setDistrictOptions(provinceDistrictMap[province] || []); // Update district options
  handleFilter(province, ""); // Use empty string for district
};


const handleDistrictChange = (district) => {
  setDistrict(district); // Set district instead of province
  handleFilter(province, district); // Use current province and selected district
};


const handleFilter = (province, district) => {
  let filtered = warehouses;

  if (province) {
    filtered = filtered.filter((warehouse) => warehouse.province === province);
  }

  if (district) {
    filtered = filtered.filter((warehouse) => warehouse.district === district);
  }

  if (searchTerm) {
    filtered = filtered.filter((warehouse) =>
      warehouse.warehouseName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  setFilteredWarehouses(filtered);
};




 // Search filter logic
 const onSearch = (value) => {
  setSearchTerm(value);
  const filtered = warehouses.filter(warehouse =>
    warehouse.warehouseName.toLowerCase().includes(value.toLowerCase())
  );
  setFilteredWarehouses(filtered);  // Update filtered data
};


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


      message.success('ware house added successfully!').then(() => {
        window.location.reload();
      });;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  


  

//get data forthe update ware house
const showUpdateModal = async (id) => {
  usetOpen(true);
  usetLoading(true);
  setSelectedWarehouseId(id);

  try {
    const response = await axios.post(`http://localhost:5000/api/warehouses/getwarehouse/${id}`);
    setWarehouseName(response.data.warehouse.warehouseName);
    setProvince(response.data.warehouse.province);
    setDistrict(response.data.warehouse.district);
    setPhone(response.data.warehouse.phone);
    setCapacity(response.data.warehouse.capacity);
  } catch (error) {
    console.log(error);
  } finally {
    usetLoading(false);
  }
};

const updateWarehouse = async (e) => {
  e.preventDefault();

  const updateData = {
    warehouseName,
    district,
    province,
    phone,
    capacity,
  };

  try {
    const response = await axios.put(`http://localhost:5000/api/warehouses/updatewarehouse/${selectedWarehouseId}`, updateData);
    console.log(response.data);
    message.success('ware house updated successfully!').then(() => {
      window.location.reload();
    });;
  } catch (error) {
    console.log(error);
  }
};




const deletewarehouse = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/warehouses/delete/${id}`);
    message.success('Warehouse deleted successfully');
    window.location.reload();
  } catch (error) {
    console.log(error);
    message.error('Failed to delete warehouse');
  }
};

const provinceMenu = (
  <Menu onClick={({ key }) => handleProvinceChange(key)}>
    <Menu.Item key="">All Provinces</Menu.Item>
    {Object.keys(provinceDistrictMap).map(prov => (
      <Menu.Item key={prov}>{prov}</Menu.Item>
    ))}
  </Menu>
);

const districtMenu = (
  <Menu onClick={({ key }) => handleDistrictChange(key)}>
    <Menu.Item key="">All Districts</Menu.Item>
    {districtOptions.map(dist => (
      <Menu.Item key={dist}>{dist}</Menu.Item>
    ))}
  </Menu>
);



const columns = [
  {
    title: <div className="text-left">Name</div>,
    dataIndex: 'warehouseName',
    key: 'name',
    render: (text) => <button>{text}</button>,
  },
  {
    title: <div className="text-left">Province</div>,
    dataIndex: 'province',
    key: 'province',
  },
  {
    title: <div className="text-left">District</div>,
    dataIndex: 'district',
    key: 'district',
  },
  {
    title: <div className="text-left">Phone</div>,
    key: 'phone',
    dataIndex: 'phone',
  },
  {
    title: <div className="text-left">Capacity</div>,
    key: 'capacity',
    dataIndex: 'capacity',
  },
    {
      title: <div className="text-center">Action</div>,
      key: 'action',
      render: (_, record) => (
        <Space size="middle" className="flex justify-center">
          <button onClick={() => showUpdateModal(record._id)} className="ml-4">
            <Icon icon="mage:edit" className="text-green-500 text-2xl" />
          </button>
          <Popconfirm
    title="Delete the warehouse"
    description="Are you sure to delete this warehouse?"
    okText="Yes"
    cancelText="No"
    onConfirm={() => deletewarehouse(record._id)} // Pass the relevant warehouse id
  >
   <button className="ml-4">
            <Icon icon="mingcute:delete-line" className="text-red-500 text-2xl" />
          </button>
  </Popconfirm>
        </Space>
      ),
    },
  ];
  
  
  
 
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <a href="#">Dashboard</a>
      </Menu.Item>
      <Menu.Item key="2">
        <a href="#">Settings</a>
      </Menu.Item>
      <Menu.Item key="3">
        <a href="#">Earnings</a>
      </Menu.Item>
      <Menu.Item key="4">
        <a href="#">Sign out</a>
      </Menu.Item>
    </Menu>
  );


  <Popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
    okText="Yes"
    cancelText="No"
  >
  </Popconfirm>





  return (
    <>


      <div className="flex justify-between items-center h-[70px] bg-white rounded-[11px] m-[15px] px-[15px]">
        <h1 className="text-2xl font-semibold font-Poppins">All Warehouses</h1>
        <Search
          placeholder="Search by Name"
          value={searchTerm}
          onSearch={onSearch}  // Ant Design's Search uses onSearch for handling search
          onChange={(e) => setSearchTerm(e.target.value)}  // Allow live update in the input field
          prefix={<Icon icon="material-symbols:search" className="text-gray-500 text-xl" />}
          style={{ width: 200 }}
        />



<Dropdown overlay={provinceMenu}>
  <Button>
    {province || "Province"} <DownOutlined />
  </Button>
</Dropdown>
<Dropdown overlay={districtMenu}>
  <Button>
    {district || "District"} <DownOutlined />
  </Button>
</Dropdown>


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
            <label className="block mb-2 text-sm font-medium text-gray-500">Select Province</label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            >
              <option  value="">Select here</option>
              <option value="North Central">North Central</option>
              <option value="NorthWestern">NorthWestern</option>
              <option value="Eastern">Eastern</option>
              <option value="Central">Central</option>
              <option value="Uva">Uva</option>
              <option value="Sabaragamuwa">Sabaragamuwa</option>
              <option value="Southern">Southern</option>
            </select>
            {/* District Select */}
            <label className="block mb-2 text-sm font-medium text-gray-500 mt-4">Select District</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            >
              <option value="">Select here</option>
              <option value="Anuradhapura">Anuradhapura</option>
              <option value="Colombo">Colombo</option>
              <option value="Galle">Galle</option>
              <option value="Gampaha">Gampaha</option>
              <option value="Hambantota">Hambantota</option>
              <option value="Jaffna">	Jaffna</option>
              <option value="	Kalutara">Kalutara</option>
              <option value="	Kandy">Kandy</option>
              <option value="	Kalutara">Kalutara</option>
              <option value="	Kegalle">Kegalle</option>
              <option value="	Kilinochchi">Kilinochchi</option>
              <option value="	Kurunegala">Kurunegala</option>
              <option value="	Mannar">Mannar</option>
              <option value="	Matale">Matale</option>
              <option value="	Matara">Matara</option>
              
            </select>
            {/* Phone Number Input */}
            <div className="relative z-0 w-full mb-5 group mt-2">
            <input
  type="tel"
  value={phone}
  onChange={(e) => {
    const value = e.target.value;
    // Allow only numeric input and enforce length limit
    if (/^\d{0,10}$/.test(value)) {
      setPhone(value);
    }
  }}
  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
  placeholder=""
  pattern="\d{10}" // Ensure exactly 10 digits
    title="Please enter a 10-digit phone number"
  maxLength={10}
  required
/>

              <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone Number</label>
            </div>
            {/* Capacity Input */}
            <div className="relative z-0 w-full mb-5 group">
            <input
  type="number"
  value={capacity}
  onChange={(e) => {
    const value = e.target.value;
    // Allow only numeric input and handle invalid cases
    if (/^\d*$/.test(value)) {
      setCapacity(value);
    }
  }}
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

        {/*warehouse update form */}
        <Modal
        title="Update Warehouse"
          open={uopen}
          footer={null}
          onCancel={closeUpdateModal}
      >
         <form onSubmit={updateWarehouse} className="max-w-md mx-auto">
            {/* Warehouse Name Input */}
            <div class="mb-5 mt-5">
    <label for="email" class="block mb-2 text-sm font-medium text-gray-400 dark:gray-900">Ware house name</label>
    <input type="text"
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
             class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-200  dark:placeholder-gray-400   dark:shadow-sm-light"   />
  </div>
            {/* Province Select */}
            <label className="block mb-2 text-sm font-medium text-gray-900">Select Province</label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            >
             <option  value="">Select here</option>
              <option value="North Central">North Central</option>
              <option value="NorthWestern">NorthWestern</option>
              <option value="Eastern">Eastern</option>
              <option value="Central">Central</option>
              <option value="Uva">Uva</option>
              <option value="Sabaragamuwa">Sabaragamuwa</option>
              <option value="Southern">Southern</option>
            </select>
            {/* District Select */}
            <label className="block mb-2 text-sm font-medium text-gray-900 mt-4">Select District</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            >
               <option value="">Select here</option>
              <option value="Anuradhapura">Anuradhapura</option>
              <option value="Colombo">Colombo</option>
              <option value="Galle">Galle</option>
              <option value="Gampaha">Gampaha</option>
              <option value="Hambantota">Hambantota</option>
              <option value="Jaffna">	Jaffna</option>
              <option value="	Kalutara">Kalutara</option>
              <option value="	Kandy">Kandy</option>
              <option value="	Kalutara">Kalutara</option>
              <option value="	Kegalle">Kegalle</option>
              <option value="	Kilinochchi">Kilinochchi</option>
              <option value="	Kurunegala">Kurunegala</option>
              <option value="	Mannar">Mannar</option>
              <option value="	Matale">Matale</option>
              <option value="	Matara">Matara</option>
            </select>
            <div class="mb-5 mt-4">
    <label for="number" class="block mb-2 text-sm font-medium text-gray-400 dark:gray-900">Phone number</label>
    <input 
    type="tel"
    value={phone}
    onChange={(e) => {
        // Only set the phone if it consists of digits and has a max length of 10
        const value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
        if (value.length <= 10) {
            setPhone(value);
        }
    }}
    class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-200 dark:placeholder-gray-400 dark:shadow-sm-light"
    pattern="\d{10}" // Ensure exactly 10 digits
    title="Please enter a 10-digit phone number"
/>

  </div>
  <div class="mb-5 mt-4">
    <label for="number" class="block mb-2 text-sm font-medium text-gray-400 dark:gray-900">Capasity</label>
    <input type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
           class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-200  dark:placeholder-gray-400   dark:shadow-sm-light"  />
  </div>
  
  
  
            
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Update
            </button>
          </form>
      </Modal>

      </div>
      <Table columns={columns} dataSource={filteredWarehouses} className="ml-4 mr-3" />
    </>
  );
};

export default WarehousesList;
