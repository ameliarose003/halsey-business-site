import { validationResult } from "express-validator";
import { findUserByEmail, verifyPassword } from "../../models/forms/login.js";

//Display login form
const addFormSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/login.css">');
};
const showLoginForm = (req, res) => {
    addFormSpecificStyles(res);
    res.render('forms/login/form', {
        title: "Login"
    });
};

const processLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', 'Please fill out all fields');
        return res.redirect('/login');
    }

    const { email, password } = req.body;
    console.log(email);
    const user = await findUserByEmail(email.toLowerCase());
    console.log(user);
    if (!user) {
        console.log("invalid email:", user);
        req.flash('error', 'Invalid email');
        return res.redirect('/login');
    }

    const validPass = await verifyPassword(password, user.password);
    if (!validPass) {
        req.flash('error', 'Invalid password');
        return res.redirect('/login');
    }

    user.password = null;
    delete user.password;
    req.session.user = user;
    setTimeout( () => {
        req.flash('success', 'Welcome to your dashboard');
        res.redirect('/dashboard');
    }, 100);
  
};

//Handle user logout
//NOTE: connect.sid is the default session name since we did not name the session
//when created it in our server.js file.
const processLogout = (req, res) => {
    if (!req.session) {
        return res.redirect('/');
    }

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            /**
            * Clear the session cookie from the browser anyway, so the client
            * doesn't keep sending an invalid session ID.
            */
            res.clearCookie('connect.sid');
            /** 
            * Normally we would respond with a 500 error since logout didn't fully succeed with code
            * similar to: return res.status(500).send('Error logging out');
            * 
            * Since I haven't taken the time to figure that out we will redirect to the home page for now.
            */
           return res.redirect('/');
        }
        // If session destruction succeeded, clear the session cookie from the browser
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};

const showDashboard = (req, res) => {
    const user = req.session.user;
    const sessionData = req.session;
    // Ensure password has been deleted and delete if not
    if (user.password) {
        delete user.password;
    };
    if (sessionData.password) {
        delete sessionData.password;
    };

    addFormSpecificStyles(res);
    res.render('forms/login/dashboard', {
        title: 'Welcome to your dashboard',
        user: user,
        sessionData: sessionData
    });
};

export { showLoginForm, processLogin, processLogout, showDashboard };