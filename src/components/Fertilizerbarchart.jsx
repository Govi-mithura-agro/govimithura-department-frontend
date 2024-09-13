import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

function Fertilizerbarchart({ chartWidth = 800, chartHeight = 500 }) {
  const [warehouses, setWarehouses] = useState([]);

  // Fetch warehouse data from the API
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

  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  // Extract warehouse names (x-axis labels) and capacities (y-axis data)
  const labels = warehouses.map(warehouse => warehouse.warehouseName);
  const data = warehouses.map(warehouse => warehouse.capacity);

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
            data: data,
            backgroundColor: " #7ec75b",
            borderColor: "#7ec75b",
            borderRadius: 10,
            borderWidth: 1,
            barThickness: 40,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
            ticks: {
              color: "#4A4A4A",
              font: {
                family: "Arial",
                size: 14,
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
            display: false,
          },
          tooltip: {
            enabled: true,
            backgroundColor: "#556b4b",
            titleFont: { size: 14 },
            bodyFont: { size: 12 },
          },
        },
      },
    });
  };

  useEffect(() => {
    if (warehouses.length > 0) {
      createChart(labels, data);
    }
  }, [warehouses]);

  return (
    <div
      className="daily-login-count-chart-container flex justify-center"
      style={{ width: '564px', height: '264px' }}
    >
      <canvas
        ref={canvasRef}
        id="LoginCountChart"
        width={chartWidth}
        height={chartHeight}
      ></canvas>
    </div>
  );
}

export default Fertilizerbarchart;
