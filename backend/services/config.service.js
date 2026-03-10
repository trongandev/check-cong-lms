const { ConfigModel } = require('../models/config.model')
const officehoursService = require('./officehours.service')

class ConfigService {
    async getConfigDefault() {
        const findConfig = await ConfigModel.findOne({ version: 'default' }).lean()
        if (findConfig) {
            findConfig.linkSheet = findConfig.linkSheet.sort((a, b) => a.index - b.index)
        }
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
        config.linkSheet.push({
            month: dataLink.month,
            link: dataLink.link,
            index: config.linkSheet.length,
        })
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

    async reorderConfig(req) {
        const { configOrder } = req.body //   Expecting: [{id: 'f1', index: 0}, {id: 'f2', index: 1}]

        const operations = configOrder.map((item) => ({
            updateOne: {
                filter: { version: 'default', 'linkSheet._id': item.id },
                update: { $set: { 'linkSheet.$.index': item.index } },
            },
        }))
        await ConfigModel.bulkWrite(operations)
    }
}

module.exports = new ConfigService()
