const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    name:{
        type:String,required:true},
        email:{
            type:String,required:true},
            feedback:{
                type:String,required:true}
            
        
    
});

const feed = mongoose.model('Feedback', Schema);

module.exports = feed;
