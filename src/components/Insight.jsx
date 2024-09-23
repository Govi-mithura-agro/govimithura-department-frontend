import React, { useEffect, useState } from "react";
import { Space, Table, Modal, Input, Button, Menu, Dropdown, message, Tag } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import axios from 'axios';
import Insightfertilizerbarchart from "./Insightfertilizerbarchart"
import { Doughnut } from "react-chartjs-2";
import Errorimage from "../images/404_error.png"
import Search from "../images/search.png"

function Insight() {
  const [warehouses, setWarehouses] = useState([]);
  const [warehousesDistrict, setwarehousesDistrict] = useState([]);
  const [filterProvince, setFilterProvince] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [selectedWarehouseID, setSelectedWarehouseId] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);
  const [warehouseDistrict, setwarehouseDistrict] = useState("");
  const [fertilizers, setFertilizers] = useState([]);
  const [farmersStatusCount, setFarmersStatusCount] = useState({ active: 0, unverified: 0 });

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/warehouses/getallwarehouse');
        setWarehouses(response.data);
        setwarehousesDistrict(response.data);
      } catch (error) {
        console.error("Error fetching warehouses:", error);
      }
    };
    fetchWarehouses();
  }, []);

  useEffect(() => {
    const fetchFarmersVerificationData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/farmers/getAllFarmers');
        const farmers = response.data;
        const activeCount = farmers.filter(farmer => farmer.status === "Verified").length;
        const unverifiedCount = farmers.filter(farmer => farmer.status === "Unverified").length;
        setFarmersStatusCount({ active: activeCount, unverified: unverifiedCount });
      } catch (error) {
        console.error('Error fetching farmer verification data:', error);
      }
    };
    fetchFarmersVerificationData();
  }, []);

  useEffect(() => {
    if (selectedWarehouseID && selectedWarehouseID !== "No warehouses found for the selected filters.") {
      fetchData();
    }
  }, [selectedWarehouseID]);

  const filterWarehouses = () => {
    let filtered = warehouses;
    let filtereddistrict = warehousesDistrict;
    if (filterProvince) {
      filtered = filtered.filter(warehouse => warehouse.province === filterProvince);
    }
    if (filterDistrict) {
      filtered = filtered.filter(warehouse => warehouse.district === filterDistrict);
      filtereddistrict = filtered.filter(warehousesDistrict => warehousesDistrict.district === filterDistrict);
    }
    if (filtered.length > 0) {
      setSelectedWarehouseId(filtered[0]._id);
      setwarehouseDistrict(filtereddistrict[0].district);
    } else {
      setSelectedWarehouseId("No warehouses found for the selected filters.");
    }
    setIsFiltered(true);
  };

  const handleProvinceFilterChange = (province) => {
    setFilterProvince(province);
    setFilterDistrict("");
    setIsFiltered(false);
  };

  const handleDistrictFilterChange = (district) => {
    setFilterDistrict(district);
    setIsFiltered(false);
  };

  const provinceToDistricts = {
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    "North Western": ["Kurunegala", "Puttalam"],
    "North sss": ["Kssssurunegala", "Pssssuttalam"],
    "Central": ["Kalutara", "Pssssuttalam"],
    "North sss": ["Kssssurunegala", "Pssssuttalam"],
    "North sss": ["Kssssurunegala", "Pssssuttalam"],
    "North sss": ["Kssssurunegala", "Pssssuttalam"],
    // Add other provinces and districts here
  };

  const provinces = Object.keys(provinceToDistricts);

  const provinceMenu = (
    <Menu>
      <Menu.Item key="all" onClick={() => handleProvinceFilterChange("")}>
        <a href="#">All Provinces</a>
      </Menu.Item>
      {provinces.map(province => (
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
      {(provinceToDistricts[filterProvince] || []).map(district => (
        <Menu.Item key={district} onClick={() => handleDistrictFilterChange(district)}>
          <a href="#">{district}</a>
        </Menu.Item>
      ))}
    </Menu>
  );

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

  const fetchData = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/fertilizers/getFertilizerRelaventWarehouseId", {
        warehouseid: selectedWarehouseID,
      });
      const formattedFertilizers = response.data.map((fertilizer) => ({
        key: fertilizer._id,
        fertilizer: fertilizer.fertilizerName,
        lastUpdated: fertilizer.date,
        amount: fertilizer.quantity,
        status: fertilizer.quantity === 0 ? 'out of stock' : fertilizer.quantity < 100 ? 'low stock' : 'In stock',
        _id: fertilizer._id,
      }));
      setFertilizers(formattedFertilizers);
    } catch (error) {
      console.log(error);
    }
  };

  const pieChartData = {
    labels: ['Verified', 'Unverified'],
    datasets: [
      {
        label: "Farmers",
        data: [farmersStatusCount.active, farmersStatusCount.unverified],
        backgroundColor: [
          "#82cd47",
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

  return (
    <div className="p-4">
      <form className="mb-4">
        <div className="flex justify-between items-center bg-white rounded-lg p-4">
          <Dropdown overlay={provinceMenu} trigger={['click']}>
            <Button>
              {filterProvince || "Province"} <DownOutlined />
            </Button>
          </Dropdown>
          <Dropdown overlay={districtMenu} trigger={['click']}>
            <Button>
              {filterDistrict || "District"} <DownOutlined />
            </Button>
          </Dropdown>
          <Button
            className="bg-green-700 text-white"
            onClick={filterWarehouses}
          >
            Filter
          </Button>
        </div>
      </form>
      
      {!isFiltered ? (
        <div className="text-center mt-8 flex flex-col items-center">
  <h2 className="text-xl font-bold text-blue-500">Filter Warehouse</h2>
  
  <img src={Search} alt="Error" className="w-[510px] h-auto mt-0" />
</div>
      ) : selectedWarehouseID && selectedWarehouseID !== "No warehouses found for the selected filters." ? (
        <div>
          <div className="flex mt-8 ml-4 space-x-10 s">
            <div className="w-[645px] h-[345px] bg-white rounded-[11px] flex flex-col ">
              <div className="w-[272px] h-[74px] mb-4 p-4">
                <div className="w-[200px] h-[22px] text-gray-900 text-xl font-medium font-['DM Sans'] leading-normal">
                  {warehouseDistrict}
                </div>
                <div className="text-[#a3aed0] text-sm font-medium font-['DM Sans'] leading-normal mt-2">
                  Mass percentage of fertilizer
                </div>
                <div className="bar_chart">
                  <Insightfertilizerbarchart warehouseId={selectedWarehouseID}/>       
                </div>
              </div>
            </div>

            <div className="w-[545px] h-[345px] bg-white rounded-[11px] flex flex-col ">
              <div className="w-[262px] h-[74px] mb-4 p-4">
                <div className="booking_dashboard_doughnut_container ">
                  <h4>Farmer verification</h4>
                  <p className='text-gray-400'>All verification farmers summary </p>
                  <div className="booking_dashboard_doughnut flex mt-10 ml-10">
                    <Doughnut data={pieChartData} options={options} />
                    <div className="flex flex-col ml-6 mt-10">
                      {['Verified', 'Unverified'].map((label, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <div
                            className="legend-color mt-6"
                            style={{
                              backgroundColor: ['#82cd47', '#f0ff42'][index],
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
          <div className="items-center rounded-[11px] m-[15px] px-[2] mt-6">
            <Table columns={columns} dataSource={fertilizers} pagination={false} />
          </div>
        </div>
      ) : (
        <div className="text-center mt-8 flex flex-col items-center">
  <h2 className="text-xl font-bold text-red-500">Warehouse not found</h2>
  <p className="text-gray-600 mt-2">No relevant warehouse data available for the selected filters.</p>
  <img src={Errorimage} alt="Error" className="w-[640px] h-auto mt-0" />
</div>


      )}
    </div>
  );
}

export default Insight;