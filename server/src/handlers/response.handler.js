const responseWithData = (res, statusCode, data) => {
    res.status(statusCode).json(data)
}

const error = (res, message) =>
    responseWithData(res, 500, {
        statusCode: 500,
        message,
    })

const badrequest = (res, message) =>
    responseWithData(res, 400, {
        statusCode: 400,
        message,
    })
const toomanyrequests = (res, message, nextValidRequestTime) =>
    responseWithData(res, 429, {
        statusCode: 429,
        message,
        nextValidRequestTime,
    })

const ok = (res, data, message) => responseWithData(res, 200, data)

const created = (res, data, message) => responseWithData(res, 201, data, message)

const unauthorize = (res, message) =>
    responseWithData(res, 401, {
        statusCode: 401,
        message,
    })

const notfound = (res, message) =>
    responseWithData(res, 404, {
        statusCode: 404,
        message,
    })

const forbidden = (res, message) => {
    responseWithData(res, 403, {
        statusCode: 403,
        message,
    })
}

const nocontent = (res, message) => {
    responseWithData(res, 204, {
        statusCode: 204,
        message,
    })
}

export default {
    ok,
    created,
    notfound,
    badrequest,
    error,
    unauthorize,
    forbidden,
    nocontent,
    toomanyrequests,
}
