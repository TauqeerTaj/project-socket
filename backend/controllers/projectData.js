// const socketIO = require('../socket')
const StudentData = require('../models/studentData')
const User = require('../models/user')

//Students Project Data
exports.studentData = async (req, res, next) => {
    try {
        const projectData = new StudentData({
            projectName: req.body.topic,
            projectDescription: req.body.description,
            category: req.body.category,
            approved: false
        })
        await projectData.save()
        // socketIO.getIO().emit('project', { projectData: projectData })
        res.status(201).send({ message: 'Project send successfully' })
        return
    }
    catch (err) {
        res.status(500).send({ err: err })
    }


}
//GET Projects
exports.projects = async (req, res, next) => {
    try {
        StudentData.find()
            .then(data => {
                res.status(200).send({ list: data })
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500
                }
                next(err)
            })
    }
    catch (err) {
        res.status(500).send({ err: err })
    }
}
//GET User Projects
exports.projects = async (req, res, next) => {
    try {
        StudentData.find({
            'category.id': req.query.id,
            'approved': false
        })
            .then(data => {
                res.status(200).send({ list: data })
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500
                }
                next(err)
            })
    }
    catch (err) {
        res.status(500).send({ err: err })
    }
}
//GET Approved Projects
exports.approvedProjects = async (req, res, next) => {
    try {
        StudentData.find({
            'approved': true
        })
            .then(data => {
                res.status(200).send({ list: data })
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500
                }
                next(err)
            })
    }
    catch (err) {
        res.status(500).send({ err: err })
    }
}
//Approve Project
exports.approve = async (req, res, next) => {
    try {
        StudentData.findOneAndUpdate(
            {_id: req.query.approvedId},
	        { $set: { 'approved': true }}
          )
            .then(data => {
                res.status(201).send({ message: 'Project has been approved!' })
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500
                }
                next(err)
            })
    }
    catch (err) {
        res.status(500).send({ err: err })
    }
}
//Delete Project
exports.delete = async (req, res, next) => {
    try {
        await StudentData.deleteOne(
            {_id: req.query.deletedId}
          )
            .then(data => {
                res.status(204).send({ message: 'Project has been rejected!' })
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500
                }
                next(err)
            })
    }
    catch (err) {
        res.status(500).send({ err: err })
    }
}
//Search Category
exports.category = async (req, res, next) => {
    try {
        const keyword = req.query.name
            ? {
                $or: [
                    { firstName: { $regex: req.query.name, $options: 'i' } },
                    { lastName: { $regex: req.query.name, $options: 'i' } }
                ]
            } : {}
            const users = (await User.find(keyword))
    res.send(users)
    }
    catch (err) {
        console.log(err)
        res.send(err)
    }
}