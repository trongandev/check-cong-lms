const mongoose = require('mongoose')

const LinkSheetSchema = new mongoose.Schema(
    {
        month: String,
        link: String,
    },
    { timestamps: true }
)

const ConfigSchema = new mongoose.Schema(
    {
        version: String,
        linkSheet: [LinkSheetSchema],
        posLinkSheetToSplit: Number,
        paramEndLinkSheet: String,
    },
    { timestamps: true }
)

module.exports = { ConfigModel: mongoose.model('ConfigModel', ConfigSchema) }
