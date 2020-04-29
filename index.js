const http = require('http');
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const socketio = require('socket.io');

require('./models/User');
require('./models/Event');
require('./models/Comment');
require('./services/passport');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//bodyparser
app.use(bodyParser.json());

//express session
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey] //DO ZROBIENIA JEST COOKIE KEY DLA PRODUKCJI
    })
)

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Routes
require('./routes/authRoutes')(app);
require('./routes/eventRoutes')(app);

if (process.env.NODE_ENV === 'production') {
    //TUTAJ MA ZNACZENIE CO JEST PIERWSZE - najpierw sprawdza czy request chce np main.js albo main.css, jeśli nie, to odpalają sie kolejne linijki kodu i express zwraca index.html
    //Express will serve up production assets like main.js file or main.css file
    app.use(express.static('client/build'));

    //Express will serve up the index.html if it doesn't recognize the route -- jeśli express nie rozpoznaje routa to zwraca index.html
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
}

io.on('connection', socket => {
    console.log('socket connected!');

    socket.on('client-test', message => {
        socket.emit('client-test', message);
    });

    socket.on('disconnect', () => {
        console.log('disconnected');
    });

    socket.on('new_comment', comment => {
        socket.broadcast.emit('new_comment', comment.data);
        console.log('Nowy koment: ', comment)
    });

    socket.on('approved_comment', comment => {
        socket.broadcast.emit('approved_comment', comment);
    });

    socket.on('pinned_comment', comment => {
        socket.broadcast.emit('pinned_comment', comment);
        console.log('pinned comment');
    });

    socket.on('unpinned_comment', comment => {
        socket.broadcast.emit('unpinned_comment', comment);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, console.log(`Server started on port ${PORT}`));