const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()


module.exports = {
    getAll: async () => {
        try {
            return prisma.order.findMany()
        } catch (error) {
            throw error
        }
    },
    getById: async () => {
        try {
            return prisma.order.findMany()
        } catch (error) {
            throw error
        }
    },
    getDataForRecomendation: async () => {
        try {
            const result = await prisma.$queryRaw`
                SELECT detail_flight_id, COUNT(id) AS order_count
                FROM orders
                GROUP BY detail_flight_id;
                `;

            return result
        } catch (error) {
            throw error
        }
    },
    getDataForRecomendationByContinent: async (continentId) => {
        try {
            const result = await prisma.$queryRaw`
                SELECT  o.detail_flight_id, COUNT(o.id) AS order_count
                FROM orders o
                JOIN detail_flight df ON o.detail_flight_id = df.id
                JOIN flights f ON df.flight_id = f.id
                JOIN cities cd ON f.city_destination_id = cd.id
                JOIN cities ca ON f.city_arrive_id = ca.id
                JOIN countries sd ON cd.country_id = sd.id
                JOIN countries sa ON ca.country_id = sa.id
                WHERE sd.continent_id = ${continentId} AND sa.continent_id = ${continentId}
                GROUP BY o.detail_flight_id;
                `;
            return result
        } catch (error) {
            throw error
        }
    },

    getDataForRecomendationByCity: async (city, limit) => {
        try {
            const result = await prisma.$queryRaw`
                SELECT  o.detail_flight_id, COUNT(o.id) AS order_count
                FROM orders o
                JOIN detail_flight df ON o.detail_flight_id = df.id
                JOIN flights f ON df.flight_id = f.id
                JOIN cities cd ON f.city_destination_id = cd.id
                JOIN cities ca ON f.city_arrive_id = ca.id
                JOIN countries sd ON cd.country_id = sd.id
                JOIN countries sa ON ca.country_id = sa.id
                WHERE cd.id = ${city}
                GROUP BY o.detail_flight_id
                LIMIT ${limit}
                ;
                `;
            return result
        } catch (error) {
            throw error
        }
    },
    getDiscountDataForRecomendationByCity: async (city) => {
        try {
            const result = await prisma.$queryRaw`
                SELECT  o.detail_flight_id, COUNT(o.id) AS order_count
                FROM orders o
                JOIN detail_flight df ON o.detail_flight_id = df.id
                JOIN flights f ON df.flight_id = f.id
                JOIN cities cd ON f.city_destination_id = cd.id
                JOIN cities ca ON f.city_arrive_id = ca.id
                JOIN countries sd ON cd.country_id = sd.id
                JOIN countries sa ON ca.country_id = sa.id
                WHERE cd.id = ${city} AND f.discount > 0
                GROUP BY o.detail_flight_id
                LIMIT 3
                ;
                `;
            return result
        } catch (error) {
            throw error
        }
    },

    orderRecomendationByCity: async () => {
        const result = await prisma.$queryRaw`
                SELECT
                    cd.id,
                    cd.name AS city_destination,
                    COUNT(o.id) AS order_count
                FROM
                    orders o
                    JOIN detail_flight df ON o.detail_flight_id = df.id
                    JOIN flights f ON df.flight_id = f.id
                    JOIN cities cd ON f.city_destination_id = cd.id
                    JOIN cities ca ON f.city_arrive_id = ca.id
                    JOIN countries sd ON cd.country_id = sd.id
                    JOIN countries sa ON ca.country_id = sa.id
                GROUP BY
                    cd.id
                ORDER BY
                    order_count DESC
                LIMIT
                    5;`
        return result
    },


    getRecomendationDataByCity: async (city) => {
        const result = await prisma.$queryRaw`
       SELECT
    f.id AS flight_id,
    f.flight_number,
    f.departure_time,
    f.arrival_time,
    cd.name AS city_destination,
    ca.name AS city_arrive,
    sd.name AS country_destination,
    sa.name AS country_arrive
FROM
    orders o
    JOIN detail_flight df ON o.detail_flight_id = df.id
    JOIN flights f ON df.flight_id = f.id
    JOIN cities cd ON f.city_destination_id = cd.id
    JOIN cities ca ON f.city_arrive_id = ca.id
    JOIN countries sd ON cd.country_id = sd.id
    JOIN countries sa ON ca.country_id = sa.id
WHERE
    cd.name 
ORDER BY
    cd.name, f.departure_time;`;

        return result;
    }




}