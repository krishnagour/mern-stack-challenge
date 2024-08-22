const axios = require('axios');
const Transaction = require('../models/transaction');

// Initialize database with seed data from the third-party API
const initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        await Transaction.deleteMany(); // Clear existing data
        await Transaction.insertMany(transactions); // Insert new data

        res.status(200).json({ message: 'Database initialized with seed data' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to initialize database' });
    }
};

// List transactions with search and pagination
const listTransactions = async (req, res) => {
    const { page = 1, perPage = 10, search = '', month } = req.query;

    const monthNumber = new Date(Date.parse(month + " 1, 2024")).getMonth() + 1;

    const searchQuery = {
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: { $regex: search, $options: 'i' } },
        ],
        dateOfSale: { $gte: new Date(`2024-${monthNumber}-01`), $lt: new Date(`2024-${monthNumber + 1}-01`) }
    };

    try {
        const transactions = await Transaction.find(searchQuery)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to list transactions' });
    }
};

// Get statistics for the selected month
const getStatistics = async (req, res) => {
    const { month } = req.query;

    const monthNumber = new Date(Date.parse(month + " 1, 2024")).getMonth() + 1;

    try {
        const transactions = await Transaction.find({
            dateOfSale: { $gte: new Date(`2024-${monthNumber}-01`), $lt: new Date(`2024-${monthNumber + 1}-01`) }
        });

        const totalSaleAmount = transactions.reduce((acc, transaction) => acc + transaction.price, 0);
        const totalSoldItems = transactions.filter(transaction => transaction.sold).length;
        const totalNotSoldItems = transactions.filter(transaction => !transaction.sold).length;

        res.status(200).json({ totalSaleAmount, totalSoldItems, totalNotSoldItems });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

// Get bar chart data
const getBarChartData = async (req, res) => {
    const { month } = req.query;

    const monthNumber = new Date(Date.parse(month + " 1, 2024")).getMonth() + 1;

    try {
        const transactions = await Transaction.find({
            dateOfSale: { $gte: new Date(`2024-${monthNumber}-01`), $lt: new Date(`2024-${monthNumber + 1}-01`) }
        });

        const priceRanges = {
            '0-100': 0,
            '101-200': 0,
            '201-300': 0,
            '301-400': 0,
            '401-500': 0,
            '501-600': 0,
            '601-700': 0,
            '701-800': 0,
            '801-900': 0,
            '901-above': 0,
        };

        transactions.forEach(transaction => {
            if (transaction.price <= 100) priceRanges['0-100']++;
            else if (transaction.price <= 200) priceRanges['101-200']++;
            else if (transaction.price <= 300) priceRanges['201-300']++;
            else if (transaction.price <= 400) priceRanges['301-400']++;
            else if (transaction.price <= 500) priceRanges['401-500']++;
            else if (transaction.price <= 600) priceRanges['501-600']++;
            else if (transaction.price <= 700) priceRanges['601-700']++;
            else if (transaction.price <= 800) priceRanges['701-800']++;
            else if (transaction.price <= 900) priceRanges['801-900']++;
            else priceRanges['901-above']++;
        });

        res.status(200).json(priceRanges);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bar chart data' });
    }
};

// Get pie chart data
const getPieChartData = async (req, res) => {
    const { month } = req.query;

    const monthNumber = new Date(Date.parse(month + " 1, 2024")).getMonth() + 1;

    try {
        const transactions = await Transaction.find({
            dateOfSale: { $gte: new Date(`2024-${monthNumber}-01`), $lt: new Date(`2024-${monthNumber + 1}-01`) }
        });

        const categoryData = {};

        transactions.forEach(transaction => {
            if (categoryData[transaction.category]) {
                categoryData[transaction.category]++;
            } else {
                categoryData[transaction.category] = 1;
            }
        });

        res.status(200).json(categoryData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pie chart data' });
    }
};

// Fetch and combine data from all APIs
const getCombinedData = async (req, res) => {
    try {
        const transactions = await listTransactions(req, res);
        const statistics = await getStatistics(req, res);
        const barChartData = await getBarChartData(req, res);
        const pieChartData = await getPieChartData(req, res);

        res.status(200).json({
            transactions,
            statistics,
            barChartData,
            pieChartData
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch combined data' });
    }
};

module.exports = {
    initializeDatabase,
    listTransactions,
    getStatistics,
    getBarChartData,
    getPieChartData,
    getCombinedData,
};
