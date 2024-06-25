const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { convertToIso, formatDateTimeToUTC } = require('../utils/formattedDate');

module.exports = {
  index: async (req, res, next) => {
    try {
      const { find, filter } = req.query;

      const conditions = {
        user_id: Number(req.user.id),
      };

      if (find) {
        conditions.title = { contains: find, mode: "insensitive" };
      }

      if (filter) {
        conditions.title = { equals: filter, mode: 'insensitive' };
      }

      const notifications = await prisma.notification.findMany({
        where: conditions,
      });

      notifications.forEach(value => {
        value.createdAt = formatDateTimeToUTC(value.createdAt)
      })

      res.status(200).json({
        status: true,
        message: "Notifications retrieved successfully",
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  },
  readNotification: async (req, res, next) => {
    try {
      const notifications = await prisma.notification.updateMany({
        where: { user_id: Number(req.user.id) },
        data: {
          isRead: true,
        },
      }); 

      res.status(200).json({
        status: true,
        message: "Notifications marked as read for the user",
        data: notifications,
      });
    } catch (err) {
      next(err);
    }
  },
};
