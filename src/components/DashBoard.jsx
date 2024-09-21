import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Avatar, Tag } from 'antd';
import { Doughnut } from "react-chartjs-2";
import Fertilizerbarchart from "./Fertilizerbarchart";


import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Link } from 'react-router-dom';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const pieChartData = {
  labels: ['Label 1', 'Label 2', 'Label 3'],
  datasets: [
    {
      label: "Packages",
      data: [10, 20, 30],
      backgroundColor: [
        "#82cd47",
        "#379237",
        "#f0ff42",
      ],
      borderWidth: 1,
    },
  ],
}


const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
};

// Sample farmers data
const dataSource = [
  {
    key: '1',
    fullname: 'Neil Sims',
    district: 'email@example.com',
    profileImage: 'https://via.placeholder.com/32x32',
   
  },
  {
    key: '2',
    fullname: 'Jane Doe',
    district: 'jane@example.com',
    profileImage: 'https://via.placeholder.com/32x32',
   
  },
  
];

// Table columns
const farmerColumns = [
  {
    title: 'Name',
    dataIndex: 'fullname',
    key: 'fullname',
    render: (text, record) => (
      <div className="flex items-center gap-2">
        <Avatar src={record.profileImage} />
        <div>
          <div className="text-base font-semibold">{record.fullname}</div>
        </div>
      </div>
    ),
  },
  {
    title: 'District',
    dataIndex: 'district',
    key: 'district',
    render: (text, record) => (
      <span className="font-semibold">
        {record.address && record.address.district ? record.address.district : 'N/A'}
      </span>
    ),
  },
];


