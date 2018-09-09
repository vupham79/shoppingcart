import mongoose from 'mongoose';
import constants from './constants';
import Fawn from 'fawn';

mongoose.Promise = global.Promise;

try {
    mongoose.connect(constants.MONGO_URL, { useNewUrlParser: true });
    Fawn.init(mongoose);
} catch (e) {
    mongoose.createConnection(constants.MONGO_URL, { useNewUrlParser: true });
    Fawn.init(mongoose);
}

mongoose.connection
    .once('open', () => console.log('   MongoDB running'))
    .on('error', e => {
        throw e;
    });