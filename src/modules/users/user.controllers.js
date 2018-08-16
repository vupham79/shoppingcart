import HTTPStatus from 'http-status';

import User from './user.model';

export async function getUserList(req, res) {
    try {
        const users = await User.find()
            .sort({ fullname: 1 });
        return res.status(HTTPStatus.OK).json({ users });
    } catch (e) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}

export async function getUser(req, res) {
    try {
        if (req.user.role == "admin") {
            const user = await User.find({ isRemoved: false, phone: req.params.id });
            return res.status(HTTPStatus.OK).json(user);
        }
        const user = await User.find({ isRemoved: false, phone: req.user.phone });
        return res.status(HTTPStatus.OK).json(user);
    } catch (e) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}

export async function updateUser(req, res) {
    try {
        if (req.user.phone != req.params.id) {
            return res.sendStatus(HTTPStatus.FORBIDDEN);
        }
        const userUpdated = await User.findOne({ isRemoved: false, phone: req.params.id });
        userUpdated.name = req.body.name;
        userUpdated.password = req.body.password;
        userUpdated.address = req.body.address;
        userUpdated.save();
        return res.status(HTTPStatus.OK).json(userUpdated);
    } catch (e) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}

export async function editUser(req, res) {
    try {
        const userUpdated = await User.findOne({ isRemoved: false, phone: req.params.id });
        userUpdated.name = req.body.name;
        userUpdated.password = req.body.password;
        userUpdated.address = req.body.address;
        userUpdated.role = req.body.role;
        userUpdated.save();
        return res.status(HTTPStatus.OK).json(userUpdated);
    } catch (e) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}

export async function createUser(req, res) {
    try {
        const user = await User.create(req.body);
        return res.status(HTTPStatus.CREATED).json(user);
    } catch (e) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}

export async function registerUser(req, res) {
    try {
        const user = {
            phone: req.body.phone,
            password: req.body.password,
            name: req.body.name,
            address: req.body.address
        }
        return res.status(HTTPStatus.CREATED).json(await User.create(user));
    } catch (e) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}

export async function deleteUser(req, res) {
    try {
        const user = await User.findOne({ isRemoved: false, phone: req.params.id });
        user.isRemoved = true;
        user.save();
        return res.status(HTTPStatus.OK).json({ user });
    } catch (e) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}

export function authUser(req, res) {
    try {
        return res.status(HTTPStatus.OK).json(req.user.toAuthJSON());
    } catch (e) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}