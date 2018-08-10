import HTTPStatus from 'http-status';

export function roleAdmin(req, res, next) {
    if (req.user.role != "admin") {
        return res.sendStatus(HTTPStatus.FORBIDDEN);
    }
    return next();
}

export function roleUser(req, res, next) {
    if (req.user.role != "user" && req.user.role != "admin") {
        return res.sendStatus(HTTPStatus.FORBIDDEN);
    }
    return next();
}