const fs = require("fs")

async function continentSeed(prisma) {
    try {
        const rawData = fs.readFileSync('./assets/core/continent_seed_data.json');
        const data = JSON.parse(rawData);
        await prisma.continent.createMany({ data })
        console.log("continent data seeded succesfully")
    } catch (error) {
        console.log(error)
    }
}

module.exports = continentSeed