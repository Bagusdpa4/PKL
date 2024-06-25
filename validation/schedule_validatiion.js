const joi = require("joi")

const scheduleValidation = joi.object({
    city_arrive_id: joi.string().required(),
    city_destination_id: joi.string().required(),
    date_departure: joi.string().required(),
    seat_class: joi.number().required(),
    passenger: joi.object({
        children: joi.number(),
        adult: joi.number(),
    }),
    sorting: joi.object({
        sortAsc: joi.boolean(),
        time_departure_from: joi.string().allow(null),
        time_departure_to: joi.string().allow(null),
        price_from: joi.number().allow(null),
        price_to: joi.number().allow(null),
    })
})


module.exports = {
    scheduleValidation
}