const updatecolumns = [
  {
    title: 'Fertilizer Name',
    dataIndex: 'fertilizerName',
    key: 'fertilizerName',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Wanted Date',
    dataIndex: 'wantedDate',  // Corrected to 'wantedDate'
    key: 'wantedDate',
  },
  {
    title: 'Quantity (Kg)',
    dataIndex: 'quantity',  // Corrected to 'quantity'
    key: 'quantity',
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
];

const data = [
  {
    key: '1',
    fertilizerName: 'Payment from Bonnie Green',
    wanteddate: 'New York No. 1 Lake Park',
    quentity: 15000,
    tags: ['nice'],
  },
  {
    key: '2',
    fertilizerName: 'Payment from Bonnie Green',
   wanteddate: 'New York No. 1 Lake Park',
    quentity: 15000,
    tags: ['nice'],
  },
  {
    key: '3',
    fertilizerName: 'Payment from Bonnie Green',
    wanteddate: 'New York No. 1 Lake Park',
    quentity: 15000,
    tags: ['nice'],
  },
];



function DashBoard() {

  const [warehouseCount, setwarehouseCount] = useState(0); // State to store the farmer count
  const [farmersCount, setfarmersCount] = useState(0);
  const [managersCount, setmanagersCount] = useState(0);

  useEffect(() => {
    // Fetch all farmers to get the count
    const fetchWarehouseCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/warehouses/getallwarehouse'); // Make sure this endpoint matches your backend route
        setwarehouseCount(response.data.length);  // Set the farmer count
      } catch (error) {
        console.error('Error fetching warehouse count:', error);
      }
    };

    fetchWarehouseCount();

    const fetchFarmersCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/farmers/getAllFarmers'); // Make sure this endpoint matches your backend route
        setfarmersCount(response.data.length);  // Set the farmer count
      } catch (error) {
        console.error('Error fetching farmer count:', error);
      }
    };
  
    fetchFarmersCount();

    const managersCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/managers/getallmanagers'); // Make sure this endpoint matches your backend route
        setmanagersCount(response.data.length);  // Set the farmer count
      } catch (error) {
        console.error('Error fetching farmer count:', error);
      }
    };
  
    managersCount();
  
  
   
  }, []);


  const [farmersStatusCount, setFarmersStatusCount] = useState({ active: 0, unverified: 0 });

  useEffect(() => {
    const fetchFarmersVerificationData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/farmers/getAllFarmers'); 
        const farmers = response.data;

        // Calculate counts for Active and Unverified farmers
        const activeCount = farmers.filter(farmer => farmer.status === "Verified").length;
        const unverifiedCount = farmers.filter(farmer => farmer.status === "Unverified").length;

        setFarmersStatusCount({ active: activeCount, unverified: unverifiedCount });
      } catch (error) {
        console.error('Error fetching farmer verification data:', error);
      }
    };

    fetchFarmersVerificationData();
  }, []);
   
  const [fertilizerRequests, setFertilizerRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [latesFarmers, setlatesFarmers] = useState([]);
  const [filterLatesFarmers, setfilterLatesFarmers] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/fertilizers/getallFertilizerRequest");
      setFertilizerRequests(response.data);
      setFilteredRequests(response.data.slice(0, 3)); // Initialize filteredRequests with only the first 5 entries
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


//get lates farmesr
  const fetchFarmerData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/farmers/getAllFarmers");
      setlatesFarmers(response.data);
      setfilterLatesFarmers(response.data.slice(0, 3)); // Initialize filteredRequests with only the first 5 entries
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFarmerData();
  }, []);
  
  const user = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <div className='mr-3 '>
   
      {/* Existing sections */}
      <div className='ml-6'>
      <div className="w-[266px] h-[138px] mt-4 ml-4 pl-5 pr-3 py-3 bg-[#379237]/50 rounded-[11px] border flex-col justify-center items-center gap-4 inline-flex">
        <div className="self-stretch text-black text-lg font-medium font-['Poppins'] leading-7">All Users</div>
        <div className="self-stretch text-black text-4xl font-medium font-['Poppins'] leading-7">{farmersCount+managersCount}</div>
      </div>
      <div className="w-[266px] h-[138px] mt-5 ml-10 pl-5 pr-3 py-3 bg-[#54b435]/40 rounded-[11px] border flex-col justify-center items-center gap-4 inline-flex">
        <div className="self-stretch text-black text-lg font-medium font-['Poppins'] leading-7">Farmers</div>
        <div className="self-stretch text-black text-4xl font-medium font-['Poppins'] leading-7">{farmersCount}</div>
      </div>
      <div className="w-[266px] h-[138px] mt-5 ml-10 pl-5 pr-3 py-3 bg-[#82cd47]/50 rounded-[11px] border flex-col justify-center items-center gap-4 inline-flex">
        <div className="self-stretch text-black text-lg font-medium font-['Poppins'] leading-7">Warehouses</div>
        <div className="self-stretch text-black text-4xl font-medium font-['Poppins'] leading-7">{warehouseCount}</div>
      </div>
      <div className="w-[266px] h-[138px] mt-5 ml-10 pl-5 pr-3 py-3 bg-[#f0ff42]/50 rounded-[11px] border flex-col justify-center items-center gap-4 inline-flex">
        <div className="self-stretch text-black text-lg font-medium font-['Poppins'] leading-7">Managers</div>
        <div className="self-stretch text-black text-4xl font-medium font-['Poppins'] leading-7">{managersCount}</div>
      </div>
      </div>

      {/* New section */}
      <div className="flex mt-8 ml-4 space-x-10">
        <div className="w-[645px] h-[345px] bg-white rounded-[11px] flex flex-col ">
          <div className="w-[272px] h-[74px] mb-4 p-4">
            <div className="w-[200px] h-[22px] text-gray-900 text-xl font-medium font-['DM Sans'] leading-normal">
              Warehouses
            </div>
           
            <div className="text-[#a3aed0] text-sm font-medium font-['DM Sans'] leading-normal mt-2">
              All of warking warehouses
            </div>
            <div className="bar_chart">
                        <Fertilizerbarchart/>
                    </div>
          </div>
        </div>

        <div className="w-[545px] h-[345px] bg-white rounded-[11px] flex flex-col ">
          <div className="w-[262px] h-[74px] mb-4 p-4">
            <div className="booking_dashboard_doughnut_container ">
              <h4>Farmer verification</h4>
              <p className='text-gray-400'>All verification farers summary </p>
              <div className="booking_dashboard_doughnut flex mt-10 ml-10">
  <Doughnut
    data={{
      labels: ['Active', 'Unverified'],
      datasets: [
        {
          label: "Farmers",
          data: [farmersStatusCount.active, farmersStatusCount.unverified],
          backgroundColor: [
            "#82cd47", // Active farmers
            "#f0ff42", // Unverified farmers
          ],
          borderWidth: 1,
        },
      ],
    }}
    options={options}
  />
  <div className="flex flex-col ml-6 mt-10">
    {['Varified', 'Unverified'].map((label, index) => (
      <div key={index} className="flex items-center mb-2">
        <div
          className="legend-color mt-6"
          style={{
            backgroundColor: ['#82cd47', '#f0ff42'][index], // Use the same colors from the chart
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            marginRight: '8px',
          }}
        ></div>
        <div className="w-32 mt-5">
          {label}: {index === 0 ? farmersStatusCount.active : farmersStatusCount.unverified}
        </div>
      </div>
    ))}
  </div>
</div>

            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 ml-5 mt-8 mb-8">
        {/* Latest Customers */}
        <div className="w-[380px] h-[437px] p-6 bg-white rounded-[9px] shadow flex-col justify-start items-start gap-4">
          <div className="self-stretch justify-start items-start gap-2.5 inline-flex mt-2">
            <div className="grow shrink basis-0 text-gray-900 text-xl font-semibold">Latest Customers</div>
            <Link to="/farmers">
  <button className="px-4 py-2 bg-green-700 ml-20 mb-2 text-white rounded-lg text-xs font-bold">
    View All
  </button>
</Link>
          </div>
          <Table dataSource={filterLatesFarmers} columns={farmerColumns} pagination={false} className='mt-2' />
        </div>

        {/* Updates section */}
        <div className="w-[830px] h-[438px] bg-white rounded-[11px] flex flex-col p-4">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Fertilizer Request</h1>
              <p className="text-sm text-gray-500">List of latest fertilizer request.</p>
            </div>
            <Link to="/fertilizerrequests">
  <button className="px-4 py-2 bg-green-700 text-white rounded-lg text-xs font-bold">
    View All
  </button>
</Link>

          </div>
          <div className="overflow-x-auto">
          <Table columns={updatecolumns} dataSource={filteredRequests} />

</div>

        </div>
      </div>
    </div>
  );
}

export default DashBoard;
