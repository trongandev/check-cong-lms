const axios = require('axios')
const Papa = require('papaparse')
const { OfficeHoursModel } = require('../models/officehours.model')
const configService = require('./config.service')
const { ConfigModel } = require('../models/config.model')
class OfficeHoursService {
    async getOfficeHours(req) {
        const { date } = req.query

        const matchDate = {}
        if (date) {
            matchDate.dateTimeKey = date
        } else {
            const config = await ConfigModel.findOne({ version: 'default' }).lean()
            matchDate.dateTimeKey = config.linkSheet[config.linkSheet.length - 1].month
        }

        const result = await OfficeHoursModel.find(matchDate).lean()
        return {
            data: result[0].data,
        }
    }

    async getOfficeHoursByUsername(req) {
        const { date } = req.query
        const { email } = req.user
        const finalUsername = email.split('@')[0]
        const config = await ConfigModel.findOne({ version: 'default' }).lean()
        let currentConfig = null
        if (date) {
            currentConfig = config.linkSheet.find((item) => item.month === date)
        } else {
            currentConfig = config.linkSheet[config.linkSheet.length - 1]
        }
        const findOfficeHours = await OfficeHoursModel.aggregate([
            { $match: { dateTimeKey: currentConfig.month } },
            {
                $project: {
                    dateTimeKey: 1,
                    data: {
                        $filter: {
                            input: '$data',
                            as: 'item',
                            cond: { $eq: ['$$item.Username', finalUsername] },
                        },
                    },
                },
            },
        ])
        return findOfficeHours[0]
    }

    async create(dataLink, config) {
        const splitLink = dataLink.link.split('/')
        splitLink[6] = config.paramEndLinkSheet
        const finalLink = splitLink.join('/')
        const response = await axios(finalLink)
        const csvData = response.data
        Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                if (results.errors.length > 0) {
                    console.warn('CSV parsing warnings:', results.errors)
                }
                const officeHours = new OfficeHoursModel({ dateTimeKey: dataLink.month, data: results.data })
                await officeHours.save()
                return true
            },
            transform: (value) => {
                return value.trim() // Clean up whitespace
            },
            error: (error) => {
                console.error('CSV parsing error:', error)
                throw new Error('Failed to create office hours')
            },
        })
    }

    async delete(id) {
        const officeHours = await OfficeHoursModel.findByIdAndDelete(id)
        return officeHours
    }
}

module.exports = new OfficeHoursService()
