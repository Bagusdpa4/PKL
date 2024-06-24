const fs = require('fs');

async function citySeed(prisma) {
    try {
        const rawData = fs.readFileSync('./assets/core/city_seed_data.json');
        const data = JSON.parse(rawData);
        await prisma.city.createMany({ data });
        console.log('city data seeded successfully');
    } catch (error) {
        console.log(error);
    }
}

module.exports = citySeed;
