// server.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// MongoDB konexioa
mongoose.connect('mongodb://localhost/kirol_elkartea', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB konektatua');
  })
  .catch((err) => {
    console.error('MongoDB konexio errorea:', err);
    process.exit(1);  // Aplikazioa itxi errore bat dagoenean
  });

// Ihardunaldi eredua
const EventSchema = new mongoose.Schema({
    name: String,
    date: Date,
    capacity: Number,
    attendees: [String]
});
const Event = mongoose.model('Event', EventSchema);

// Middleware-ak
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

// Pasahitzarekin saioa hasi
app.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === 'your-password') {
        req.session.loggedIn = true;
        res.redirect('/admin');
    } else {
        res.send('Pasahitz okerra');
    }
});

// Ihardunaldiak sortzeko orria
app.get('/admin', (req, res) => {
    if (req.session.loggedIn) {
        res.sendFile(__dirname + '/admin.html');
    } else {
        res.redirect('/');
    }
});

// Ihardunaldi berria sortu
app.post('/create-event', (req, res) => {
    if (req.session.loggedIn) {
        const { name, date, capacity } = req.body;
        const newEvent = new Event({ name, date, capacity, attendees: [] });
        newEvent.save((err) => {
            if (err) return res.send('Errorea sortzean');
            res.redirect('/admin');
        });
    } else {
        res.redirect('/');
    }
});

// Ihardunaldiak zerrendatu
app.get('/events', (req, res) => {
    Event.find({}, (err, events) => {
        if (err) return res.send('Errorea ihardunaldiak lortzean');
        res.json(events);
    });
});

// Ihardunaldi batean apuntatu
app.post('/register/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    Event.findById(id, (err, event) => {
        if (err) return res.send('Errorea ihardunaldiak lortzean');
        if (event.attendees.length < event.capacity) {
            event.attendees.push(name);
            event.save((err) => {
                if (err) return res.send('Errorea apuntatzean');
                res.redirect('/');
            });
        } else {
            res.send('Ihardunaldia beteta dago');
        }
    });
});

app.listen(port, () => {
    console.log(`Server martxan http://localhost:${port}`);
});
