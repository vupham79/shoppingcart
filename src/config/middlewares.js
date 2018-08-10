import bodyParser from 'body-parser';
import passport from 'passport';

import constants from './constants';

export default app => {
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(passport.initialize());
}