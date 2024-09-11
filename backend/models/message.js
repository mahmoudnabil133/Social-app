const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    from:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message:{
        type: String,
        required: [true, 'please send a message']
    },
    timeStamps:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema);