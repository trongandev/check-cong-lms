const SuccessResponse = require('../core/success')
const ErrorResponse = require('../core/error')
const catchAsync = require('../middlewares/catchAsync')
const configService = require('../services/config.service')

class ConfigController {
    getConfigDefault = catchAsync(async (req, res, next) => {
        // Call service to get default config
        const result = await configService.getConfigDefault()
        return SuccessResponse.ok(res, 'Lấy cấu hình mặc định thành công', result)
    })

    createConfigDefault = catchAsync(async (req, res, next) => {
        // Call service to create default config if not exists
        const result = await configService.createConfigDefault()
        return SuccessResponse.ok(res, 'Tạo cấu hình mặc định thành công', result)
    })

    updateLinkSheet = catchAsync(async (req, res, next) => {
        const result = await configService.updateLinkSheet(req.body)
        return SuccessResponse.ok(res, 'Cập nhật link sheet thành công', result)
    })

    deleteLinkSheet = catchAsync(async (req, res, next) => {
        const result = await configService.deleteLinkSheet(req)
        return SuccessResponse.ok(res, 'Xóa link sheet thành công', result)
    })

    reorderConfig = catchAsync(async (req, res, next) => {
        const result = await configService.reorderConfig(req)
        return SuccessResponse.ok(res, 'Sắp xếp lại cấu hình thành công', result)
    })
}

module.exports = new ConfigController()
