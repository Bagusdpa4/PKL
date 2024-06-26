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
        console.log(continentId)
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
            console.log(error)
            throw error
        }
    },
}