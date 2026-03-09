const { SalaryModel } = require('../models/salary.model')
const { UserModel } = require('../models/user.model')
const configService = require('./config.service')
const axios = require('axios')
const Papa = require('papaparse')
const officehoursService = require('./officehours.service')
const { OfficeHoursModel } = require('../models/officehours.model')
class SalaryService {
    async getSalaryByUsername(req) {
        const { date } = req.query
        const { email } = req.user
        const finalUsername = email.split('@')[0]
        const config = await configService.getConfigDefault()
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
