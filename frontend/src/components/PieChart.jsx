import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ selectedMonth }) => {
    const [pieData, setPieData] = useState({});

    const fetchPieData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/piechart', {
                params: { month: selectedMonth }
            });
            setPieData(response.data);
        } catch (error) {
            console.error('Failed to fetch pie chart data', error);
        }
    };

    useEffect(() => {
        fetchPieData();
    }, [selectedMonth]);

    const data = {
        labels: Object.keys(pieData),
        datasets: [
            {
                label: 'Number of Items',
                data: Object.values(pieData),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
            },
        ],
    };

    return (
        <div>
            <h3>Pie Chart for {selectedMonth}</h3>
            <Pie data={data} />
        </div>
    );
};

export default PieChart;
