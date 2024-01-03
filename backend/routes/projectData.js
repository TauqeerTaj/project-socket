const express = require('express')
const router = express.Router()

const projectController = require('../controllers/projectData')

router.post('/studentData', projectController.studentData)
router.get('/projects', projectController.projects)
router.get('/category', projectController.category)


module.exports = router
