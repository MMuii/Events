const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const _ = require('lodash');

const User = mongoose.model('user');
const Event = mongoose.model('event');
const Comment = mongoose.model('comment');

module.exports = app => {
    app.post('/api/fetch_event', async (req, res) => {
        const event = await Event.findOne({
            urlID: req.body.urlID
        })

        if (event === null) {
            res.send({ err: 'There\'s no such event!'});
        }
        
        res.send(event);
    });

    app.post('/api/fetch_event_invitation', async (req, res) => {
        const event = await Event.findOne({
            inviteID: req.body.inviteID
        });

        if (event === null) {
            res.send({ err: 'There\'s no such invitation!' });
        }
        res.send(event);
    });

    app.post('/api/create_event', requireLogin, async (req, res) => {
        const { title, shortDescription, content, date, isPublic, inviteID, urlID } = req.body;

        const event = new Event({
            title: title,
            shortDescription: shortDescription,
            content: content,
            _user: req.user._id,
            eventDate: date,
            organizerNickname: req.user.nickname,
            isPublic: isPublic,
            dateCreated: Date.now(),
            inviteID: inviteID,
            urlID: urlID
        });

        try {
            await event.save();
            res.send(event);
        } 
        catch (err) {
            res.status(422).send(err);
        }
    });

    app.get('/api/fetch_created_events', async (req, res) => {    
        const createdEvents = await Event.find({ _user: req.user._id }).sort({ dateCreated: 1 });
        
        if (createdEvents) {
            res.send(createdEvents);
        } else {
            res.send({});
        }
    });

    app.get('/api/fetch_user_related', requireLogin, async (req, res) => {
        try {
            const createdEvents = await Event.find({ _user: req.user._id });

            const participatedEventsIDs = req.user.participatedEvents.map(eventId => {
                return mongoose.Types.ObjectId(eventId);
            });
            
            const participatedEvents = await Event.find({
                '_id': { $in: participatedEventsIDs }
            });
    
            const relatedEvents = _.unionBy(createdEvents, participatedEvents, '_id');
    
            res.send(relatedEvents);
        } catch (err) {
            res.send(err);
        }
    });

    app.get('/api/hottest', async (req, res) => {        
        const hottestEvents = await Event.find({}).sort({ participants: -1 }).limit(5);
        res.send(hottestEvents);
    });

    app.get('/api/fetch_public', async (req, res) => {
        try {
            const publicEvents = await Event.find(
                { isPublic: true }
            ).sort(
                { participants: -1 }
            );

            res.send(publicEvents);
        } catch (err) {
            res.send(err);
        }
    });

    app.post('/api/participate_in_event', async (req, res) => { 
        try {
            await Event.updateOne({
                _id: req.body._id
            }, {
                $inc: { participants: 1 }
            }).exec();
    
            await User.updateOne({
                _id: req.user._id
            }, {
                $push: { participatedEvents: req.body._id }
            }).exec();
    
            res.send({});
        } catch (err) {
            res.status(422).send(err);
        }
    });

    app.post('/api/cancel_participation', async (req, res) => {
        try {
            await Event.updateOne({
                _id: req.body._id
            }, {
                $inc: { participants: -1 }
            }).exec();

            await User.updateOne({
                _id: req.user._id
            }, {
                $pull: { participatedEvents: req.body._id }
            }).exec();
    
            res.send({});
        } catch (err) {
            res.status(422).send(err);
        }
    });

    app.post('/api/delete_event', async (req, res) => {
        try {
            await Event.deleteOne({
                _id: req.body._id
            }).exec();

            await User.find({ participatedEvents: { $in: req.body._id } }, (err, users) => {
                users.forEach(user => {
                    _.remove(user.participatedEvents, (eventId) => {
                        return eventId == req.body._id;
                    });

                    user.markModified('participatedEvents');
                    user.save();

                    if (err) throw err;
                });
            });

            res.send({});
        } catch (err) {
            res.send(err);
        }
    });

    app.post('/api/comment_event', async (req, res) => {
        const { eventId, content, approved, nickname } = req.body;
        
        const comment = new Comment({
            _user: req.user._id,
            nickname: nickname,
            content: content,
            approved: approved,
            dateCreated: Date.now()
        });

        try {
            await Event.updateOne({
                _id: eventId
            }, {
                $push: { comments: comment }
            });

            res.send(comment);
        } catch (err) {
            res.send(err);
        }
    });

    app.post('/api/delete_comment', async (req, res) => {
        const objectId = mongoose.Types.ObjectId(req.body._id);
        try {
            await Event.updateOne(
                { _id: req.body.eventId, }, 
                { $pull: { comments: { _id: objectId }}}
            ).exec(); 

            res.send({});
        } catch (err) {
            res.send(err);
        }
    });

    app.post('/api/pin_comment', async (req, res) => {
        try {
            await Event.findOne({ _id: req.body.eventId}, (err, event) => {
                let comments = event.comments;
                for ( let i = 0; i < comments.length; i++ ) { 
                    if (comments[i]._id == req.body._id) {
                        comments[i].isPinned = true;
                        event.markModified('comments');
                        event.save();
                    } 
                } 
                
                if (err) throw err;
            });

            res.send({});
        } catch (err) {
            res.send(err);
        }
    });

    app.post('/api/unpin_comment', async (req, res) => {
        try {
            await Event.findOne({ _id: req.body.eventId}, (err, event) => {
                let comments = event.comments;
                for ( let i = 0; i < comments.length; i++ ) { 
                    if (comments[i]._id == req.body._id) {
                        comments[i].isPinned = false;
                        event.markModified('comments');
                        event.save();
                    } 
                } 
                
                if (err) throw err;
            });

            res.send({});
        } catch (err) {
            res.send(err);
        }
    });

    app.post('/api/like_comment', async (req, res) => {
        try {
            await Event.findOne({ _id: req.body.eventId }, (err, event) => {
                let comments = event.comments;
                for (let i = 0; i < comments.length; i++) {
                    if (comments[i]._id == req.body._id) {
                        comments[i].likes += 1;
                        event.markModified('comments');
                        event.save();
                    }
                }

                if (err) throw err;
            });

            await User.updateOne(
                { _id: req.user._id },
                { $push: { likedComments: req.body._id }}
            ).exec();

            res.send({});
        } catch (err) {
            res.send(err);
        }
    });

    app.post('/api/dislike_comment', async (req, res) => {
        try {
            await Event.findOne({ _id: req.body.eventId }, (err, event) => {
                let comments = event.comments;
                for (let i = 0; i < comments.length; i++) {
                    if (comments[i]._id == req.body._id) {
                        comments[i].likes -= 1;
                        event.markModified('comments');
                        event.save();
                    }
                }

                if (err) throw err;
            });

            await User.updateOne(
                { _id: req.user._id },
                { $pull: { likedComments: req.body._id }}
            ).exec();

            res.send({});
        } catch (err) {
            res.send(err);
        }
    });

    app.post('/api/approve_comment', async (req, res) => {
        try {
            await Event.findOne({ _id: req.body.eventId }, (err, event) => {
                let comments = event.comments;
                for (let i = 0; i < comments.length; i++) {
                    if (comments[i]._id == req.body._id) {
                        comments[i].approved = true;
                        event.markModified('comments');
                        event.save();
                    }
                }

                if (err) throw err;
            });

            res.send({});
        } catch (err) {
            res.send(err);
        }

        // try {
        //     await Event.findOne({ _id: req.body.eventId }, (err, event) => {
        //         let comments = event.comments;
        //         for (let i = 0; i < comments.length; i++) {
        //             if (comments[i]._id == req.body._id) {
        //                 comments[i].likes += 1;
        //                 event.markModified('comments');
        //                 event.save();
        //             }
        //         }

        //         if (err) throw err;
        //     });

        //     await User.updateOne(
        //         { _id: req.user._id },
        //         { $push: { likedComments: req.body._id }}
        //     ).exec();

        //     res.send({});
        // } catch (err) {
        //     res.send(err);
        // }
    }); 
}