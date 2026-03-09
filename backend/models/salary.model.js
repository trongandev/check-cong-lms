const mongoose = require('mongoose')

const SalaryDataSchema = new mongoose.Schema({
    'Centre shortname': {
        type: String,
    },
    Type: {
        type: String,
    },
    'Class name': {
        type: String,
    },
    'Class role/Office hour type': {
        type: String,
    },
    Status: {
        type: String,
    },
    'Slot time': {
        type: String,
    },
    'Slot duration': {
        type: String,
    },
    'Student count': {
        type: Number,
    },
    salary: {
        type: String,
    },
    rank: {
        type: String,
    },
})
const SalarySchema = new mongoose.Schema(
    {
        username: String,
        dateTimeKey: String, // Format: 'MM/YYYY' for ex: '09/2023'
        totalCheck: Number,
        totalUncheck: Number,
        totalTime: Number,
        data: [SalaryDataSchema],
    },
    { timestamps: true },
)

module.exports = { SalaryModel: mongoose.model('SalaryModel', SalarySchema), SalaryDataSchema: mongoose.model('SalaryDataSchema', SalaryDataSchema) }
