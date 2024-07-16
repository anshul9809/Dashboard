const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middlewares/auth");
const {
    createProject,
    updateProject,
    deleteProject,
    getProject,
    getAllProjects,
} = require("../controllers/projectController");

router.post("/create", authMiddleware, createProject);
router.put("/update/:id", authMiddleware, updateProject);
router.delete("/delete/:id", authMiddleware, deleteProject);
router.get("/:id", getProject);
router.get("/", getAllProjects);


module.exports = router;