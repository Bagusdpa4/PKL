const { PrismaClient } = require("@prisma/client");
const { formatTimeToUTC, formatDateToUTC } = require("../utils/formattedDate");
const prisma = new PrismaClient();
const paginationReq = require("../utils/pagination");
const jsonResponse = require("../utils/response");

module.exports = {
  getAllFlights: async (req, res, next) => {
    try {
      const { page } = req.query;
      let pagination = paginationReq.paginationPage(Number(page), 10);

      const flights = await prisma.flight.findMany({
        take: pagination.take, skip: pagination.skip
      });

      const totalData = await prisma.flight.count();
      const totalPage = Math.ceil(totalData / pagination.take);

      return jsonResponse(res, 200, {
        message: "All flights retrieved successfully",
        data: flights,
        page: Number(page) ?? 1,
        perPage: flights.length,
        pageCount: totalPage,
        totalCount: totalData,
      });
    } catch (error) {
      next(error);
    }
  },
  getDetailFlights: async (req, res, next) => {
    try {
      const detailFlightId = parseInt(req.params.id);
      const { passenger } = req.query
      const flight = await prisma.detailFlight.findUnique({
        where: {
          id: detailFlightId
        },
        select: {
          id: true,
          price: true,
          flight: {
            include: {
              city_arrive: true,
              city_destination: true
            }
          },
          detailPlaneId: {
            select: {
              seat_class: true,
              plane: {
                select: {
                  id: true,
                  name: true,
                  airline_id: {
                    select: {
                      id: true,
                      name: true,
                      logo_url: true
                    }
                  }
                }
              }
            }
          }
        }
      })

      if (flight) {
        delete flight.city_arrive_id;
        delete flight.city_destination_id;

        let data = {
          flightDetailId: flight.id,
          flightId: flight.flight.id,
          price: flight.price,
          totalPrice: flight.price * Number(passenger ?? 1),
          flightSeat: flight.detailPlaneId.seat_class.type_class,
          flightPlane: flight.detailPlaneId.plane,
          flight_number: flight.flight.flight_number,
          time_arrive: formatTimeToUTC(flight.flight.time_arrive),
          time_departure: formatTimeToUTC(flight.flight.time_departure),
          date_flight: formatDateToUTC(flight.flight.date_flight),
          city_arrive: flight.flight.city_arrive,
          city_destination: flight.flight.city_destination,
          estimation_minute: flight.flight.estimation_minute,
        }

        res.status(200).json({
          status: true,
          message: "Flight details retrieved successfully",
          data: data,
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Flight not found",
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
