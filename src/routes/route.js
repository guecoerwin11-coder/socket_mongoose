const express = require('express');
const router = express.Router()
const {register, login, getUser} = require('../controller/authController')
const {getUnreadCounts, getMessage} = require('../controller/convoController')
const protect = require('../middleware/protect')


//auth controller router
router.post('/register', register)
router.post('/login', login)
router.get('/users', protect, getUser)


//message of user controller
router.get('/message/:recipientId', protect, getMessage)
router.get('/unread', protect, getUnreadCounts)

module.exports = router