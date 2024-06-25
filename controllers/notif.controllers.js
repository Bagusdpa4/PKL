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
  readNotificationId: async (req, res, next) => {
    try {
      const { notificationId } = req.params;
      if (!notificationId) {
        return res.status(400).json({
          status: false,
          message: "Notification ID is required",
        });
      }

      const notification = await prisma.notification.update({
        where: { id: Number(notificationId) },
        data: {
          isRead: true,
        },
      });

      if (!notification) {
        return res.status(404).json({
          status: false,
          message: "Notification not found",
        });
      }

      notification.createdAt = formatDateTimeToUTC(notification.createdAt);

      res.status(200).json({
        status: true,
        message: "Notification marked as read",
        data: notification,
      });
    } catch (err) {
      next(err);
    }
  },
};
