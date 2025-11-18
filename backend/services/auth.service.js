const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const { UserModel } = require('../models/user.model')
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken')

const generateToken = (user, message) => {
    const accessToken = generateAccessToken(user._id, user.role)
    const refreshToken = generateRefreshToken(user._id)
    // Loại bỏ password khỏi response
    const userResponse = user.toObject()
    delete userResponse.password

    return {
        user: userResponse,
        message,
        accessToken,
        refreshToken,
    }
}
class AuthService {
    // Đăng nhập người dùng
    async loginUser(req) {
        const { email, password } = req.body
        // Tìm user theo email
        //check trên hệ thống mindx
        const api = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAh2Au-mk5ci-hN83RUBqj1fsAmCMdvJx4`
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
        const data = await response.json()
        if (data.error && data.error.code === 400 && data.error.message === 'EMAIL_NOT_FOUND') {
            throw new Error('Email không tồn tại')
        } else if (data.error && data.error.code === 400 && data.error.message === 'INVALID_PASSWORD') {
            throw new Error('Mật khẩu không đúng')
        } else {
            // Kiểm tra username đã tồn tại
            const username = data.email.split('@')[0]
            const existingUser = await UserModel.findOne({ username: username })
            const existingEmailUser = await UserModel.findOne({ email: data.email })
            if (existingUser) {
                return generateToken(existingUser, 'Login successful')
            } else if (existingEmailUser) {
                // Kiểm tra email đã tồn tại
                return generateToken(existingEmailUser, 'Login successful')
            } else {
                // Hash password
                const saltRounds = 10
                const hashedPassword = await bcrypt.hash(password, saltRounds)

                // Tạo user mới
                const newUser = new UserModel({
                    displayName: data.displayName,
                    username: username,
                    email: data.email,
                    password: hashedPassword,
                })
                const savedUser = await newUser.save()
                return generateToken(savedUser, 'Login successful')
            }
        }
    }
}

module.exports = new AuthService()
