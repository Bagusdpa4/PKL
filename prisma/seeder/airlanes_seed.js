const fs = require("fs")

async function airlaneSeed(prisma) {
    try {
        const rawData = fs.readFileSync('./assets/core/airlines_seed_data.json');
        const data = JSON.parse(rawData);
        await prisma.airlines.createMany({ data })
        console.log('airlines data seeded successfully');
    } catch (error) {
        console.log(error)
    }
}

module.exports = airlaneSeed