const joi = require("joi")

const detailPlaneValidation = joi.object({
    seat_class_id: joi.number().required(),
    total_seat: joi.number().required()
})

const planeValidation = joi.object({
    name: joi.string().required(),
    series: joi.string().required(),
    airline_id: joi.number().required(),
    capacity: joi.number().required(),
    detail_plane: joi.array().items(detailPlaneValidation)
})


module.exports = planeValidation