const express = require("express");
const { body } = require("express-validator");
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middlewares/auth");
const { adminOnly } = require("../middlewares/roleGuard");

const router = express.Router();

// All user management routes are admin only
router.use(protect, adminOnly);

router.get("/", getAllUsers);
router.get("/:id", getUserById);

router.patch(
  "/:id/role",
  [
    body("role")
      .isIn(["viewer", "analyst", "admin"])
      .withMessage("Role must be viewer, analyst, or admin"),
  ],
  updateUserRole
);

router.patch("/:id/status", updateUserStatus);
router.delete("/:id", deleteUser);

module.exports = router;