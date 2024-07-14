const router = require("express").Router();
const { getDetail, updateProfile, updatePass } = require("../controllers/profile.controllers");
const { restrict } = require("../middlewares/auth.middlewares");

router.get('/profile', restrict, getDetail);
router.put('/profile', restrict, updateProfile);
router.put('/profile/change-password', restrict, updatePass)

module.exports = router;