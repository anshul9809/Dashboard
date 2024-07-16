const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middlewares/auth");
const {
    createSoftware,
    updateSoftware,
    deleteSoftware,
    getAllSoftware,
    getSoftware
} = require("../controllers/softwareController");

router.post("/create", authMiddleware, createSoftware);
router.put("/update/:id", authMiddleware, updateSoftware);
router.delete("/delete/:id", authMiddleware, deleteSoftware);
router.get("/:id", authMiddleware, getSoftware);
router.get("/", getAllSoftware);

module.exports = router;