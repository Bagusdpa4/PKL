const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
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
};
