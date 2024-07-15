const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

var cron = require("node-cron");
const { getNextWeekDate, utcTimePlus7, convertToIso } = require("../utils/formattedDate");
const { checkIsExecute } = require("./cron_upload_service");

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
            const data = await prisma.cronJobSchedule.findMany({
                where: {
                    [dayProperty]: true
                },
                include: {
                    detail_cron_Job_Schedul: true
                }
            });
            return data;
        } else {
            return 'Hari tidak valid';
        }
    } catch (error) {
        console.error("Error fetching schedule data:", error);
        throw error;
    }
};



var task = cron.schedule('1 * 0 * * *', async () => {
    console.log("cron schedule runing")
    try {
        let now = utcTimePlus7()
        now.setDate(now.getDate() + 7);
        let hari = now.getDay();

        let data = await getCronScheduleData(hari)

        data.forEach(async (value) => {
            let detailFlight = value.detail_cron_Job_Schedul
            delete value.detail_cron_Job_Schedul
            await checkIsExecute(now, value, detailFlight)
        })
    } catch (error) {
        throw error
    }

}, { timezone: "Asia/Jakarta" });



module.exports = task
