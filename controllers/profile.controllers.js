const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const imageKit = require("../libs/imagekit");
const multer = require("../libs/multer").image;
const bcrypt = require("bcrypt");
const { formatDateTimeToUTC } = require("../utils/formattedDate");

module.exports = {
  getDetail: async (req, res, next) => {
    try {
      let userId = req.user.id;

      let user = await prisma.user.findUnique({
        where: {
          id: parseInt(userId),
        },
      });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
          data: null,
        });
      }

      delete user.password;
      user.otpCreatedAt = formatDateTimeToUTC(user.otpCreatedAt)


      res.status(200).json({
        status: true,
        message: "OK",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },
  updateProfile: async (req, res, next) => {
    multer.single("avatar_url")(req, res, async (err) => {
      if (err) {
        return res.status(err.status || 500).json({
          status: false,
          message: err.message || "File upload error",
          data: null,
        });
      }

      try {
        let userId = req.user.id;
        let { fullname, phoneNumber } = req.body;

        let existingUser = await prisma.user.findUnique({
          where: {
            id: parseInt(userId),
          },
        });

        if (!existingUser) {
          return res.status(404).json({
            status: false,
            message: "User not found",
            data: null,
          });
        }

        let updatedData = {};

        // Add fields to updatedData only if they are provided
        if (fullname) updatedData.fullname = fullname;
        if (phoneNumber) updatedData.phoneNumber = phoneNumber;

        if (req.file) {
          const uploadResult = await imageKit.upload({
            file: req.file.buffer,
            fileName: `avatar_${userId}_${Date.now()}`,
          });

          if (uploadResult.url) {
            updatedData.avatar_url = uploadResult.url;
          }
        }

        // Check if at least one field is provided for update
        if (Object.keys(updatedData).length === 0) {
          return res.status(400).json({
            status: false,
            message: "At least one field must be updated",
            data: null,
          });
        }

        let updatedUser = await prisma.user.update({
          where: {
            id: parseInt(userId),
          },
          data: updatedData,
        });

        updatedUser.otpCreatedAt = formatDateTimeToUTC(updatedUser.otpCreatedAt)

        res.status(200).json({
          status: true,
          message: "Update Data Successfully",
          data: updatedUser,
        });
      } catch (err) {
        next(err);
      }
    });
  },
  updatePass: async (req, res, next) => {
    try {
      const { oldPassword, newPassword, newPasswordConfirmation } = req.body;

      // Check if required parameters are provided
      if (!oldPassword || !newPassword || !newPasswordConfirmation) {
        return res.status(400).json({
          status: false,
          message: "All fields must be provided",
          data: null,
        });
      }

      const userId = req.user.id;

      // Fetch the current user's hashed password from the database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true } // Select only the password field
      });

      // Check if the old password provided matches the user's current hashed password
      let isOldPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isOldPasswordCorrect) {
        return res.status(401).json({
          status: false,
          message: "Incorrect old password",
          data: null,
        });
      }

      // Validate the format of the new password using a regular expression
      const passwordValidator =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;

      if (!passwordValidator.test(newPassword)) {
        return res.status(400).json({
          status: false,
          message: "Invalid password format. It must contain at least 1 lowercase, 1 uppercase, 1 digit number, 1 symbol, and be between 8 and 12 characters long.",
          data: null,
        });
      }

      // Check if the new password matches the password confirmation
      if (newPassword !== newPasswordConfirmation) {
        return res.status(400).json({
          status: false,
          message: "Password and password confirmation do not match",
          data: null,
        });
      }

      // Hash the new password
      let encryptedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update user's password in the database
      const updateUser = await prisma.user.update({
        where: { id: userId },
        data: { password: encryptedNewPassword },
      });

      // Create a notification for the user
      await prisma.notification.create({
        data: {
          title: "Password",
          message: "Your password has been updated successfully!",
          createdAt: new Date().toISOString(),
          user: { connect: { id: userId } },
        },
      });

      updateUser.otpCreatedAt = formatDateTimeToUTC(updateUser.otpCreatedAt)

      res.status(200).json({
        status: true,
        message: "Your password has been successfully changed",
        data: updateUser,
      });
    } catch (error) {
      next(error);
    }
  },
};
