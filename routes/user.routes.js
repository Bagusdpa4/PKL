const router = require("express").Router();
const { register, login, verifyOtp, resendOtp } = require("../controllers/user.controllers");

// API Auth Users
router.post("/users/register", register);
router.post("/users/login", login);
router.put("/users/verify-otp", verifyOtp);
router.put("/users/resend-otp", resendOtp);

module.exports = router;