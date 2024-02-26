const Messages = require("../models/messages");

//Save Messages
exports.messages = async (req, res, next) => {
    console.log('body check:', req.body)
    try {
        await req.body.forEach(item => {
            let messagesData = new Messages({id: item.id ?? item.category.sender_id, message: item.text ?? item.topic});
            messagesData.save();
        })
        res.status(201).send({ message: "Messages saved successfully" });
        return;
    } catch (err) {
        res.status(500).send({ err: err });
    }
};