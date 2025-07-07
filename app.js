const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/home');
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
            {title: "Evacuation Planning", url: "https://www.youtube.com/embed/4ApKN6JMRFE?si=A_hkKFLidz5nqtcr"}
        ]
    });
});

// LocalHost:port

app.listen(PORT, () =>{
    console.log(`Server running at port:${PORT}`);
});