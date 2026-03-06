const { SalaryModel } = require('../models/salary.model')
const { UserModel } = require('../models/user.model')
const configService = require('./config.service')
const axios = require('axios')
const Papa = require('papaparse')
class SalaryService {
    async getSalaryByUsername(req) {
        const { email } = req.user
        const finalUsername = email.split('@')[0]
        const config = await configService.getConfigDefault()
        const currentConfig = config.linkSheet[config.linkSheet.length - 1]
        const findSalary = await SalaryModel.findOne({ username: finalUsername, dateTimeKey: currentConfig.month }).lean()
        if (findSalary) {
            return findSalary
        }
        try {
            // Gửi yêu cầu đến URL
            const splitLink = currentConfig.link.split('/')
            splitLink[config.posLinkSheetToSplit] = config.paramEndLinkSheet
            const finalLink = splitLink.join('/')
            const response = await axios(finalLink)
            const csvData = response.data
            let data = []
            Papa.parse(csvData, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.errors.length > 0) {
                        console.warn('CSV parsing warnings:', results.errors)
                    }
                    data = results.data?.filter((item) => item.Username === finalUsername)
                },
                transform: (value) => {
                    return value.trim() // Clean up whitespace
                },
            })
            const newSalary = new SalaryModel({
                username: finalUsername,
                dateTimeKey: currentConfig.month,
                data: data,
            })
            await newSalary.save()
            return newSalary
        } catch (error) {
            console.error('Error fetching or parsing data:', error)
            throw new Error('Lỗi khi lấy dữ liệu bảng lương')
        }
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
