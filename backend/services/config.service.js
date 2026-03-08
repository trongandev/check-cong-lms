const { ConfigModel } = require('../models/config.model')

class ConfigService {
    async getConfigDefault() {
        const findConfig = await ConfigModel.findOne({ version: 'default' }).lean()
        return findConfig
    }

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
        if (config.linkSheet.some((link) => link._id == dataLink._id)) {
            config.linkSheet = config.linkSheet.map((link) => (link._id == dataLink._id ? dataLink : link))
            await ConfigModel.updateOne({ version: 'default' }, { linkSheet: config.linkSheet })
            return config
        }
        config.linkSheet.push(dataLink)
        await ConfigModel.updateOne({ version: 'default' }, { linkSheet: config.linkSheet })
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
