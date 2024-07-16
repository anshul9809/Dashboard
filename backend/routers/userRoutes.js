const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middlewares/auth");
const {
    registerUser,
    login,
    logout,
    getProfile,
    updateProfile,
    updatePassword,
    getPortfolioUser,
    forgotPassword,
    resetPassword
} = require("../controllers/userController");

// starting the user router
router.post("/register", registerUser);
router.post("/login", login);
router.put("/update", authMiddleware, updateProfile);
router.put("/updatePassword", authMiddleware, updatePassword);
router.get("/logout",authMiddleware, logout);
router.get("/profile", authMiddleware, getProfile);
router.get("/portfolio", getPortfolioUser);
router.post("/forgot-password", forgotPassword);
router.put("/password/reset/:token", resetPassword)
module.exports = router;