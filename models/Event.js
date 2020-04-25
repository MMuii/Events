const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CommentSchema = require('./Comment');

const eventSchema = new Schema({
    title: String,
    shortDescription: String,
    content: String,
    participants: { type: Number, default: 0 },
    comments: [CommentSchema],
    _user: { type: Schema.Types.ObjectId, ref: 'user' },
    organizerNickname: String,
    isPublic: Boolean,
    eventDate: Date,
    dateCreated: Date,
    inviteID: String,
    urlID: String
});

mongoose.model('event', eventSchema);
// const User = mongoose.model();