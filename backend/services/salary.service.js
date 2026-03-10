const { SalaryModel } = require('../models/salary.model')
const { UserModel } = require('../models/user.model')
const configService = require('./config.service')
const axios = require('axios')
const Papa = require('papaparse')
const officehoursService = require('./officehours.service')
const { OfficeHoursModel } = require('../models/officehours.model')
const { getTotalSalary } = require('../utils/utils')
class SalaryService {
    async getAllSalary() {
        const result = await SalaryModel.find().sort({ createdAt: -1 })
        return result
    }

    async getSalaryByUsername(req) {
        const { date } = req.query
        const { email } = req.user
        const finalUsername = email.split('@')[0]
        const config = await configService.getConfigDefault()
        let currentConfig = null
        if (date) {
            currentConfig = config.linkSheet.find((item) => item.month === date)
        } else {
            currentConfig = config.linkSheet.find((item) => item.index === config.linkSheet.length - 1)
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
        if (findOfficeHours[0]) {
            const isExisting = await SalaryModel.findOne({ username: finalUsername, dateTimeKey: currentConfig.month })
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
                    username: finalUsername,
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

    async updateProfile(req) {
        const userId = req.user.id
        const { displayName } = req.body
        const profile = await UserModel.findById(userId)
        if (!profile) {
            throw new ErrorResponse('Không tìm thấy người dùng', 404)
        }
        // Cập nhật các trường
        if (displayName !== undefined) profile.displayName = displayName
        await profile.save()
        delete profile.password
        return profile
    }
}

module.exports = new SalaryService()
