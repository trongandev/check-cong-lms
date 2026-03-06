const SuccessResponse = require('../core/success')
const catchAsync = require('../middlewares/catchAsync')
const salaryService = require('../services/salary.service')

class SalaryController {
    getSalary = catchAsync(async (req, res, next) => {
        const result = await salaryService.getSalaryByUsername(req)

        return SuccessResponse.ok(res, 'Lấy thông tin người dùng thành công', result)
    })
}

module.exports = new SalaryController()
