import bodyParser from 'body-parser';
import passport from 'passport';
import morgan from 'morgan';
export default app => {
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(morgan('dev'));
    app.use(passport.initialize());
}