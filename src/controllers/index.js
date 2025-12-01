// Basic Routes

const homePage = (req, res) => {
    console.log(res.locals)
    res.render('home', {title: 'Home'})
};

const phasesPage = (req, res) => {
    res.render('phases', {title: 'Phases'})
};

const resourcesPage = (req, res) => {
    res.render('resources', {title: 'Resources'})
};

const merchPage = (req, res) => {
    res.render('merch', {title: 'Merch'})
};

const menuPage = (req, res) => {
    res.render('menu', {title: 'Menu'})
};

const podcastsPage = (req, res) => {
    res.render('podcasts', {
        title: "Emergency Preparedness Podcasts",
        videos: [
            {title: "Emergency Kit Basics", url: "https://www.youtube.com/watch?v=BKo_BJwe3MM"},
            {title: "Evacuation Planning", url: "https://www.youtube.com/embed/4ApKN6JMRFE?si=A_hkKFLidz5nqtcr"}
        ]
    });
}; 

const testErrorPage = (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
};

export {homePage, phasesPage, resourcesPage, merchPage, menuPage, podcastsPage, testErrorPage};
