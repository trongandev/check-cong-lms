const mongoose = require('mongoose')

const DataSchema = new mongoose.Schema({
    'Centre shortname': String,
    Type: String,
    'Class name': String,
    Course: String,
    'Course Line': String,
    'Teacher name': String,
    'Work email': String,
    'Personal email': String,
    Username: String,
    'Class role/Office hour type': String,
    Status: String,
    'Effective duration': String,
    'Slot time': String,
    'Slot duration': String,
    'Student count': String,
    'Requested by': String,
    Note: String,
    'Manager Note': String,
    'Confirm Status (OH only)': String,
    'Confirm Note (OH only)': String,
    salary: Number,
    customRank: Number,
})

// đánh index = username
DataSchema.index({ Username: 1 })

const OfficeHoursSchema = new mongoose.Schema(
    {
        dateTimeKey: String, // Format: 'MM/YYYY' for ex: '09/2023'
        data: [DataSchema],
    },
    { timestamps: true },
)

const OfficeHoursModel = mongoose.model('OfficeHoursModel', OfficeHoursSchema)
module.exports = { OfficeHoursModel }
