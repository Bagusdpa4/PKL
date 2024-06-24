const fs = require("fs")

async function detailPlaneSeed(prisma) {
    try {
        const data = []

        for (let i = 1; i < 25; i++) {
            data.push({
                total_seat: 120,
                seat_class_id: 1,
                plane_id: i
            })
            data.push({
                total_seat: 75,
                seat_class_id: 2,
                plane_id: i
            })
            data.push({
                total_seat: 60,
                seat_class_id: 3,
                plane_id: i
            })
            data.push({
                total_seat: 30,
                seat_class_id: 4,
                plane_id: i
            })
            data.push({
                total_seat: 15,
                seat_class_id: 5,
                plane_id: i
            })
        }
        await prisma.detailPlane.createMany({ data })
        console.log('detailPlane data seeded successfully');
    } catch (error) {
        console.log(error)
    }
}

module.exports = detailPlaneSeed
