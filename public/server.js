const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'alnoor_academy_secret_key',
    resave: false,
    saveUninitialized: true
}));

// In-Memory Database (Registered Users & Data)
const users = [
    { username: 'admin', password: 'admin123', role: 'admin' }
];

// ==================== CSS STYLES (Professional Theme) ====================
const commonCSS = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f7f6; color: #333; }
    header { background: #0d5c3a; color: white; padding: 25px; text-align: center; }
    header h1 { font-size: 2.2em; margin-bottom: 5px; }
    nav { background: #083b25; padding: 12px; text-align: center; }
    nav a { color: white; margin: 0 15px; text-decoration: none; font-weight: bold; font-size: 1.05em; }
    nav a:hover { color: #a3e4d7; }
    .container { padding: 30px 20px; max-width: 1000px; margin: auto; }
    .hero { text-align: center; padding: 50px 20px; background: #e8f5e9; border-bottom: 3px solid #0d5c3a; }
    .hero h2 { color: #0d5c3a; font-size: 2em; margin-bottom: 10px; }
    .cards { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-top: 20px; }
    .card { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.08); width: 280px; text-align: center; border-top: 5px solid #0d5c3a; }
    .card h3 { color: #0d5c3a; margin-bottom: 10px; }
    .form-box { background: white; padding: 35px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%; max-width: 380px; margin: 40px auto; border-top: 5px solid #0d5c3a; }
    .form-box h2 { color: #0d5c3a; text-align: center; margin-bottom: 20px; }
    input, select { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px; font-size: 1em; }
    button { width: 100%; background: #0d5c3a; color: white; padding: 12px; border: none; border-radius: 5px; font-weight: bold; font-size: 1em; cursor: pointer; margin-top: 10px; }
    button:hover { background: #083b25; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
    th, td { border: 1px solid #ddd; padding: 12px 15px; text-align: left; }
    th { background: #0d5c3a; color: white; }
    footer { background: #0d5c3a; color: white; text-align: center; padding: 18px; margin-top: 50px; font-size: 0.9em; }
`;

// Helper Function for Layout
function renderPage(title, content, session) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - Al Noor Quran Academy</title>
        <style>${commonCSS}</style>
    </head>
    <body>
        <header>
            <h1>Al Noor Quran Academy</h1>
            <p>Learn Holy Quran Online with Qualified Tutors</p>
        </header>
        <nav>
            <a href="/">Home</a>
            <a href="/courses">Courses</a>
            ${session && session.user ? `
                ${session.user.role === 'admin' ? '<a href="/admin">Admin Panel</a>' : '<a href="/dashboard">Dashboard</a>'}
                <a href="/logout" style="color: #ff8a80;">Logout (${session.user.username})</a>
            ` : `
                <a href="/login">Login</a>
                <a href="/register">Register</a>
            `}
        </nav>
        ${content}
        <footer>
            <p>&copy; 2026 Al Noor Quran Academy. All Rights Reserved.</p>
        </footer>
    </body>
    </html>
    `;
}

// ==================== ROUTES ====================

// 1. Home Page
app.get('/', (req, res) => {
    const html = `
        <section class="hero">
            <h2>Welcome to Al Noor Quran Academy</h2>
            <p>Providing high-quality, professional online Quranic education for kids and adults worldwide.</p>
        </section>
        <div class="container">
            <h2 style="text-align: center; color: #0d5c3a; margin-bottom: 20px;">Our Programs</h2>
            <div class="cards">
                <div class="card">
                    <h3>Noorani Qaida</h3>
                    <p>Basic Quranic reading foundation for beginners with pronunciation rules.</p>
                </div>
                <div class="card">
                    <h3>Tajweed-ul-Quran</h3>
                    <p>Learn the precise rules of recitation with expert instructors.</p>
                </div>
                <div class="card">
                    <h3>Quran Memorization</h3>
                    <p>Systematic Hifz program customized for every student's speed.</p>
                </div>
            </div>
        </div>
    `;
    res.send(renderPage('Home', html, req.session));
});

// 2. Courses Page
app.get('/courses', (req, res) => {
    const html = `
        <div class="container">
            <h2 style="text-align: center; color: #0d5c3a; margin-bottom: 20px;">Available Free Courses</h2>
            <table>
                <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Duration</th>
                        <th>Fee</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Noorani Qaida</td><td>3 Months</td><td>Free</td><td><a href="/register" style="color:#0d5c3a; font-weight:bold;">Enroll Now</a></td></tr>
                    <tr><td>Tajweed Course</td><td>6 Months</td><td>Free</td><td><a href="/register" style="color:#0d5c3a; font-weight:bold;">Enroll Now</a></td></tr>
                    <tr><td>Hifz-ul-Quran</td><td>1 - 2 Years</td><td>Free</td><td><a href="/register" style="color:#0d5c3a; font-weight:bold;">Enroll Now</a></td></tr>
                    <tr><td>Islamic Studies</td><td>6 Months</td><td>Free</td><td><a href="/register" style="color:#0d5c3a; font-weight:bold;">Enroll Now</a></td></tr>
                </tbody>
            </table>
        </div>
    `;
    res.send(renderPage('Courses', html, req.session));
});

// 3. Register Page
app.get('/register', (req, res) => {
    const html = `
        <div class="form-box">
            <h2>Student Registration</h2>
            <form action="/register" method="POST">
                <input type="text" name="username" placeholder="Full Name / Username" required>
                <input type="password" name="password" placeholder="Create Password" required>
                <button type="submit">Register Account</button>
            </form>
            <p style="text-align:center; margin-top:15px;">Already registered? <a href="/login" style="color:#0d5c3a;">Login here</a></p>
        </div>
    `;
    res.send(renderPage('Register', html, req.session));
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    users.push({ username, password, role: 'student' });
    res.send(renderPage('Success', `
        <div class="container" style="text-align:center;">
            <h2 style="color:#0d5c3a;">Registration Successful!</h2>
            <p style="margin: 15px 0;">Account created for <b>${username}</b>.</p>
            <a href="/login"><button style="max-width:200px; display:inline-block;">Proceed to Login</button></a>
        </div>
    `, req.session));
});

// 4. Login Page
app.get('/login', (req, res) => {
    const html = `
        <div class="form-box">
            <h2>Portal Login</h2>
            <form action="/login" method="POST">
                <input type="text" name="username" placeholder="Username" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit">Login</button>
            </form>
            <p style="text-align:center; margin-top:15px; font-size:0.85em; color:#666;">
                Admin Login Credentials:<br>Username: <b>admin</b> | Password: <b>admin123</b>
            </p>
        </div>
    `;
    res.send(renderPage('Login', html, req.session));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.user = user;
        if (user.role === 'admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/dashboard');
        }
    } else {
        res.send(renderPage('Error', `
            <div class="container" style="text-align:center; color:red;">
                <h2>Invalid Credentials!</h2>
                <p style="margin: 15px 0;">Username or password was incorrect.</p>
                <a href="/login"><button style="max-width:200px; display:inline-block;">Try Again</button></a>
            </div>
        `, req.session));
    }
});

// 5. Student Dashboard
app.get('/dashboard', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    
    const html = `
        <div class="container">
            <h2 style="color:#0d5c3a;">Welcome to Student Portal, ${req.session.user.username}!</h2>
            <p style="margin-top:10px;">Here you can view your enrolled Quran classes and schedules.</p>
            
            <div class="cards" style="margin-top:30px;">
                <div class="card">
                    <h3>My Class Status</h3>
                    <p style="color:green; font-weight:bold; margin-top:10px;">Active</p>
                </div>
                <div class="card">
                    <h3>Assigned Tutor</h3>
                    <p style="margin-top:10px;">Qari Muhammad Ahmed</p>
                </div>
            </div>
        </div>
    `;
    res.send(renderPage('Student Dashboard', html, req.session));
});

// 6. Admin Panel
app.get('/admin', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).send(renderPage('Access Denied', `
            <div class="container" style="text-align:center; color:red;">
                <h2>Access Denied!</h2>
                <p>Only Admin can access this page.</p>
                <a href="/login"><button style="max-width:200px; margin-top:15px;">Login as Admin</button></a>
            </div>
        `, req.session));
    }

    let userRows = users.map((u, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${u.username}</td>
            <td><span style="background:${u.role === 'admin' ? '#ffe0b2' : '#c8e6c9'}; padding:4px 8px; border-radius:4px;">${u.role}</span></td>
        </tr>
    `).join('');

    const html = `
        <div class="container">
            <h2 style="color:#0d5c3a; margin-bottom:10px;">Admin Control Panel</h2>
            <p>Total Registered Accounts: <b>${users.length}</b></p>
            
            <h3 style="margin-top:25px; color:#333;">Registered Users List</h3>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    ${userRows}
                </tbody>
            </table>
        </div>
    `;
    res.send(renderPage('Admin Panel', html, req.session));
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(` Al Noor Quran Academy Website Active!`);
    console.log(` Access URL: http://localhost:${PORT}`);
    console.log(` Admin User: admin | Admin Pass: admin123`);
    console.log(`==================================================\n`);
});
