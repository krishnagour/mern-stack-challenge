import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StatisticsBox = ({ selectedMonth }) => {
    const [statistics, setStatistics] = useState({});

    const fetchStatistics = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/statistics', {
                params: { month: selectedMonth }
            });
            setStatistics(response.data);
        } catch (error) {
            console.error('Failed to fetch statistics', error);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, [selectedMonth]);

    return (
        <div>
            <h3>Statistics for {selectedMonth}</h3>
            <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
            <p>Total Sold Items: {statistics.totalSoldItems}</p>
            <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
        </div>
    );
};

export default StatisticsBox;
