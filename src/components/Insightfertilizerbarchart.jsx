import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

function Insightfertilizerbarchart({ chartWidth = 800, chartHeight = 500, warehouseId }) {
    const [fertilizers, setFertilizers] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/fertilizers/getFertilizerRelaventWarehouseId", {
                warehouseid: warehouseId,
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

    useEffect(() => {
        if (warehouseId) {
            fetchData();
        }
    }, [warehouseId]);

    const canvasRef = useRef(null);

    useEffect(() => {
        if (fertilizers.length > 0) {
            const ctx = canvasRef.current.getContext("2d");

            // Create the chart instance
            const chartInstance = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: fertilizers.map((fertilizer) => fertilizer.fertilizer), // X-axis: Fertilizer names
                    datasets: [
                        {
                            data: fertilizers.map((fertilizer) => fertilizer.amount), // Y-axis: Quantities
                            backgroundColor: "#7ec75b",
                            borderColor: "#7ec75b",
                            borderRadius: 10,
                            borderWidth: 1,
                            barThickness: 50
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

            // Cleanup function to destroy the chart instance
            return () => {
                chartInstance.destroy();
            };
        }
    }, [fertilizers]); // Re-run when fertilizers change

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

export default Insightfertilizerbarchart;
