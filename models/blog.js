const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const blogModel = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    state: {
        type: String,
        enum: ["draft", "published"]
    },
    read_count: Number,
    reading_time: String,
    tags: String,
    body: {
        type: String, 
        required: true
    },
    timestamp: String,
    user: 
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user'
        }
      
});

module.exports = mongoose.model("blog", blogModel)