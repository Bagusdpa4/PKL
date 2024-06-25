const router = require("express").Router();

const cityController = require("../controllers/city_controller")

router.get("/cities", cityController.getAllCity)

module.exports = router