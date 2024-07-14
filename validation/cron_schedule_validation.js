const joi = require("joi");

const categorySchema = joi.object({
    price: joi.number().required(),
    detail_plane_id: joi.number().required()
});

const cronScheduleValidation = joi.object({
    time_arrive: joi.string()
        .required()
        .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .message('Invalid time format, use HH:mm'),
    time_departure: joi.string()
        .required()
        .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .message('Invalid time format, use HH:mm'),
    city_arrive_id: joi.number().required(),
    city_destination_id: joi.number().required(),
    discount: joi.number().max(100).min(0),
    is_monday: joi.bool(),
    is_thuesday: joi.bool(),
    is_wednesday: joi.bool(),
    is_thursday: joi.bool(),
    is_friday: joi.bool(),
    is_saturday: joi.bool(),
    is_sunday: joi.bool(),
    category: joi.array().items(categorySchema)
});


module.exports = cronScheduleValidation;
