const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/phases');
});

// Pages:
app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/phases', (req, res) => {
    res.render('phases');
});

app.get('/resources', (req, res) => {
    res.render('resources');
});

app.get('/merch', (req, res) => {
    res.render('merch');
});

app.get('/book', (req, res) => {
    res.render('book');
});

app.get('/videos', (req, res) => {
    res.render('videos', {
        videos: [
            {title: "Emergency Kit Basics", url: "https://www.youtube.com/watch?v=BKo_BJwe3MM"},
            {title: "Evacuation Planning", url: "https://www.youtube.com/watch?v=4ApKN6JMRFE"}
        ]
    });
});

// LocalHost:port

app.listen(port, () =>{
    console.log(`Server running at port:${port}`);
});