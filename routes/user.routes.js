const router = require("express").Router();
const { register, login, verifyOtp, resendOtp, forgetPassword, resetPassword } = require("../controllers/user.controllers");

// API Auth Users
router.post("/users/register", register);
router.post("/users/login", login);
router.put("/users/verify-otp", verifyOtp);
router.put("/users/resend-otp", resendOtp);
router.post("/users/forget-password", forgetPassword);
router.put("/users/reset-password", resetPassword);

module.exports = router;