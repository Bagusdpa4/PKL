const { PrismaClient } = require("@prisma/client");
const { createFlight, createDetailFlight } = require("./schedule_service");
const { generateRandomString } = require("../utils/helper");
const prisma = new PrismaClient()

const createCronSchedule = async ({
    flight_key,
    time_arrive,
    time_departure,
    city_arrive_id,
    city_destination_id,
    estimation_minute,
    discount,
    isMonday,
    isTuesday,
    isWednesday,
    isThursday,
    isFriday,
    isSaturday,
    isSunday
}) => {
    try {
        const data = await prisma.cronJobSchedule.create({
            data: {
                flight_key,
                time_arrive,
                time_departure,
                city_arrive_id,
                city_destination_id,
                estimation_minute,
                discount,
                isMonday,
                isTuesday,
                isWednesday,
                isThursday,
                isFriday,
                isSaturday,
                isSunday,
            }
        })
        return data
    } catch (error) {
        throw error
    }
}

const createDetailCronSchedule = async (price, detailPlaneId, cronJobScheduleId) => {
    try {
        const result = await prisma.detailCronJobSchedul.create({
            data: {
                price: price,
                detail_plane_id: detailPlaneId,
                cron_job_Schedule_id: cronJobScheduleId,
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
}


const getCronSchedule = async () => {
    try {
        const result = await prisma.cronJobSchedule.findMany({
            include: {
                detail_cron_Job_Schedul: true,
                city_arrive: true,
                city_destination: true,
            },
        });
        return result
    } catch (error) {
        throw error
    }
}


const checkIsExecute = async (now, value, detailValue) => {
    const createFlightWithDetails = async () => {
        console.log("Creating flight with details for:", value);
        const data = await createFlight({
            flight_number: generateRandomString(6),
            city_arrive_id: value.city_arrive_id,
            city_destination_id: value.city_destination_id,
            date_flight: now,
            discount: value.discount,
            estimation_minute: value.estimation_minute,
            time_arrive: value.time_arrive,
            time_departure: value.time_departure
        });
        console.log("Flight created:", data);

        for (let i = 0; i < detailValue.length; i++) {
            console.log("Creating detail flight for:", detailValue[i]);
            await createDetailFlight({
                detail_plane_id: detailValue[i].detail_plane_id,
                flight_id: data.id,
                price: detailValue[i].price
            });
        }
    };

    console.log("Checking execution for day:", now.getDay());
    switch (now.getDay()) {
        case 0:
            if (value.isSunday) {
                console.log("Executing for Sunday");
                await createFlightWithDetails();
            }
            break;
        case 1:
            if (value.isMonday) {
                console.log("Executing for Monday");
                await createFlightWithDetails();
            }
            break;
        case 2:
            if (value.isTuesday) {
                console.log("Executing for Tuesday");
                await createFlightWithDetails();
            }
            break;
        case 3:
            if (value.isWednesday) {
                console.log("Executing for Wednesday");
                await createFlightWithDetails();
            }
            break;
        case 4:
            if (value.isThursday) {
                console.log("Executing for Thursday");
                await createFlightWithDetails();
            }
            break;
        case 5:
            if (value.isFriday) {
                console.log("Executing for Friday");
                await createFlightWithDetails();
            }
            break;
        case 6:
            if (value.isSaturday) {
                console.log("Executing for Saturday");
                await createFlightWithDetails();
            }
            break;
    }
}


module.exports = {
    createCronSchedule,
    createDetailCronSchedule,
    getCronSchedule,
    checkIsExecute
}