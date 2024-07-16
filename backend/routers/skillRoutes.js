const express = require("express");
const router = express.Router();
const {createSkill, updateSkill, deleteSkill, getAllSkill, getSkill} = require("../controllers/skillController");
const {authMiddleware} = require("../middlewares/auth");

router.post("/create", authMiddleware, createSkill);
router.put("/update/:id", authMiddleware, updateSkill);
router.delete("/delete/:id", authMiddleware, deleteSkill);
router.get("/:id", authMiddleware, getSkill);
router.get("/", getAllSkill);

module.exports = router;
