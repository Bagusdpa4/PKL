const continentsService = require("../service/continents_service")

const getAllContinents = async (req, res, next) => {
    let { find } = req.query
    let data = await continentsService.get(find);
    if (!data) {
        res.status(400).json({
            status: false,
            message: "failed retrive continents data",
            data: null
        })
    }
    data = data.map(continent => ({
        id: continent.id,
        name: continent.name,
        code: continent.code,
    }))

    res.status(200).json({
        status: true,
        message: "success retrive continents data",
        data
    })
}

module.exports = {
    getAllContinents
}