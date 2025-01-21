const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userMessage: [{
        text: { type: String },   // Text message
        image: { type: String },  // Base64 encoded image data
    }],
    aiResponse: [{ type: String }],
    timestamp: { type: Date, default: Date.now },
    historyid: { type: String, required: true },
    id: { type: String, required: true },
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
