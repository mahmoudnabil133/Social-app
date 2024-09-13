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

messageSchema.index({from: 1, to: 1});
messageSchema.index({timeStamps: 1});
module.exports = mongoose.model('Message', messageSchema);