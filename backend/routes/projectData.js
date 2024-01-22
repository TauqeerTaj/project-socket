const express = require('express')
const router = express.Router()

const projectController = require('../controllers/projectData')

router.post('/studentData', projectController.studentData)
router.get('/projects', projectController.projects)
router.put('/approve', projectController.approve)
router.get('/category', projectController.category)
router.delete('/delete', projectController.delete)


module.exports = router
