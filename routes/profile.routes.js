const router = require("express").Router();
const { getDetail } = require("../controllers/profile.controllers");
const restrict = require("../middlewares/auth.middlewares");

router.get('/profile', restrict, getDetail);

module.exports = router;