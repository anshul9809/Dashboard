const express = require("express");
const router = express.Router();

router.use("/user", require("./userRoutes"));
router.use("/message", require("./messageRoutes"));
router.use("/timeline", require("./timelineRoutes"));
router.use("/software", require("./softwareRoutes"));
router.use("/skill", require("./skillRoutes"));
router.use("/project", require("./projectRoutes"));

module.exports = router;