const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const requireLogin = require('../middlewares/requireLogin');
const User = mongoose.model('user');

module.exports = app => { //module.exports to stary syntax na export
    // app.post('/api/login',
    //     passport.authenticate('local'),
    //     (req, res) => {
    //         res.send({ redirect: '/dashboard' });
    //     }
    // );

    app.post('/api/login', 
        passport.authenticate('local', { failureRedirect: '/api/login_failed' }),
        (req, res) => {
            res.send(req.user);
    });

    app.get('/api/login_failed', (req, res) => {
        res.send({});
    });

    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });

    app.get('/api/logout', (req, res) => {
        req.logout();
        res.send('User logged out');
    });

    app.post('/api/change_nickname', requireLogin, async (req, res) => {
        try {
            await User.updateOne(
                { _id: req.user._id },
                { nickname: req.body.newNickname }
            ).exec();

            res.send({});
        } catch (err) {
            res.send(err);
        }
    });

    app.post('/api/change_email', requireLogin, async (req, res) => {
        try {
            const existingUser = await User.findOne({ email: req.body.newEmail });
            if (existingUser) {
                res.send({ error: 'Account with given email already exists'});
                return;
            }

            await User.updateOne(
                { _id: req.user._id },
                { email: req.body.newEmail }
            ).exec();
            
            res.send({});
        } catch (err) {
            res.send(err);
        }
    });

    app.post('/api/change_password', requireLogin, async (req, res) => {
        try {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.newPassword, salt, async (err, hash) => {
                    if (err) throw err;
    
                    await User.updateOne(
                        { _id: req.user._id },
                        { password: hash }
                    ).exec();

                    res.send({});
                })
            })
        } catch (err) {
            res.send(err);
        }
    })

    //Register
    app.post('/api/register', async ({ body: { nickname, email, password }}, res) => {
        console.log(email);
        const existingUser = await User.findOne({ email: email });
        const userWithSameNickname = await User.findOne({ nickname: nickname });

        if (existingUser) {
            res.send({ 
                error: true,
                message: 'Account with given email already exists' 
            });
            return;
        }

        if (userWithSameNickname) {
            res.send({
                error: true,
                message: 'Nickname already in use'
            })
        }

        const newUser = new User({
            nickname,
            email,
            password
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, async (err, hash) => {
                if (err) throw err;

                newUser.password = hash;
                await newUser.save();
                res.send({ 
                    error: false, 
                    message: 'Account created - you can now login' 
                });
            })
        })
    });
}