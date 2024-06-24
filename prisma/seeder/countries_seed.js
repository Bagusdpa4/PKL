const fs = require("fs")


async function countrySeed(prisma) {
    try {
        const rawData = fs.readFileSync('./assets/core/countries_seed_data.json');
        const data = JSON.parse(rawData);
        await prisma.country.createMany({ data })
        console.log('country data seeded successfully');
    } catch (error) {
        console.log(error)
    }
}

module.exports = countrySeed
