const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const get = async (params) => {
    try {
        return await prisma.country.findMany(
            {
                where: {
                    name: {
                        contains: params,
                        mode: "insensitive"
                    }
                },
                select: {
                    id: true,
                    name: true,
                    code: true,
                    continent_id: true
                }
            }
        );
    } catch (error) {
        throw error
    }
}

const getCountryId = async (params) => {
    try {
        let id = await prisma.country.findFirst(
            {
                where: {
                    name: {
                        contains: params,
                        mode: "insensitive"
                    }
                },
                select: {
                    id: true
                }

            }
        );
        if (!id) {
            return 0
        }
        return id.id
    } catch (error) {
        throw error
    }
}

module.exports = {
    get,
    getCountryId
}