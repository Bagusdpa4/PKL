const router = require("express").Router();
const scheduleController = require("../controllers/schedule.controllers")

// Search ticket
router.post("/ticket/schedule", scheduleController.findSchedule)

//recomendation
router.get("/ticket/schedule/recomendation", scheduleController.mostPurchaseSchedule)

module.exports = router