const Transaction = require("../models/Transaction");

// @desc    Get total income, expenses, net balance
// @route   GET /api/dashboard/summary
// @access  Viewer+
const getSummary = async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;

    result.forEach((item) => {
      if (item._id === "income") totalIncome = item.total;
      if (item._id === "expense") totalExpenses = item.total;
    });

    res.status(200).json({
      success: true,
      summary: {
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get totals grouped by category
// @route   GET /api/dashboard/category-totals
// @access  Analyst+
const getCategoryTotals = async (req, res) => {
  try {
    const { type } = req.query; // optional filter: income | expense

    const matchStage = { isDeleted: false };
    if (type) matchStage.type = type;

    const result = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id.category",
          type: "$_id.type",
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json({ success: true, categoryTotals: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get monthly income/expense trends
// @route   GET /api/dashboard/trends
// @access  Analyst+
const getMonthlyTrends = async (req, res) => {
  try {
    const { year } = req.query;

    const matchStage = { isDeleted: false };
    if (year) {
      matchStage.date = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      };
    }

    const result = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          type: "$_id.type",
          total: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    res.status(200).json({ success: true, trends: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recent 10 transactions
// @route   GET /api/dashboard/recent
// @access  Viewer+
const getRecentActivity = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("createdBy", "name email")
      .sort({ date: -1 })
      .limit(10);

    res.status(200).json({ success: true, recentActivity: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSummary, getCategoryTotals, getMonthlyTrends, getRecentActivity };