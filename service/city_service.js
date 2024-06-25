const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const get = async (params) => {
    try {
        return await prisma.city.findMany(
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
                    airport_name: true,
                    country: {
                        select: {
                            name: true
                        }
                    }
                }

            }
        );
    } catch (error) {
        throw error
    }
}

const getCityId = async (params) => {
    try {
        let id = await prisma.city.findFirst(
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
    getCityId
}