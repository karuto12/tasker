const express = require('express');
const path = require('path');
const userModel = require('./models/user');
const taskModel = require('./models/task');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const formatDate = require('./utils/formatDate');
const toTitleCase = require('./utils/toTitleCase');
const app = express();

const rounds = 10; // Salt rounds for bcrypt
const port = 3000;
const secretkey = 'secretkey';

// app.set('view options', { async: true });
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/about', (req, res) => {
    res.render('about');
});
app.get('/contact', (req, res) => {
    res.render('contact');
});
app.get('/register', (req, res) => {
    let warning = req.query.warning;
    res.render('register', { warning });
});
app.get('/login', (req, res) => {
    const warning = req.query.warning;
    res.render('login', { warning });
});
app.get('/user', async (req, res) => {
    var token = req.cookies.token;
    try {
        var dtoken = jwt.verify(token, secretkey);
        var user = await userModel.findOne({ uname: dtoken.uname , _id: dtoken._id });
        if (!user) return res.redirect('/login'); // Redirect to login page if user not found
        user = await user.populate('tasks');
        res.render('user', { user });
    } catch (err) {
        // If token is invalid or expired, generate a new one
        if (err.name === 'TokenExpiredError') {
            res.clearCookie('token');
        } else {
        }
        res.redirect('/login');
    }
});


app.get('/', (req, res) => {
    res.render('home');
});
app.get('/view', async (req, res) => {
    const users = await userModel.find({});
    res.render('view', { users });
});
app.get('/logout', async (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

app.get('/user/edit/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const task = await taskModel.findOne({ _id: taskId });
    if (!task) return res.redirect('/user');
    const user = await userModel.findOne({ _id: task.userId });
    res.render('tasks/edit', { task, user });
});
app.get('/user/view/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const task = await taskModel.findOne({ _id: taskId });
    if (!task) return res.redirect('/user');
    const user = await userModel.findOne({ _id: task.userId });
    res.render('tasks/view', { task, user });

});

app.post('/register', async (req, res) => {
    const { name, uname, password, image } = req.body;
    bcrypt.genSalt(rounds, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) throw err;
            // Check if user already exists
            const user = await userModel.findOne({ uname });
            if (user) {
                // Render the registration page with a warning message
                return res.render('register', { warning: 'This username is already taken. Please choose a different one.' });
            }
            
            // Create a new user if not found
            var createduser = await userModel.create({ name, uname, password: hash, image });
            const token = jwt.sign({uname: createduser.uname, name: createduser.name, _id: createduser._id}, secretkey);
            res.cookie('token', token, { expires: new Date(Date.now() + 900000) }); // Expires in 15 minutes
            res.redirect('/user'); // Redirect to the view page on success
        });
    });

});
app.post('/login', async (req, res) => {
    const { uname, password } = req.body;
    const user = await userModel.findOne({ uname });
    if (!user) {
        return res.render('login', { warning: 'User not found' });
    } else if (!await bcrypt.compare(password, user.password)) {
        return res.render('login', { warning: 'Incorrect password' });
    } else {
        const token = jwt.sign({uname: user.uname, name: user.name, _id: user._id}, secretkey);
        res.cookie('token', token, { expires: new Date(Date.now() + 900000) }); // Expires in 15 minutes
        res.redirect('/user');
    }
});
app.post('/user/add', async (req, res) => {
    const warning = 'You are not logged in or your session has expired. Please log in again.';
    const { title, content, userId } = req.body;
    var user = await userModel.findOne({ _id: userId });
    if (!user) return res.redirect(`/login?warning=${encodeURIComponent(warning)}`);
    const newPost = await taskModel.create({ title: toTitleCase(title), content, userId: userId });
    user.tasks.push(newPost._id);
    await user.save();
    user = await user.populate('tasks');
    res.redirect('/user');
});

app.post('/user/edit/:taskId', async (req, res) => {
    const { title, content, userId } = req.body;
    const date = formatDate(new Date());
    const { taskId } = req.params;
    var task = await taskModel.findOne({ _id: taskId });
    if (!task) return res.redirect('/user');
    task.title = toTitleCase(title);
    task.content = content;
    task.date = date;
    await task.save();
    res.redirect('/user');
});

app.delete('/user/remove/:taskId', async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await taskModel.findOneAndDelete({ _id: taskId });
        if (!task && !user) {
            return res.status(404).send({ message: "Task not found" });
        }
        const user = await userModel.findOneAndDelete({ _id: task.userId });
        res.status(200).send({ message: "Task removed successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});