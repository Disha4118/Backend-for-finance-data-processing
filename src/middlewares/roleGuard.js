// Role hierarchy: viewer < analyst < admin
const ROLE_LEVELS = {
  viewer: 1,
  analyst: 2,
  admin: 3,
};

/**
 * Restrict access to specific roles.
 * Usage: requireRole("admin") or requireRole("analyst", "admin")
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const userRoleLevel = ROLE_LEVELS[req.user.role];
    const hasPermission = allowedRoles.some(
      (role) => userRoleLevel >= ROLE_LEVELS[role]
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}. Your role: ${req.user.role}.`,
      });
    }

    next();
  };
};

/**
 * Require at least analyst level
 */
const analystOrAbove = requireRole("analyst");

/**
 * Require admin only
 */
const adminOnly = requireRole("admin");

module.exports = { requireRole, analystOrAbove, adminOnly };