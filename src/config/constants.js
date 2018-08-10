const devConfig = {
    MONGO_URL: 'mongodb://localhost:27017/my-app',
    JWT_SECRET: 'secret',
}

function envConfig(env) {
    switch (env) {
        case 'dev': return devConfig;
        default: return devConfig;
    }
}

export default {
    ...envConfig(process.env.NODE_ENV),
}