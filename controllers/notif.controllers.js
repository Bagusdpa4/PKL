const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { convertToIso, formatDateTimeToUTC } = require('../utils/formattedDate');
const paginationReq = require("../utils/pagination");
const jsonResponse = require("../utils/response");

module.exports = {
  index: async (req, res, next) => {
    try {
      const { find, filter, page } = req.query;
      let pagination = paginationReq.paginationPage(Number(page), 10)

      const conditions = {
        user_id: Number(req.user.id),
      };

      if (find) {
        conditions.title = { contains: find, mode: "insensitive" };
      }

      if (filter) {
        conditions.title = { equals: filter, mode: 'insensitive' };
      }

      const totalData = await prisma.notification.count({ where: conditions });
      const totalPage = Math.ceil(totalData / pagination.take);

      const notifications = await prisma.notification.findMany({
        where: conditions,
        take: pagination.take,
        skip: pagination.skip,
        orderBy: {
          createdAt: 'desc'
        }
      });


      notifications.forEach(value => {
        value.createdAt = formatDateTimeToUTC(value.createdAt)
      })

      return jsonResponse(res, 200, {
        message: "Notifications retrieved successfully",
        data: notifications,
        page: Number(page) ?? 1,
        perPage: notifications.length,
        pageCount: totalPage,
        totalCount: totalData,
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
