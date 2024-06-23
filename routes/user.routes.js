const router = require("express").Router();
const { register, login, verifyOtp, resendOtp, forgetPassword } = require("../controllers/user.controllers");

// API Auth Users
router.post("/users/register", register);
router.post("/users/login", login);
router.put("/users/verify-otp", verifyOtp);
router.put("/users/resend-otp", resendOtp);
router.post("/users/forget-password", forgetPassword);

module.exports = router;