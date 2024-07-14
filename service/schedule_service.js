const { PrismaClient, Prisma } = require("@prisma/client");
const { validate } = require("../validation/validation");
const { scheduleValidation } = require("../validation/schedule_validation");
const prisma = new PrismaClient()

const getDataFind = async ({ city_arrive_id, city_destination_id, date_flight, seat_class, order = true, price_from, price_to, time_from, time_to, skip = 0, take = 5 }) => {
    let condition = "";
    let defaultOrder = order ? 'ASC' : 'DESC';


    if (!condition && price_from !== undefined && price_to !== undefined) {
        condition += `AND df.price BETWEEN ${price_from} AND ${price_to} ORDER BY df.price ${defaultOrder}`;

    }

    if (!condition && time_from != "" && time_to != "") {
        condition = `AND fl.time_departure BETWEEN CAST('${time_from}' AS TIME) AND CAST('${time_to}' AS TIME) ORDER BY fl.time_departure ${defaultOrder}`;
    }

    const query = Prisma.sql`
        SELECT
            df.id AS flightDetailId,
            df.price AS price,
            sc.type_class AS flightSeat,
            pl.name AS flightPlane,
            fl.id AS id,
            fl.flight_number AS flightNumber,
            fl.time_arrive,
            fl.time_departure,
            fl.date_flight,
            fl.estimation_minute,
            ca.code AS cityArriveCode,
            ca.name AS cityArriveName,
            ca.airport_name AS cityArriveAirportName,
            cd.code AS citydestinationCode,
            cd.name AS citydestinationName,
            cd.airport_name AS citydestinationAirportName
        FROM
            detail_flight AS df
            JOIN flights AS fl ON df.flight_id = fl.id
            JOIN detail_plane AS dp ON dp.id = df.detail_plane_id
            JOIN cities AS ca ON ca.id = fl.city_arrive_id
            JOIN cities AS cd ON cd.id = fl.city_destination_id
            JOIN seat_class AS sc ON sc.id = dp.seat_class_id
            JOIN planes AS pl ON pl.id = dp.plane_id
        WHERE
            fl.city_arrive_id = ${city_arrive_id}
            AND fl.city_destination_id = ${city_destination_id}
            AND fl.date_flight = CAST(${date_flight} AS DATE)
            AND dp.seat_class_id = ${seat_class}
            ${Prisma.raw(condition)}
        OFFSET ${skip}
        LIMIT ${take};`;



    const result = await prisma.$queryRaw(query);
    return result;
};



const countDataFind = async ({ city_arrive_id, city_destination_id, date_flight, seat_class, price_from, price_to, time_from, time_to }) => {
    let condition = "";


    if (!condition && price_from !== undefined && price_to !== undefined) {
        condition += `AND df.price BETWEEN ${price_from} AND ${price_to}`;

    }

    if (!condition && time_from != "" && time_to != "") {
        condition = `AND fl.time_departure BETWEEN CAST('${time_from}' AS TIME) AND CAST('${time_to}' AS TIME)`;
    }

    const query = Prisma.sql`
        SELECT count(df.id) as total
        FROM
            detail_flight AS df
            JOIN flights AS fl ON df.flight_id = fl.id
            JOIN detail_plane AS dp ON dp.id = df.detail_plane_id
            JOIN cities AS ca ON ca.id = fl.city_arrive_id
            JOIN cities AS cd ON cd.id = fl.city_destination_id
            JOIN seat_class AS sc ON sc.id = dp.seat_class_id
            JOIN planes AS pl ON pl.id = dp.plane_id
        WHERE
            fl.city_arrive_id = ${city_arrive_id}
            AND fl.city_destination_id = ${city_destination_id}
            AND fl.date_flight = CAST(${date_flight} AS DATE)
            AND dp.seat_class_id = ${seat_class}
            ${Prisma.raw(condition)};`;

    const result = await prisma.$queryRaw(query);
    return Number(result[0].total);
}

const getDetailFlightByFlightId = async (flightId) => {
    return await prisma.detailFlight.findMany({
        where: {
            flight_id: flightId
        },
        select: {
            id: true,
            price: true,
            detailPlaneId: {
                select: {
                    seat_class: {
                        select: {
                            id: true,
                            type_class: true
                        }
                    },
                    plane: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    })
}

const getDetailFlightById = async (detailFlightId) => {
    return await prisma.detailFlight.findUnique({
        where: {
            id: detailFlightId
        },
        select: {
            id: true,
            flight_id: true,
            detailPlaneId: {
                select: {
                    plane: {
                        select: {
                            name: true
                        }
                    },

                }
            },
            flight: {
                select: {
                    city_arrive: true,
                    city_destination: true,
                    estimation_minute: true
                }
            },
            price: true
        }
    })
}


const getDetailFlight = async () => {
    return await prisma.detailFlight.findMany({
        select: {
            id: true,
            flight_id: true,
            detailPlaneId: {
                select: {
                    plane: {
                        select: {
                            name: true
                        }
                    },

                }
            },
            flight: {
                select: {
                    city_arrive: true,
                    city_destination: true,
                    estimation_minute: true
                }
            },
            price: true
        },
        take: 5
    })
}


const createSchedule = async (flightData) => {
    try {
        const createdFlight = await prisma.flight.create({ data: flightData });

        const detailData = v.detail_data.map(detail => ({
            detail_plane_id: detail.detail_plane_id,
            price: detail.price,
            flight_id: createdFlight.id,
        }));

        return { createdFlight, detailData }
    } catch (error) {
        return { error }
    }

}


const createFligth = async ({ date_flight,
    estimation_minute,
    flight_number,
    time_arrive,
    time_departure,
    city_arrive_id,
    city_destination_id,
    discount }) => {
    try {
        return await prisma.flight.create({
            data: {
                date_flight,
                estimation_minute,
                flight_number,
                time_arrive,
                time_departure,
                city_arrive_id,
                city_destination_id,
                discount,
            }
        })
    } catch (error) {
        throw error
    }
}


const createDetailFligth = async ({ price, detail_plane_id, flight_id }) => {
    try {
        return await prisma.detailFlight.create({
            data: {
                price, detail_plane_id, flight_id
            }
        })
    } catch (error) {
        throw error
    }
}


module.exports = {
    getDataFind,
    countDataFind,
    createSchedule,
    getDetailFlightById,
    getDetailFlight,
    getDetailFlightByFlightId,
    createFligth,
    createDetailFligth
}