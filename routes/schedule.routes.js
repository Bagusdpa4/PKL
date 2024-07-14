const router = require("express").Router();

const scheduleController = require("../controllers/schedule.controller")

router.post("/ticket/schedule", scheduleController.findSchedule)

//recomendation
router.get("/ticket/schedule/recomendation", scheduleController.allRecomendation)
router.get("/ticket/schedule/category", scheduleController.getCategoryRecomendation)

module.exports = router