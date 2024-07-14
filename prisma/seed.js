const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const airlaneSeed = require('./seeder/airlanes_seed')
const planeSeed = require('./seeder/plane_seed')
const continentSeed = require('./seeder/continent_seed')
const rollbackSeed = require('./seeder/rollback_seed')
const countrySeed = require('./seeder/countries_seed')
const citySeed = require('./seeder/cities_seed')
const seatClassSeed = require('./seeder/seat_class_seed')
const scheduleSeed = require('./seeder/schedule_seed')
const detailPlaneSeed = require('./seeder/detail_plane_seed')
const userAdmin = require('./seeder/user_seed')

async function main() {
    await rollbackSeed()
    await airlaneSeed(prisma)
    await planeSeed(prisma)
    await continentSeed(prisma)
    await countrySeed(prisma)
    await citySeed(prisma)
    await seatClassSeed(prisma)
    await detailPlaneSeed(prisma)
    await scheduleSeed(prisma)
    // await userAdmin(prisma)

}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })