const express = require('express');
const router = express.Router();
const { addCronJob } = require('../controllers/cron_schedule_controller');

router.post('/add-cron-job', addCronJob);

module.exports = router;