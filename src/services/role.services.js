import HTTPStatus from 'http-status';

export function roleAdmin(req, res, next) {
    if (req.user.role != 1) {
        return res.sendStatus(HTTPStatus.FORBIDDEN);
    }
    return next();
}

export function roleUser(req, res, next) {
    if (req.user.role != 1 && req.user.role != 2) {
        return res.sendStatus(HTTPStatus.FORBIDDEN);
    }
    return next();
}