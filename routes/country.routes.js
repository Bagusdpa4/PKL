const router = require("express").Router();

const { getAllCountries } = require("../controllers/country.controllers");

router.get("/countries", getAllCountries);

module.exports = router;