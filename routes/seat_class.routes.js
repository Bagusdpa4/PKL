const router = require("express").Router();
const { getAll } = require("../controllers/seat_class.controllers")

router.get("/ticket/class", getAll)

module.exports = router