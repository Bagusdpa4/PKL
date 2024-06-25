const router = require("express").Router();

const continentsController = require("../controllers/continents_controllers")

router.get("/continents", continentsController.getAllContinents)

module.exports = router