const mongooose = require('mongoose')

const connectDB = () => {
    try{
        mongooose.connect(process.env.MONGODB_URI, {
            tls: true,
            tlsAllowInvalidCertificates: true,
            serverSelectionTimeoutMS: 1000
        })
        console.log('Mongo Db is connected')
    }catch{
        console.log('Mongo Db is got error', error)
    }
}

module.exports = connectDB;