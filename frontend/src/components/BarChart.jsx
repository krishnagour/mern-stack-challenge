import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import {
//     Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LineraScale
// } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// ChartJS.register{
//     BarElement, Tooltip, Legend, CategoryScale, LineraScale
// };

const BarChart = ({ selectedMonth }) => {
    const [barData, setBarData] = useState({});

    const fetchBarData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/barchart', {
                params: { month: selectedMonth }
            });
            setBarData(response.data);
        } catch (error) {
            console.error('Failed to fetch bar chart data', error);
        }
    };

    useEffect(() => {
        fetchBarData();
    }, [selectedMonth]);

    const data = {
        labels: Object.keys(barData),
        datasets: [
            {
                label: 'Number of Items',
                data: Object.values(barData),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    return (
        <div>
            <h3>Bar Chart for {selectedMonth}</h3>
            <Bar data={data} />
        </div>
    );
};

export default BarChart;
