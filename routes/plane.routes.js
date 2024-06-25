const router = require("express").Router();

const { getAllPlanes } = require("../controllers/plane.controllers");

router.get("/planes", getAllPlanes);

module.exports = router;