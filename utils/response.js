const jsonResponse = (res, code = 200, { status = true, message = "Success", data = null, page, perPage, pageCount, totalCount }) => {
    return res.status(code).json({
        status,
        message,
        data,
        page,
        perPage,
        pageCount,
        totalCount
    })
}

module.exports = jsonResponse
