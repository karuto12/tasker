const mongoose = require('mongoose');
const formatDate = require('../utils/formatDate');

mongoose.connect(`mongodb://127.0.0.1:27017/taskers`);

const tasksSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    title: String,
    content: String,
    date: {
        type: String,
        default: formatDate(new Date()),
    },
});

const task = mongoose.model('task', tasksSchema);

module.exports = task;