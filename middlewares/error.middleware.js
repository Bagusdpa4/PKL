const { ResponseError } = require("../error/response_error");
const jsonResponse = require("../utils/response");
const Sentry = require("@sentry/node");

const errorMiddleware = (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }

    Sentry.captureException(err);

    if (err instanceof ResponseError) {
        return jsonResponse(res, err.status, {
            status: false,
            message: err.message,
        });
    }

    if (err.status === 404) {
        return jsonResponse(res, 404, {
            status: false,
            message: "Resource not found",
        });
    }
    console.log("got new error", err.message, "\n", err.stack)
    if (err.status === 500) {

        return jsonResponse(res, 500, {
            status: false,
            message: "Internal Server Error",
        });
    }

    return jsonResponse(res, 500, {
        status: false,
        message: err.message || "Internal Server Error",
    });
};

module.exports = errorMiddleware;
