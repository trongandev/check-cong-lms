const axios = require('axios')
const Papa = require('papaparse')
const { OfficeHoursModel } = require('../models/officehours.model')
const configService = require('./config.service')
const { ConfigModel } = require('../models/config.model')
const { getTotalSalary } = require('../utils/utils')
const { SalaryModel } = require('../models/salary.model')
class OfficeHoursService {
    async getOfficeHours(req) {
        const { date } = req.query

        const matchDate = {}
        if (date) {
            matchDate.dateTimeKey = date
        } else {
            const config = await ConfigModel.findOne({ version: 'default' }).lean()
            matchDate.dateTimeKey = config.linkSheet.find((item) => item.index === 0).month
        }

        const result = await OfficeHoursModel.find(matchDate).lean()
        return {
            data: result[0].data,
            dateTimeKey: matchDate.dateTimeKey,
        }
    }

    async getOfficeHoursByUsername(req) {
        const { username, date } = req.query

        const config = await ConfigModel.findOne({ version: 'default' }).lean()
        let currentConfig = null
        if (date) {
            currentConfig = config.linkSheet.find((item) => item.month === date)
        } else {
            currentConfig = config.linkSheet.find((item) => item.index === 0)
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
                            cond: { $eq: ['$$item.Username', username] },
                        },
                    },
                },
            },
        ])
        if (findOfficeHours[0]) {
            const isExisting = await SalaryModel.findOne({ username: username, dateTimeKey: currentConfig.month })
            if (!isExisting) {
                // Handle the case where the salary record does not exist
                // You can add logic here to create a new salary record if needed
                const getTotal = findOfficeHours[0].data.map((item) => {
                    // default rank T3: 120k VND
                    const total = getTotalSalary(item, 120)
                    return {
                        ...item,
                        salary: total,
                    }
                })
                const totalSalary = getTotal.reduce((acc, item) => acc + (item.salary || 0), 0)
                const totalTime = getTotal.reduce((acc, item) => acc + (Number(item['Slot duration']) || 0), 0)
                const totalCong = getTotal.length
                const totalCheck = getTotal.reduce((acc, item) => acc + (item.Status === 'CHECKED' ? 1 : 0), 0)
                const totalUncheck = getTotal.reduce((acc, item) => acc + (item.Status !== 'CHECKED' ? 1 : 0), 0)

                const newSalary = new SalaryModel({
                    data: findOfficeHours[0].data,
                    username: username,
                    dateTimeKey: currentConfig.month,
                    totalSalary: totalSalary,
                    totalTime: totalTime,
                    totalCong: totalCong,
                    totalCheck: totalCheck,
                    totalUncheck: totalUncheck,
                })
                await newSalary.save()
            }
        }
        return findOfficeHours[0]
    }

    async create(dataLink, config) {
        const findOH = await OfficeHoursModel.findOne({ dateTimeKey: dataLink.month })
        if (findOH) {
            throw new Error('Office hours for this month already exist')
        }
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
