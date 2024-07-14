const express = require('express');
const router = express.Router();
const { runCronJob } = require('../controllers/cron_schedule_controller');

router.post('/run-cron-job', runCronJob);

module.exports = router;