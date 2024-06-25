const countriesService = require("../service/country_service")

const getAllCountries = async (req, res, next) => {
    let { find } = req.query
    let data = await countriesService.get(find);
    if (!data) {
        res.status(400).json({
            status: false,
            message: "failed retrive countries data",
            data: null
        })
    }
    data = data.map(country => ({
        id: country.id,
        name: country.name,
        code: country.code,
        continent_id: country.continent_id
    }))

    res.status(200).json({
        status: true,
        message: "success retrive countries data",
        data
    })
}

module.exports = {
    getAllCountries
}