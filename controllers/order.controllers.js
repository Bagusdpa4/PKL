const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { generatedOrderCode } = require("../utils/orderCodeGenerator");
const {
  formatDateTimeToUTC,
  formatDateToUTC,
  formatTimeToUTC,
  utcTimePlus7,
} = require("../utils/formattedDate");
const imageKit = require("../libs/imagekit");
const qr = require("qr-image");
const paginationReq = require("../utils/pagination");
const jsonResponse = require("../utils/response");

module.exports = {
  order: async (req, res, next) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
        data: null,
      });
    }

    const detailFlightId = req.params.detailFlightId;
    const { passengers } = req.body;

    // Validate passenger data
    if (!passengers || !passengers.length) {
      return res.status(400).json({
        status: "error",
        message: "No passengers provided",
        data: null,
      });
    }

    const requiredFields = [
      "title",
      "fullname",
      "family_name",
      "birth_date",
      "nationality",
      "identity_type",
      "identity_number",
      "expired_date",
      "issuing_country",
    ];
    for (const passenger of passengers) {
      for (const field of requiredFields) {
        if (!passenger[field]) {
          return res.status(400).json({
            status: "error",
            message: `Missing '${field}' in passenger details`,
            data: null,
          });
        }
      }
    }

    try {
      const newOrder = await prisma.order.create({
        data: {
          user: { connect: { id: req.user.id } },
          detailFlight: { connect: { id: parseInt(detailFlightId) } },
          code: generatedOrderCode(),
          status: "unpaid",
          expired_paid: new Date(utcTimePlus7().getTime() + 20 * 60 * 1000),
          passenger: {
            createMany: {
              data: passengers.map((passenger) => ({
                title: passenger.title,
                fullname: passenger.fullname,
                family_name: passenger.family_name,
                birth_date: new Date(passenger.birth_date),
                nationality: passenger.nationality,
                identity_type: passenger.identity_type,
                identity_number: passenger.identity_number,
                expired_date: new Date(passenger.expired_date),
                issuing_country: passenger.issuing_country,
              })),
            },
          },
        },
        include: {
          passenger: true,
        },
      });

      const notification = await prisma.notification.create({
        data: {
          title: "Order",
          message: `Your order with booking code ${
            newOrder.code
          } is currently unpaid. Please completed your payment before ${formatDateTimeToUTC(
            newOrder.expired_paid.toISOString()
          )}.`,
          createdAt: utcTimePlus7().toISOString(),
          user: { connect: { id: req.user.id } },
        },
      });

      return res.status(201).json({
        status: "success",
        message: "Order created successfully",
        data: newOrder,
      });
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { find, startDate, endDate, filter, page } = req.query;
      let pagination = paginationReq.paginationPage(Number(page), 10);

      const conditions = {
        user_id: id,
      };

      if (find) {
        conditions.code = { contains: find };
      }

      if (startDate) {
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0);

        if (endDate) {
          const end = new Date(endDate);
          end.setUTCHours(23, 59, 59, 999);
          conditions.expired_paid = {
            gte: start,
            lte: end,
          };
        } else {
          conditions.expired_paid = {
            gte: start,
          };
        }
      }

      if (filter) {
        conditions.status = { equals: filter, mode: "insensitive" };
      }

      const totalData = await prisma.order.count({ where: conditions });
      const totalPage = Math.ceil(totalData / pagination.take);

      const orders = await prisma.order.findMany({
        where: conditions,
        take: pagination.take,
        skip: pagination.skip,
        orderBy: {
          expired_paid: "desc",
        },
        select: {
          id: true,
          status: true,
          code: true,
          detail_flight_id: true,
          expired_paid: true,
          detailFlight: {
            select: {
              id: true,
              price: true,
              detailPlaneId: {
                select: {
                  seat_class: {
                    select: {
                      id: true,
                      type_class: true,
                    },
                  },
                },
              },
              flight: {
                select: {
                  id: true,
                  flight_number: true,
                  time_arrive: true,
                  time_departure: true,
                  date_flight: true,
                  estimation_minute: true,
                  city_arrive: {
                    select: {
                      id: true,
                      name: true,
                      code: true,
                      airport_name: true,
                    },
                  },
                  city_destination: {
                    select: {
                      id: true,
                      name: true,
                      code: true,
                      airport_name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Update status to "cancelled" if expired_paid has passed
      const currentTime = utcTimePlus7();
      const updatedOrders = await Promise.all(
        orders.map(async (order) => {
          if (order.status === "unpaid" && currentTime > order.expired_paid) {
            await prisma.order.update({
              where: { id: order.id },
              data: { status: "cancelled" },
            });
            order.status = "cancelled"; // Update the status in the response as well
          }
          order.expired_paid = formatDateTimeToUTC(order.expired_paid);
          return order;
        })
      );

      return jsonResponse(res, 200, {
        message: "Get all orders successfully",
        data: updatedOrders,
        page: Number(page) ?? 1,
        perPage: orders.length,
        pageCount: totalPage,
        totalCount: totalData,
      });
    } catch (error) {
      next(error);
    }
  },

  getDetail: async (req, res, next) => {
    try {
      const { orderId } = req.params;

      const order = await prisma.order.findUnique({
        where: { id: parseInt(orderId) },
        select: {
          id: true,
          status: true,
          code: true,
          detail_flight_id: true,
          expired_paid: true,
          passenger: true,
          detailFlight: {
            select: {
              id: true,
              flight_id: true,
              detail_plane_id: true,
              price: true,
              flight: {
                select: {
                  id: true,
                  flight_number: true,
                  time_arrive: true,
                  time_departure: true,
                  date_flight: true,
                  estimation_minute: true,
                  city_arrive: {
                    select: {
                      id: true,
                      name: true,
                      code: true,
                      airport_name: true,
                    },
                  },
                  city_destination: {
                    select: {
                      id: true,
                      name: true,
                      code: true,
                      airport_name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!order) {
        return res.status(404).json({
          status: false,
          message: `Order with id ${orderId} not found`,
          data: null,
        });
      }

      if (order.detailFlight && order.detailFlight.detail_plane_id) {
        const detailPlane = await prisma.detailPlane.findUnique({
          where: { id: order.detailFlight.detail_plane_id },
          include: {
            plane: true,
            seat_class: true,
          },
        });

        order.detailFlight.detailPlane = detailPlane;
      }
      order.detailFlight.flight.date_flight = formatDateToUTC(
        order.detailFlight.flight.date_flight
      );
      order.detailFlight.flight.time_arrive = formatTimeToUTC(
        order.detailFlight.flight.time_arrive
      );
      order.detailFlight.flight.time_departure = formatTimeToUTC(
        order.detailFlight.flight.time_departure
      );
      order.expired_paid = formatDateTimeToUTC(order.expired_paid);

      return res.status(200).json({
        status: true,
        message: "Get detail orders successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },
  generateQR: async (req, res, next) => {
    try {
      let { qr_data } = req.body;

      if (!qr_data) {
        return res.status(400).json({
          status: false,
          message: "qr_data is required",
          data: null,
        });
      }

      if (typeof qr_data !== "string") {
        return res.status(400).json({
          status: false,
          message: "qr_data must be a string",
          data: null,
        });
      }

      let qrCode = qr.imageSync(qr_data, { type: "png" });

      let { url } = await imageKit.upload({
        fileName: utcTimePlus7() + ".png",
        file: qrCode.toString("base64"),
      });

      return res.status(201).json({
        status: true,
        message: "Generate QR-Code Successfully",
        data: url,
      });
    } catch (error) {
      next(error);
    }
  },
};
