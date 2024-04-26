const Messages = require("../models/messages");

//Save Messages
exports.messages = async (req, res, next) => {
    console.log('body check:', req.body)
    try {
        await req.body.forEach(item => {
            Messages.find({"id": item.id ?? item.category.sender_id, "message" : item.text ?? item.topic})
            .then(data => {
                if(data.length < 1){
                    let messagesData = new Messages({id: item.id ?? item.category.sender_id, receiver_id: item.receiver, message: item.text ?? item.topic, date: item.date});
                    messagesData.save();
                }
            })
            .catch(err => console.log(err))
            
        })
        res.status(201).send({ message: "Messages saved successfully" });
        return;
    } catch (err) {
        res.status(500).send({ err: err });
    }
};

//GET Messages
exports.getMessages = async (req, res, next) => {
    try {
        Messages.find({
          $and: [
              { $or: [ { id: req.params.sender }, { receiver_id : req.params.sender } ] },
              { $or: [ { id: req.params.chatUser }, { receiver_id : req.params.chatUser } ] }
          ]
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