import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';

import User from '../modules/users/user.model';
import constants from '../config/constants';

// Local strategy
const localOpts = {
    usernameField: 'phone',
    passwordField: 'password'
};

const localStrategy = new LocalStrategy(
    localOpts,
    async (phone, password, done) => {
        try {
            const user = await User.findOne({ phone });
            if (!user) {
                return done(null, false);
            } else if (!user.authenticateUser(password)) {
                return done(null, false);
            }
            return done(null, user);
        } catch (e) {
            return done(e, false);
        }
    },
);
// Jwt strategy
const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: constants.JWT_SECRET,
};

const jwtStrategy = new JWTStrategy(jwtOpts, async (payload, done) => {
    try {
        const user = await User.findById(payload._id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (e) {
        return done(e, false);
    }
});

passport.use(localStrategy);
passport.use(jwtStrategy);

export const authLocal = passport.authenticate('local', { session: false });
export const authJwt = passport.authenticate('jwt', { session: false });
