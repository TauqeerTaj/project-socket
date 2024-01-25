// const socketIO = require('../socket')
const StudentData = require("../models/studentData");
const User = require("../models/user");

//Students Project Data
exports.studentData = async (req, res, next) => {
  try {
    let findProject = await StudentData.findOne({
      projectName: req.body.topic,
    });
    if (findProject) {
      res.status(409).send({ message: "Project already proposed" });
      return;
    } else {
      const projectData = new StudentData({
        projectName: req.body.topic,
        projectDescription: req.body.description,
        category: req.body.category,
        file: req.body.file,
        approved: false,
      });
      await projectData.save();
      // socketIO.getIO().emit('project', { projectData: projectData })
      res.status(201).send({ message: "Project sent successfully" });
    }
    return;
  } catch (err) {
    res.status(500).send({ err: err });
  }
};
//GET Projects
exports.projects = async (req, res, next) => {
  try {
    StudentData.find()
      .then((data) => {
        res.status(200).send({ list: data });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  } catch (err) {
    res.status(500).send({ err: err });
  }
};
//GET User Projects
exports.projects = async (req, res, next) => {
  try {
    StudentData.find({
      "category.id": req.query.id,
      approved: false,
    })
      .then((data) => {
        res.status(200).send({ list: data });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  } catch (err) {
    res.status(500).send({ err: err });
  }
};
//GET Approved Projects
exports.approvedProjects = async (req, res, next) => {
  try {
    StudentData.find({
      approved: true,
    })
      .then((data) => {
        res.status(200).send({ list: data });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  } catch (err) {
    res.status(500).send({ err: err });
  }
};
//Approve Project
exports.approve = (req, res, next) => {
  try {
    StudentData.findOneAndUpdate(
      { _id: req.query.approvedId },
      { $set: { approved: true } }
    )
      .then((data) => {
        res.status(201).send({ message: "Project has been approved!", data });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  } catch (err) {
    res.status(500).send({ err: err });
  }
};
//Delete Project
exports.delete = (req, res, next) => {
  try {
    StudentData.findOneAndDelete({ _id: req.query.deletedId })
      .then((data) => {
        res.status(204).send({ message: "Project has been rejected!", data });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  } catch (err) {
    res.status(500).send({ err: err });
  }
};
//Search Category
exports.category = async (req, res, next) => {
  try {
    const keyword = req.query.name
      ? {
          $or: [
            { firstName: { $regex: req.query.name, $options: "i" } },
            { lastName: { $regex: req.query.name, $options: "i" } },
          ],
        }
      : {};
    const users = await User.find(keyword);
    res.send(users);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
