const AuthService = require('../services/auth.service')
const SuccessResponse = require('../core/success')
const ErrorResponse = require('../core/error')
const catchAsync = require('../middlewares/catchAsync')

class AuthController {
    // [POST] /api/auth/login
    loginUser = catchAsync(async (req, res, next) => {
        const result = await AuthService.loginUser(req)

        return SuccessResponse.ok(res, result.message, {
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        })
    })
}

module.exports = new AuthController()
