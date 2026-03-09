const SuccessResponse = require('../core/success')
const catchAsync = require('../middlewares/catchAsync')
const officehoursService = require('../services/officehours.service')

class OfficeHoursController {
    getAll = catchAsync(async (req, res, next) => {
        const result = await officehoursService.getOfficeHours(req)

        return SuccessResponse.ok(res, 'Lấy thông tin giờ làm việc thành công', result)
    })

    getByUsername = catchAsync(async (req, res, next) => {
        const result = await officehoursService.getOfficeHoursByUsername(req)

        return SuccessResponse.ok(res, 'Lấy thông tin giờ làm việc theo username thành công', result)
    })

    create = catchAsync(async (req, res, next) => {
        const result = await officehoursService.create(req.body)

        return SuccessResponse.ok(res, 'Tạo giờ làm việc thành công', result)
    })

    delete = catchAsync(async (req, res, next) => {
        const result = await officehoursService.delete(req.params.id)

        return SuccessResponse.ok(res, 'Xóa giờ làm việc thành công', result)
    })
}

module.exports = new OfficeHoursController()
