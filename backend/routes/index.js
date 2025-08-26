const { Router } = require("express");
const userRoutes = require("./userRoutes.js");
const authRoutes = require("./authRoutes.js");

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

module.exports = router;
