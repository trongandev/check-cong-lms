const configService = require('../services/config.service')

const createConfigDefault = async () => {
    await configService.createConfigDefault()
}
const DatabaseSeeder = async () => {
    await createConfigDefault()
}

module.exports = DatabaseSeeder
