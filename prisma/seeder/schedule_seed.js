const fs = require("fs")

async function scheduleSeed(prisma) {
    let dateNow = new Date()
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
                    date_flight: checkDate(i),
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
function checkDate(daysLater) {
    var now = new Date();
    const totalDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    let day = now.getDate();
    let dayLater = day + daysLater
    let month = now.getMonth() + 1;
    let year = now.getFullYear();


    if (dayLater > totalDate) {
        dayLater = dayLater - totalDate

        let nextDate = new Date(year, (month - 1) + 1, dayLater);
        return nextDate
    }
    nextDate = new Date(year, month - 1, dayLater);
    return nextDate

}

module.exports = scheduleSeed;
