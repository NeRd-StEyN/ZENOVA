// models/Chat.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    title:{type:String , required:true},
    timestamp: { type: Date, default: Date.now },
    id:{
        type:String,required:true}// Reference to user
});

const History = mongoose.model('History', chatSchema);

module.exports = History;
