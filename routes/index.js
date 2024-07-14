const express = require('express');
const router = express.Router();
const swaggerUI = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const path = require("path");

// Import File routes
const User = require("./user.routes")
const Profile = require("./profile.routes")
const Flights = require("./flight.routes")
const classRoute = require("./seat_class.routes")
const scheduleRoute = require("./schedule.routes")
const cityRoute = require("./city.routes")
const continentRoute = require("./continent.routes")
const Country = require("./country.routes")
const Plane = require("./plane.routes")
const Order = require("./order.routes")
const Payments = require("./payment.routes")
const Notifications = require("./notif.routes")
const Cronjob = require("./cron_schedule.routes")

const swagger_path = path.resolve(__dirname, "../docs/api-docs.yaml");
const customCssUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css";
const customJs = [
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
];
const file = fs.readFileSync(swagger_path, "utf-8");

// API Docs
const swaggerDocument = YAML.parse(file);
router.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument, { customCssUrl, customJs }));

// API
router.use("/api/v1", User)
router.use("/api/v1", Profile)
router.use("/api/v1", Flights)
router.use("/api/v1", classRoute)
router.use("/api/v1", scheduleRoute)
router.use("/api/v1", cityRoute)
router.use("/api/v1", continentRoute)
router.use("/api/v1", Country)
router.use("/api/v1", Plane)
router.use("/api/v1", Order)
router.use("/api/v1", Payments)
router.use("/api/v1", Notifications)
router.use("/api/v1", Cronjob)

module.exports = router;