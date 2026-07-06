const mongoose = require('mongoose')

const messageSchema  = new mongoose.Schema({
    //each conversatioin of the users
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
    },
    //each user who send a message
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    //the content of the message
    text: {type: String, required: true},
    //seen by the user
    isRead: {type: Boolean, default: null}
},  {timestamps: true})

const Message = mongoose.model('Message', messageSchema);

module.exports = Message