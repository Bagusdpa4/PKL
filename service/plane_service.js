const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()


const checkPlaneSeries = async (series) => {
    try {
        return await prisma.plane.count({
            where: {
                series
            }
        })
    } catch (error) {
        throw error
    }
}

const createAirlineData = async ({ code, logo_url, name, since }) => {
    try {
        return await prisma.airlines.create({
            data: {
                code,
                logo_url,
                name,
                since
            }
        })
    } catch (error) {
        throw error
    }
}

const createPlaneData = async ({ capacity, name, series, airline_id, brand }) => {
    try {
        return await prisma.plane.create({
            data: {
                capacity,
                name,
                series,
                airlinesId: airline_id,
                brand
            }
        })
    } catch (error) {
        throw error
    }
}

const createDetailPlane = async (data) => {
    try {
        return await prisma.detailPlane.createMany({ data })
    } catch (error) {
        throw error
    }
}

const getAirlinesData = async () => {
    try {
        return await prisma.airlines.findMany()
    } catch (error) {
        throw error
    }
}

const getPlaneData = async () => {
    try {
        return await prisma.plane.findMany()
    } catch (error) {
        throw error
    }
}

const getDetailPlane = async (planeId) => {
    try {
        return await prisma.detailPlane.findMany({
            where: {
                plane_id: planeId
            }
        })
    } catch (error) {
        throw error
    }
}



module.exports = {
    createPlaneData,
    createAirlineData,
    createDetailPlane,
    getPlaneData,
    getAirlinesData,
    getDetailPlane,
    checkPlaneSeries
}