require('dotenv').config()

module.exports={
    development: {
        username: 'root',
        password: process.env.SEQUELIZE_PASSWORD,
        database: 'express_socket',
        host: '127.0.0.1',
        dailect: 'mysql',
        operatorAliases: false,
    },
    production : {
        username: 'root',
        password: process.env.SEQUELIZE_PASSWORD,
        database: 'express_socket',
        host: '127.0.0.1',
        dailect: 'mysql',
        operatorAliases: false,
        logging: false
    }
}