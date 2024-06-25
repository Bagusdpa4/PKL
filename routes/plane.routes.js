const router = require("express").Router();

const { getAllPlanes, getDetailPlanes } = require("../controllers/plane.controllers");

router.get("/planes", getAllPlanes);
router.get("/plane/:id", getDetailPlanes);

module.exports = router;