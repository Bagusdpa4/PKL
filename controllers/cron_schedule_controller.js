const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getNextWeekDate, utcTimePlus7, convertToIso } = require("../utils/formattedDate");
const { checkIsExecute } = require("../service/cron_upload_service");

const getCronScheduleData = async (hari) => {
    const daysMap = [
        'isSunday',
        'isMonday',
        'isTuesday',
        'isWednesday',
        'isThursday',
        'isFriday',
        'isSaturday'
    ];

    try {
        if (hari >= 0 && hari < daysMap.length) {
            const dayProperty = daysMap[hari];
            console.log(`Fetching data for day property: ${dayProperty}`);
            const data = await prisma.cronJobSchedule.findMany({
                where: {
                    [dayProperty]: true
                },
                include: {
                    detail_cron_Job_Schedul: true
                }
            });
            console.log(`Data fetched for ${dayProperty}:`, data);
            return data;
        } else {
            console.error('Hari tidak valid');
            return 'Hari tidak valid';
        }
    } catch (error) {
        console.error("Error fetching schedule data:", error);
        throw error;
    }
};

const runCronJob = async (req, res) => {
    console.log("cron schedule running");
    try {
        let now = utcTimePlus7();
        console.log("Current time:", now);
        now.setDate(now.getDate() + 7);
        let hari = now.getDay();
        console.log("Day of the week:", hari);

        let data = await getCronScheduleData(hari);
        console.log("Fetched data:", data);

        data.forEach(async (value) => {
            let detailFlight = value.detail_cron_Job_Schedul;
            delete value.detail_cron_Job_Schedul;
            console.log("Executing checkIsExecute for:", value);
            await checkIsExecute(now, value, detailFlight);
        });

        res.status(200).send("Cron job executed successfully");
    } catch (error) {
        console.error("Error executing cron job:", error);
        res.status(500).send("Error executing cron job");
    }
};

module.exports = {
    runCronJob
};