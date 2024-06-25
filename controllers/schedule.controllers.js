const orderService = require("../service/order_service")
const scheduleService = require("../service/schedule_service")
const { getCityId } = require("../service/city_service")
const { formatTimeToUTC, formatAddZeroFront, convertToIso, convertTOManual } = require("../utils/formattedDate")
const pagination = require("../utils/pagination")
const jsonResponse = require("../utils/response")
const { ResponseError } = require("../error/response_error")
const { validate } = require("../validation/validation")
const { scheduleValidation } = require("../validation/schedule_validation")

const findSchedule = async (req, res, next) => {
    try {
        const request = validate(scheduleValidation, req.body)
        const { page } = req.query

        let [day, month, year] = request.date_departure.split('-');

        let dateNow = new Date(request.date_departure)
        const yesterday = new Date(dateNow.getDate() - 1)
        if (dateNow <= yesterday) {
            return jsonResponse(res, 400, { status: false, message: "The departure date has already passed", })
        }

        day = formatAddZeroFront(day)
        month = formatAddZeroFront(month)


        const isoDate = convertTOManual({ day, month, year })
        const paginat = pagination.paginationPage(Number(page))
        const totalPasenger = calculateTotalPassengers(request.passenger)
        const cityArriveId = await getCityId(request.city_arrive_id)
        const cityDestinationId = await getCityId(request.city_destination_id)

        if (!cityArriveId || !cityDestinationId) {
            throw new ResponseError(400, "City Not found")
        }

        let data = await scheduleService.getDataFind({
            city_arrive_id: cityArriveId,
            city_destination_id: cityDestinationId,
            date_flight: isoDate,
            seat_class: request.seat_class,
            order: request.sorting.sortAsc,
            price_from: request.sorting.price_from,
            price_to: request.sorting.price_to,
            time_from: request.sorting.time_departure_from,
            time_to: request.sorting.time_departure_to,
            skip: paginat.skip,
            take: paginat.take,
        })

        let totalData = await scheduleService.countDataFind({
            city_arrive_id: cityArriveId,
            city_destination_id: cityDestinationId,
            date_flight: isoDate,
            seat_class: request.seat_class,
            price_from: request.sorting.price_from,
            price_to: request.sorting.price_to,
            time_from: request.sorting.time_departure_from,
            time_to: request.sorting.time_departure_to,
        })
        let totalPage = pagination.paginationPageTotal(totalData)

        data.forEach((v) => {
            v.time_arrive = formatTimeToUTC(v.time_arrive)
            v.time_departure = formatTimeToUTC(v.time_departure)

            let day = v.date_flight.getUTCDate();
            let month = v.date_flight.getUTCMonth() + 1;
            let year = v.date_flight.getUTCFullYear();

            day = day.toString().padStart(2, '0')
            month = month.toString().padStart(2, '0')

            let fullDate = `${day}-${month}-${year}`;
            v.date_flight = fullDate
            v.city_arive = {
                code: v.cityarrivecode,
                name: v.cityarrivename,
                airport_name: v.cityarriveairportname
            }
            v.city_destination = {
                code: v.citydestinationcode,
                name: v.citydestinationname,
                airport_name: v.citydestinationairportname
            }

            v.totalPrice = totalPasenger * v.price

            delete v.cityarrivecode
            delete v.cityarrivename
            delete v.cityarriveairportname
            delete v.citydestinationcode
            delete v.citydestinationname
            delete v.citydestinationairportname

        })

        if (!data) {
            return jsonResponse(res, 400, {
                status: false,
                message: "schedule data not found",
            })
        }

        return jsonResponse(res, 200, {
            message: "success retrive schedule data",
            data: data,
            page: Number(page) ?? 1,
            perPage: data.length,
            pageCount: totalPage,
            totalCount: totalData,
        })

    } catch (error) {
        next(error)
    }
}

const mostPurchaseSchedule = async (req, res, next) => {
    const { continent } = req.query
    let isContinent = false
    let data
    if (continent != null) {
        isContinent = true
        data = await orderService.getDataForRecomendationByContinent(Number(continent))
    } else {
        data = await orderService.getDataForRecomendation()
    }

    data.forEach((countryObject) => {
        countryObject.order_count = Number(countryObject.order_count)
    });

    data.sort((a, b) => b.order_count - a.order_count)

    data = data.slice(0, 5)

    // for (let item of data) {
    //     item = await scheduleService.getDetailFlightById(item.detail_flight_id);
    //     delete item.detail_flight_id
    //     delete item.order_count
    // }

    data = await Promise.all(data.map(async (item) => {
        return await scheduleService.getDetailFlightById(item.detail_flight_id)

    }))

    if (data.length == 0 && !isContinent) {
        data = await scheduleService.getDetailFlight()
    }


    if (!data) {
        return jsonResponse(res, 400, {
            status: false,
            message: "schedule data not found",
        })
    }

    return jsonResponse(res, 200, {
        status: true,
        message: "success retrive schedule data",
        data
    })
}

function calculateTotalPassengers(passenger) {
    const { adult, children } = passenger
    return Number(adult) + Number(children)
}




module.exports = {
    findSchedule,
    mostPurchaseSchedule
}