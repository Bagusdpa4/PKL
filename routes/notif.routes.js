const router = require("express").Router();

const { index } = require("../controllers/notif.controllers");
const restrict = require("../middlewares/auth.middlewares");

router.get("/notifications", restrict, index);

module.exports = router;
