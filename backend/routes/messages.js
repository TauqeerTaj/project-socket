const express = require('express')
const router = express.Router()

const messagesController = require('../controllers/messages')

router.post('/saveMessage', messagesController.messages)
router.get('/getMessages/:sender/:chatUser', messagesController.getMessages)


module.exports = router