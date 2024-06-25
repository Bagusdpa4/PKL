const router = require("express").Router();

const { index, readNotification } = require("../controllers/notif.controllers");
const restrict = require("../middlewares/auth.middlewares");

router.get("/notifications", restrict, index);
router.put("/notifications/markAsRead/all", restrict, readNotification)

module.exports = router;
