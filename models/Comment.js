const mongoose = require('mongoose');
// const { Schema } = mongoose;
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'user' },
    nickname: String,
    content: String,
    approved: Boolean,
    // replies: [this],
    likes: { type: Number, default: 0 },
    dateCreated: Date,
    isPinned: { type: Boolean, default: false }
})

mongoose.model('comment', commentSchema);
