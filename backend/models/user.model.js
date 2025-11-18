const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        displayName: {
            type: String,
            required: true,
            trim: true,
            min: 3,
            max: 20,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        rankSalary: {
            type: String,
            default: 'T3',
        },
        password: {
            type: String,
            min: 6,
            max: 150,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    { timestamps: true }
)

module.exports = { UserModel: mongoose.model('UserModel', UserSchema) }
