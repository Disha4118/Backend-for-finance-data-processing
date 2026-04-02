const express = require("express");
const {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentActivity,
} = require("../controllers/dashboardController");
const { protect } = require("../middlewares/auth");
const { analystOrAbove } = require("../middlewares/roleGuard");

const router = express.Router();

// All dashboard routes require authentication
router.use(protect);

// Viewer and above
router.get("/summary", getSummary);
router.get("/recent", getRecentActivity);

// Analyst and above
router.get("/category-totals", analystOrAbove, getCategoryTotals);
router.get("/trends", analystOrAbove, getMonthlyTrends);

module.exports = router;