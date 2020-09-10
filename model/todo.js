const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let todoSchema = new Schema({
    task_name: {
        type: String
    },
    task_description: {
        type: String
    },
    creator: {
        type: String
    },
    duration: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'prac'
})

//todoSchema.index({username: 1 });

module.exports = mongoose.model('todoSchema', todoSchema);