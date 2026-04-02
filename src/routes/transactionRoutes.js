const express = require("express");
const { body } = require("express-validator");
const {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
const { protect } = require("../middlewares/auth");
const { adminOnly } = require("../middlewares/roleGuard");

const router = express.Router();

// All routes require authentication
router.use(protect);

// Viewer and above — read access
router.get("/", getAllTransactions);
router.get("/:id", getTransactionById);

// Admin only — write access
const transactionValidation = [
  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number"),
  body("type")
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("date").isISO8601().withMessage("Date must be a valid ISO 8601 date"),
  body("notes").optional().isString(),
];

router.post("/", adminOnly, transactionValidation, createTransaction);
router.put("/:id", adminOnly, transactionValidation, updateTransaction);
router.delete("/:id", adminOnly, deleteTransaction);

module.exports = router;