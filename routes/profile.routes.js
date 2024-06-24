const router = require("express").Router();
const { getDetail, updateProfile } = require("../controllers/profile.controllers");
const restrict = require("../middlewares/auth.middlewares");

router.get('/profile', restrict, getDetail);
router.put('/profile', restrict, updateProfile);

module.exports = router;