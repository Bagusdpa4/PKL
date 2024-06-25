var cron = require("node-cron");
const { createSchedule } = require("./schedule_service");
const { getNextWeekDate } = require("../utils/formattedDate");

const data = {
    "city_arrive_id": 1,
    "city_destination_id": 2,
    "flight_number": "sup-5707",
    "time_arrive": "2024-05-24T15:30:00.000Z",
    "time_departure": "2024-05-24T05:00:00.000Z",
    "date_flight": "2024-05-",
    "estimation_minute": 240,
    "detail_data": [
        {
            "detail_plane_id": 1,
            "price": 500000
        },
        {
            "detail_plane_id": 2,
            "price": 1000000
        },
        {
            "detail_plane_id": 3,
            "price": 1500000
        },
        {
            "detail_plane_id": 4,
            "price": 2500000
        }
    ]
}

var task = cron.schedule('0 0 * * *', () => {
    let pushdata = data
    pushdata.date_flight = getNextWeekDate()
    createSchedule(pushdata)
}, { timezone: "Asia/Jakarta" });



module.exports = task