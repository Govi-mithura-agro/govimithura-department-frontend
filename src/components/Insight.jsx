import React, { useEffect, useState,useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Icon } from '@iconify/react';
import { Doughnut } from "react-chartjs-2";
import { Space, Table, Modal, Input, Button,Menu,Dropdown,message,Tag } from 'antd';
import { DownOutlined  } from '@ant-design/icons';
import Chart from "chart.js/auto";

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


function Warehousebarchart({ chartWidth = 800, chartHeight = 500 }) {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  const labels = ['Warehouse', 'Warehouse', 'Warehouse', 'Warehouse', 'Warehouse', 'Warehouse', 'Warehouse'];
  const data = [
    { day: 'Warehouse', count: 5 },
    { day: 'Warehouse', count: 10 },
    { day: 'Warehouse', count: 15 },
    { day: 'Warehouse', count: 20 },
    { day: 'Warehouse', count: 25 },
    { day: 'Warehouse', count: 30 },
    { day: 'Warehouse', count: 35 },
  ];

  const createChart = (labels, data) => {
    const ctx = canvasRef.current.getContext("2d");
    if (chartRef.current) {
      chartRef.current.destroy(); // Destroy previous chart instance
    }
    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            data: data.map((item) => item.count),
            backgroundColor: " #7ec75b",
            borderColor: "#7ec75b",
            borderRadius: 10,
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false, // Allow custom size by disabling aspect ratio
        scales: {
          x: {
            display: true,
            ticks: {
              color: "#4A4A4A", // Customize the color of the labels
              font: {
                family: "Arial", // Customize font family
                size: 14, // Customize font size
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: "#4A4A4A",
              font: {
                family: "Arial",
                size: 14,
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false, // Hide legend
          },
          tooltip: {
            enabled: true, // Enable tooltips
            backgroundColor: "#556b4b",
            titleFont: { size: 14 },
            bodyFont: { size: 12 },
          },
        },
      },
    });
  };

  useEffect(() => {
    createChart(labels, data);
  }, [labels, data]);

  return (
    <div
      className="daily-login-count-chart-container flex justify-center"
      style={{ width: '564px', height: '264px' }} // Use style to pass custom width/height
    >
      <canvas
        ref={canvasRef}
        id="LoginCountChart"
        width={chartWidth} // Set width attribute
        height={chartHeight} // Set height attribute
      ></canvas>
    </div>
  );
}



const columns = [
    {
      title: "Fertilizer",
      dataIndex: "fertilizer",
      key: "fertilizer",
    },
    {
      title: "Last Updated",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
    },
    {
      title: "Amount(Kg)",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "";
        switch (status) {
          case "low stock":
            color = "gold";
            break;
          case "out of stock":
            color = "red";
            break;
          case "available":
            color = "green";
            break;
          default:
            color = "blue";
        }
        return (
          <Tag color={color}
          style={{
            fontSize: '14px',
            padding: '4px 10px',
            width: '110px',
            textAlign: 'center',
          }}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    
  ];

  const data = [
    {
      key: '1',
      fertilizer: 'Type 1',
      lastUpdated: '2024-09-12',
      amount: '2000',
      status: 'available',
     
    },
    {
      key: '2',
      fertilizer: 'Type 1',
      lastUpdated: '2024-09-12',
      amount: '2000',
      status: 'out of stock',
    },
   { key: '3',
      fertilizer: 'Type 1',
      lastUpdated: '2024-09-12',
      amount: '2000',
      status: 'low stock',}
  ];


function Insight() {

  
  const [warehouses, setWarehouses] = useState([]);

  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [filterProvince, setFilterProvince] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");


// Filter Warehouses
const filterWarehouses = (province, district) => {
  let filtered = warehouses;

  if (province) {
    filtered = filtered.filter((warehouse) => warehouse.province === province);
  }

  if (district) {
    filtered = filtered.filter((warehouse) => warehouse.district === district);
  }

  setFilteredWarehouses(filtered);
};

// Handle province filter change
const handleProvinceFilterChange = (province) => {
  setFilterProvince(province);
  setFilterDistrict(""); // Reset district when province changes
  filterWarehouses(province, "");
};

// Handle district filter change
const handleDistrictFilterChange = (district) => {
  setFilterDistrict(district);
  filterWarehouses(filterProvince, district);
};

const provinceToDistricts = {
  "North Central": ["Anuradhapura", "Polonnaruwa"],
  "NorthWestern": ["Kurunegala", "Puttalam"],
  "Eastern": ["Ampara", "Batticaloa", "Trincomalee"],
  "Central": ["Kandy", "Matale", "Nuwara Eliya"],
  "Uva": ["Badulla", "Monaragala"],
  "Sabaragamuwa": ["Kegalle", "Ratnapura"],
  "Southern": ["Galle", "Hambantota", "Matara"]
};

const provinces = Object.keys(provinceToDistricts);


  const provinceMenu = (
  <Menu>
    <Menu.Item key="all" onClick={() => handleProvinceFilterChange("")}>
      <a href="#">All Provinces</a>
    </Menu.Item>
    {provinces.map((province) => (
      <Menu.Item key={province} onClick={() => handleProvinceFilterChange(province)}>
        <a href="#">{province}</a>
      </Menu.Item>
    ))}
  </Menu>
);

const districtMenu = (
  <Menu>
    <Menu.Item key="all" onClick={() => handleDistrictFilterChange("")}>
      <a href="#">All Districts</a>
    </Menu.Item>
    {(provinceToDistricts[filterProvince] || []).map((district) => (
      <Menu.Item key={district} onClick={() => handleDistrictFilterChange(district)}>
        <a href="#">{district}</a>
      </Menu.Item>
    ))}
  </Menu>
);


  return (
    <>
      <div className="flex justify-between items-center h-[70px] bg-white rounded-[11px] m-[15px] px-[15px]">
      <Dropdown overlay={provinceMenu} trigger={['click']} className="w-32">
        <Button>
          Province <DownOutlined />
        </Button>
      </Dropdown>
     

      <Dropdown overlay={provinceMenu} trigger={['click']}>
        <Button>
          Province <DownOutlined />
        </Button>
      </Dropdown>
      <Dropdown overlay={districtMenu} trigger={['click']}>
        <Button>
          District <DownOutlined />
        </Button>
      </Dropdown>

        <Button
         
          className="bg-green-700 text-white w-32"
          size="large"
         
        >
          Filter
        </Button>
        </div>


        <div className="flex mt-8 ml-4 space-x-10 s">
        <div className="w-[665px] h-[345px] bg-white rounded-[11px] flex flex-col ">
          <div className="w-[272px] h-[74px] mb-4 p-4">
            <div className="w-[200px] h-[22px] text-gray-900 text-xl font-medium font-['DM Sans'] leading-normal">
              Fertilizers Amount
            </div>
           
            <div className="text-[#a3aed0] text-sm font-medium font-['DM Sans'] leading-normal mt-2">
              Visitors per day
            </div>
            <div className="bar_chart">
                      <Warehousebarchart/>
                    </div>
          </div>
        </div>

        <div className="w-[525px] h-[345px] bg-white rounded-[11px] flex flex-col ">
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

      <div className="  items-center  rounded-[11px] m-[15px] px-[2] mt-6">

      <Table columns={columns} dataSource={data} pagination={false} />
      </div>
    </>
  )
}

export default Insight