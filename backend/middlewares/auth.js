const User = require("../models/User");
const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");

module.exports.authMiddleware = expressAsyncHandler(async (req,res, next)=>{
    try {
        const { token } = req.cookies;
        if (!token) {
            res.status(401);
            throw new Error("Session expired, please login again.");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            res.status(404);
            throw new Error("User not found.");
        }

        next();
    } catch (error) {
        console.error("Authentication Middleware Error:", error.message);
        res.status(401);
        throw new Error("Not authorized, token failed.");
    }

});