import mongoose from 'mongoose';
import constants from './constants';
import Fawn from 'fawn';

mongoose.Promise = global.Promise;

try {
    mongoose.connect(constants.MONGO_URL, { useNewUrlParser: true });
} catch (e) {
    mongoose.createConnection(constants.MONGO_URL, { useNewUrlParser: true });
}

mongoose.connection
    .once('open', () => {
        Fawn.init(mongoose);
        console.log('   MongoDB running')
    })
    .on('error', e => {
        throw e;
    });