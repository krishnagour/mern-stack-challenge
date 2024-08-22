import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import StatisticsBox from './components/StatisticsBox';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
// import {
//   Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LineraScale
// } from 'chart.js';
// ChartJS.register{
//   BarElement, Tooltip, Legend, CategoryScale, LineraScale
// };


const App = () => {
    const [selectedMonth, setSelectedMonth] = useState('March');

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    return (
        <div>
            <h1>Transactions Dashboard</h1>
            <label htmlFor="month">Select Month: </label>
            <select id="month" value={selectedMonth} onChange={handleMonthChange}>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
            </select>

            <TransactionsTable selectedMonth={selectedMonth} />
            <StatisticsBox selectedMonth={selectedMonth} />
            <BarChart selectedMonth={selectedMonth} />
            <PieChart selectedMonth={selectedMonth} />
        </div>
    );
};

export default App;

