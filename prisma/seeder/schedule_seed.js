const fs = require("fs");
const { checkDateLater } = require("../../utils/formattedDate");

async function scheduleSeed(prisma) {
    const rawData = fs.readFileSync('./assets/core/schedule_seed_data.json');
    const data = JSON.parse(rawData);
    try {
        for (let i = 1; i < 8; i++) {

            for (const v of data) {
                const flightData = {
                    city_destination_id: v.city_destination_id,
                    city_arrive_id: v.city_arrive_id,
                    flight_number: v.flight_number + i,
                    time_arrive: new Date(v.time_arrive),
                    time_departure: new Date(v.time_departure),
                    date_flight: checkDateLater(i),
                    estimation_minute: v.estimation_minute,
                };

                const createdFlight = await prisma.flight.create({ data: flightData });

                const detailData = v.detail_data.map(detail => ({
                    detail_plane_id: detail.detail_plane_id,
                    price: detail.price,
                    flight_id: createdFlight.id,
                }));

                await prisma.detailFlight.createMany({ data: detailData });
            }
        }
        console.log('schedule data seeded successfully');
    } catch (error) {
        console.error('Error seeding schedule data:', error);
    }
}


module.exports = scheduleSeed;
