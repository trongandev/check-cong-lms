const { ConfigModel } = require('../models/config.model')
const officehoursService = require('./officehours.service')

class ConfigService {
    async getConfigDefault() {
        const findConfig = await ConfigModel.findOne({ version: 'default' }).lean()
        return findConfig
    }

    // hàm này sẽ tự động seeder khi npm run dev server
    async createConfigDefault() {
        const existingConfig = await ConfigModel.findOne({ version: 'default' })
        if (existingConfig) {
            console.log('Config ["Default"] is exitsing')
            return existingConfig
        }
        const newConfig = new ConfigModel({
            version: 'default',
            linkSheet: [],
            posLinkSheetToSplit: 6,
            paramEndLinkSheet: 'gviz/tq?tqx=out:csv&gid=0',
        })
        console.log('Create config default success')
        await newConfig.save()
        return newConfig
    }

    async updateLinkSheet(dataLink) {
        const config = await this.getConfigDefault()
        if (!config) {
            throw new Error('Default config not found')
        }
        if (config.linkSheet.some((link) => link.month == dataLink.month)) {
            config.linkSheet = config.linkSheet.map((link) => (link.month == dataLink.month ? dataLink : link))
            await ConfigModel.updateOne({ version: 'default' }, { linkSheet: config.linkSheet })
            return config
        }
        config.linkSheet.push(dataLink)
        await ConfigModel.updateOne({ version: 'default' }, { linkSheet: config.linkSheet })
        await officehoursService.create(dataLink, config)
        return config
    }

    async deleteLinkSheet(req) {
        const { _id } = req.params
        const config = await this.getConfigDefault()
        if (!config) {
            throw new Error('Default config not found')
        }
        config.linkSheet = config.linkSheet.filter((link) => link._id != _id)
        await ConfigModel.updateOne({ version: 'default' }, { linkSheet: config.linkSheet })
        return config
    }
}

module.exports = new ConfigService()
