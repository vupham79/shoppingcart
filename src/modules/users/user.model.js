import mongoose from 'mongoose';
import { compareSync, hashSync } from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import constants from './../../config/constants';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 30,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    phone: {
        type: String,
        minlength: 6,
        maxlength: 16,
        required: true,
        unique: true,
    },
    address: {
        type: String,
    },
    isRemoved: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

UserSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = this.hashPassword(this.password);
    }
    return next();
});

UserSchema.methods = {
    hashPassword(password) {
        return hashSync(password);
    },
    authenticateUser(password) {
        return compareSync(password, this.password);
    },
    createToken() {
        return jwt.sign({
            _id: this._id,
        },
        constants.JWT_SECRET,
        );
    },
    toJSON() {
        return {
            _id: this._id,
            name: this.name,
            role: this.role,
            phone: this.phone,
            address: this.address,
            isRemoved: this.isRemoved,
            createdAt: this.createdAt
        }
    },
    toAuthJSON() {
        return {
            ...this.toJSON(),
            token: `JWT ${this.createToken()}`,
        };
    },
};

export default mongoose.model('User', UserSchema);