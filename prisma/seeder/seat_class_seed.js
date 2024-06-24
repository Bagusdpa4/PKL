const fs = require("fs")

async function seatClassSeed(prisma) {
    try {
        const rawData = fs.readFileSync('./assets/core/seat_class_seed_data.json');
        const data = JSON.parse(rawData);
        await prisma.seatClass.createMany({ data })
        console.log('seatClass data seeded successfully');
    } catch (error) {
        console.log(error)
    }
}

module.exports = seatClassSeed