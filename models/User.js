const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    nickname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    participatedEvents: [{ type: Schema.Types.ObjectId, ref: 'event' }],
    likedComments: [{ type: Schema.Types.ObjectId, ref: 'comment'}]
});

mongoose.model('user', userSchema);