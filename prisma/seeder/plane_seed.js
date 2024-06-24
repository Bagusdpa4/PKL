const fs = require("fs")

async function planeSeed(prisma) {
  const rawData = fs.readFileSync('./assets/core/plane_seed_data.json');
  const data = JSON.parse(rawData);
  await prisma.plane.createMany({ data })

  console.log('Planes data seeded successfully');
}

module.exports = planeSeed;
