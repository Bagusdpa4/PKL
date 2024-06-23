const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;
const { generatedOTP } = require("../utils/otpGenerator");
const nodemailer = require("../utils/nodemailer");
const { formatDateToUTC, formatDateTimeToUTC } = require("../utils/formattedDate");

module.exports = {
  register: async (req, res, next) => {
    try {
      const { fullname, email, phoneNumber, password } = req.body;
      const passwordValidator =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;
      const emailValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Check for existing user with the same email
      const exist = await prisma.user.findUnique({
        where: { email },
      });

      // Validate required fields
      if (!fullname || !email || !phoneNumber || !password) {
        return res.status(400).json({
          status: false,
          message: "Input must be required",
          data: null,
        });
      } else if (exist) {
        return res.status(401).json({
          status: false,
          message: "Email already used!",
        });
      }

      // Validate email format
      if (!emailValidator.test(email)) {
        return res.status(400).json({
          status: false,
          message: "Invalid email format.",
          data: null,
        });
      }

      // Validate phone number format
      if (!/^\d+$/.test(phoneNumber)) {
        return res.status(400).json({
          status: false,
          message:
            "Invalid phone number format. It must contain only numeric characters.",
          data: null,
        });
      }

      // Validate phone number length
      if (phoneNumber.length < 10 || phoneNumber.length > 13) {
        return res.status(400).json({
          status: false,
          message:
            "Invalid phone number length. It must be between 10 and 13 characters.",
          data: null,
        });
      }

      // Validate password format
      if (!passwordValidator.test(password)) {
        return res.status(400).json({
          status: false,
          message:
            "Invalid password format. It must contain at least 1 lowercase, 1 uppercase, 1 digit number, 1 symbol, and be between 8 and 12 characters long.",
          data: null,
        });
      }

      // Generate and store OTP for email verification
      const otpObject = generatedOTP();
      const otp = otpObject.code;
      const otpCreatedAt = otpObject.createdAt;

      // Encrypt user password
      const encryptedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          fullname,
          email,
          phoneNumber,
          otp,
          otpCreatedAt,
          password: encryptedPassword,
        },
      });
      delete user.password;
      user.otpCreatedAt = formatDateTimeToUTC(user.otpCreatedAt);

      // Send email verification OTP
      const html = await nodemailer.getHTML("otp.ejs", { email, otp });
      await nodemailer.sendMail(email, "Email Activation", html);

      // Register Notification
      const notification = await prisma.notification.create({
        data: {
          title: "Welcome",
          message: "Your account has been created successfully.",
          createdAt: new Date().toISOString(),
          user: { connect: { id: user.id } },
        },
      });

      res.status(201).json({
        status: true,
        message: "User Created Successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const { emailOrPhoneNumber, password } = req.body;
      // Find user by email or phone number
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: emailOrPhoneNumber },
            { phoneNumber: emailOrPhoneNumber },
          ],
        },
      });

      // Return error if user not found
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "invalid email or password",
          data: null,
        });
      }

      // Validate only login google
      if (!user.password && user.google_id) {
        return res.status(401).json({
          status: false,
          message: "Authentication failed. Please use Google OAuth to log in",
          data: null,
        });
      }

      // Check if the provided password is correct
      let isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({
          status: false,
          message: "invalid email or password",
          data: null,
        });
      }

      // Return error if the user account is not verified
      if (!user.isVerified) {
        return res.status(403).json({
          status: false,
          message: "Account not verified. Please check your email!",
          data: null,
        });
      }

      delete user.password;
      const token = jwt.sign(user, JWT_SECRET_KEY);
      user.otpCreatedAt = formatDateTimeToUTC(user.otpCreatedAt);

      return res.status(201).json({
        status: true,
        message: "success",
        data: { ...user, token },
      });
    } catch (error) {
      next(error);
    }
  },
  verifyOtp: async (req, res, next) => {
    try {
      const { email, otp } = req.body;

      // Set OTP expired at 2 minutes
      const otpExpired = 2 * 60 * 1000;

      // Check for existing user with the same email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found!",
        });
      }

      // Return error if the provided OTP is incorrect
      if (user.otp !== otp) {
        return res.status(401).json({
          status: false,
          message: "Invalid OTP",
          data: null,
        });
      }

      // Set Expired otp
      const currentTime = new Date();
      const isExpired = currentTime - user.otpCreatedAt > otpExpired;

      if (isExpired) {
        return res.status(400).json({
          status: false,
          message: "OTP has expired. Please resend new otp.",
          data: null,
        });
      }

      // Update user verification status
      const statusUser = await prisma.user.update({
        where: { email },
        data: { isVerified: true },
      });
      delete user.password;
      user.otpCreatedAt = formatDateTimeToUTC(user.otpCreatedAt)

      res.status(200).json({
        status: true,
        message: "Activation successfully. You're Account is Verified",
        data: statusUser,
      });
    } catch (error) {
      next(error);
    }
  },
  resendOtp: async (req, res, next) => {
    try {
      const { email } = req.body;

      // Check for existing user with the same email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found!",
        });
      }

      // Generate a new OTP and its creation timestamp
      const otpObject = generatedOTP();
      otp = otpObject.code;
      otpCreatedAt = otpObject.createdAt;
      delete user.password;

      // Send the new OTP via email
      const html = await nodemailer.getHTML("otp.ejs", { email, otp });
      await nodemailer.sendMail(email, "Email Activation", html);

      // Update user's OTP and OTP creation timestamp
      const resendOtp = await prisma.user.update({
        where: { email },
        data: { otp, otpCreatedAt },
      });

      resendOtp.otpCreatedAt = formatDateTimeToUTC(resendOtp.otpCreatedAt)

      res.status(200).json({
        status: true,
        message: "Resend OTP successfully",
        data: resendOtp,
      });
    } catch (error) {
      next(error);
    }
  },
  forgetPassword: async (req, res, next) => {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "user not found",
          data: null,
        });
      }

      const token = jwt.sign({ email: user.email }, JWT_SECRET_KEY);

      const html = await nodemailer.getHTML("link-reset.ejs", {
        name: user.fullname,
        url: `${req.protocol}://${req.get("host")}/reset-password?token=${token}`
      });

      await nodemailer.sendMail(email, "Password Reset Request", html);

      // Setelah pengiriman email berhasil
      return res.status(200).json({
        status: true,
        message: "Success Send Email Forget Password",
      });
    } catch (error) {
      next(error);
    }
  },
};
