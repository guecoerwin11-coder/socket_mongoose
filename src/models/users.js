const { truncates } = require('bcryptjs')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true, lowercase: truncates},
    password: {type: String, required: true, min: 6},
    isOnline: {type: Boolean, default: false},
    lastSeen: {type: Date, default: Date.now}
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema);

module.exports = User