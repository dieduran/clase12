const OPCION_DATOS =  'mongodb'

export default {
    OPCION_DATOS,
    fileSystem: {
        path: './DB'
    },
    mongodb: {
        uri: 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false',
        nombreDb: 'coderhouse',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            serverSelectionTimeoutMS: 5000
        }
    }
}
