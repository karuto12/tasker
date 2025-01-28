const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/taskers`);

const userSchema = mongoose.Schema(
    {
        name: String,
        uname: String,
        tasks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'task',
        }],
        password: String,
        image: String,
    }
);

const user = mongoose.model('user', userSchema);
module.exports = user;