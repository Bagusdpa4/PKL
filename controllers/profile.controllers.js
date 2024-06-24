const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { formatDateTimeToUTC } = require("../utils/formattedDate");
const imageKit = require("../libs/imagekit");
const multer = require("../libs/multer").image;

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

      console.log(user.otpCreatedAt);

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
};
