const router = require("express").Router();

const { getAllFlights, getDetailFlights } = require("../controllers/flight.controllers");

router.get("/ticket/flights", getAllFlights);
router.get("/ticket/flight/:id", getDetailFlights);

module.exports = router;
