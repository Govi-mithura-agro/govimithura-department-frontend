import React from 'react';
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
};

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
};

// Sample customer data
const dataSource = [
  {
    key: '1',
    name: 'Neil Sims',
    email: 'email@example.com',
    avatar: 'https://via.placeholder.com/32x32',
    amount: '12500 LKR',
  },
  {
    key: '2',
    name: 'Jane Doe',
    email: 'jane@example.com',
    avatar: 'https://via.placeholder.com/32x32',
    amount: '9500 LKR',
  },
  {
    key: '3',
    name: 'John Smith',
    email: 'john@example.com',
    avatar: 'https://via.placeholder.com/32x32',
    amount: '6700 LKR',
  },
];

// Table columns
const columns = [
  {
    title: 'Customer',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <div className="flex items-center gap-2">
        <Avatar src={record.avatar} />
        <div>
          <div className="text-base font-semibold">{record.name}</div>
          <div className="text-xs text-gray-500">{record.email}</div>
        </div>
      </div>
    ),
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    align: 'right',
    render: (amount) => <span className="font-semibold">{amount}</span>,
  },
];

const updatecolumns = [
  {
    title: 'TRANSACTION',
    dataIndex: 'transaction',
    key: 'transaction',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'DATE & TIME',
    dataIndex: 'date_and_time',
    key: 'date & time',
  },
  {
    title: 'AMOUNT',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'STATUS',
    key: 'status',
    dataIndex: 'status',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = 'blue';
          
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
              Complete
            </Tag>
          );
        })}
      </>
    ),
  },
];

const data = [
  {
    key: '1',
    transaction: 'Payment from Bonnie Green',
    date_and_time: 'New York No. 1 Lake Park',
    amount: 15000,
    tags: ['nice'],
  },
  {
    key: '2',
    transaction: 'Payment from Bonnie Green',
    date_and_time: 'New York No. 1 Lake Park',
    amount: 15000,
    tags: ['nice'],
  },
  {
    key: '3',
    transaction: 'Payment from Bonnie Green',
    date_and_time: 'New York No. 1 Lake Park',
    amount: 15000,
    tags: ['nice'],
  },
];



function DashBoard() {
  return (
    <div>
      {/* Existing sections */}
      <div className="w-[266px] h-[138px] mt-4 ml-4 pl-5 pr-3 py-3 bg-[#379237]/50 rounded-[11px] border flex-col justify-center items-center gap-4 inline-flex">
        <div className="self-stretch text-black text-lg font-medium font-['Poppins'] leading-7">All Users</div>
        <div className="self-stretch text-black text-4xl font-medium font-['Poppins'] leading-7">24</div>
      </div>
      <div className="w-[266px] h-[138px] mt-5 ml-14 pl-5 pr-3 py-3 bg-[#54b435]/40 rounded-[11px] border flex-col justify-center items-center gap-4 inline-flex">
        <div className="self-stretch text-black text-lg font-medium font-['Poppins'] leading-7">Farmers</div>
        <div className="self-stretch text-black text-4xl font-medium font-['Poppins'] leading-7">100</div>
      </div>
      <div className="w-[266px] h-[138px] mt-5 ml-14 pl-5 pr-3 py-3 bg-[#82cd47]/50 rounded-[11px] border flex-col justify-center items-center gap-4 inline-flex">
        <div className="self-stretch text-black text-lg font-medium font-['Poppins'] leading-7">Warehouses</div>
        <div className="self-stretch text-black text-4xl font-medium font-['Poppins'] leading-7">10</div>
      </div>
      <div className="w-[266px] h-[138px] mt-5 ml-14 pl-5 pr-3 py-3 bg-[#f0ff42]/50 rounded-[11px] border flex-col justify-center items-center gap-4 inline-flex">
        <div className="self-stretch text-black text-lg font-medium font-['Poppins'] leading-7">Managers</div>
        <div className="self-stretch text-black text-4xl font-medium font-['Poppins'] leading-7">4</div>
      </div>

      {/* New section */}
      <div className="flex mt-8 ml-4 space-x-10">
        <div className="w-[645px] h-[345px] bg-white rounded-[11px] flex flex-col ">
          <div className="w-[272px] h-[74px] mb-4 p-4">
            <div className="w-[200px] h-[22px] text-gray-900 text-xl font-medium font-['DM Sans'] leading-normal">
              Fertilizers Amount
            </div>
           
            <div className="text-[#a3aed0] text-sm font-medium font-['DM Sans'] leading-normal mt-2">
              Visitors per day
            </div>
            <div className="bar_chart">
                        <Fertilizerbarchart  />
                    </div>
          </div>
        </div>

        <div className="w-[545px] h-[345px] bg-white rounded-[11px] flex flex-col ">
          <div className="w-[262px] h-[74px] mb-4 p-4">
            <div className="booking_dashboard_doughnut_container ">
              <h4>Login Catagoury</h4>
              <p className='text-gray-400'>popular Categories among users </p>
              <div className="booking_dashboard_doughnut flex mt-10 ml-10">
                <Doughnut data={pieChartData} options={options} />
                <div className="flex flex-col ml-8 mt-10">
                  {pieChartData.labels.map((label, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <div
                        className="legend-color"
                        style={{
                          backgroundColor:
                            pieChartData.datasets[0].backgroundColor[index],
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          marginRight: '8px',
                        }}
                      ></div>
                      <div className="legend-label">User</div>
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
          <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
            <div className="grow shrink basis-0 text-gray-900 text-xl font-semibold">Latest Customers</div>
          </div>
          <Table dataSource={dataSource} columns={columns} pagination={false} />
        </div>

        {/* Updates section */}
        <div className="w-[830px] h-[438px] bg-white rounded-[11px] flex flex-col p-4">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Updates</h1>
              <p className="text-sm text-gray-500">List of latest transactions.</p>
            </div>
            <button className="px-4 py-2 bg-green-700 text-white rounded-lg text-xs font-bold">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <Table columns={updatecolumns} dataSource={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
