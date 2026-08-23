const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'alnoor_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Dummy Data
const users = [];
const courses = [
    { name: "Tajweed-ul-Quran", duration: "3 Months", fee: "Free" },
    { name: "Hifz-ul-Quran", duration: "1 Year", fee: "Free" },
    { name: "Islamic Studies", duration: "6 Months", fee: "Free" }
];

// Routes
app.post('/register', (req, res) => {
    const { username, password, role } = req.body;
    users.push({ username, password, role: role || 'student' });
    res.redirect('/login.html');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        req.session.user = { username: 'Admin', role: 'admin' };
        return res.redirect('/admin.html');
    }
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = user;
        res.redirect('/dashboard.html');
    } else {
        res.send('Invalid Credentials! <a href="/login.html">Try Again</a>');
    }
});

app.get('/api/admin-data', (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        res.json({ totalUsers: users.length, users: users });
    } else {
        res.status(403).send('Unauthorized Access');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
