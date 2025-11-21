const requireLogin = (req, res, next) => {
    const user = req.session.user;

    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
        res.locals.currentUser = {
            id: user.id,
            role_name: user.role_name
        };
        return next();
    } else {
        return res.redirect('/login');
    }
};

// @params {string} roleName - The role name required (e.g. 'admin', 'user')
// @returns {Function} Express middleware function
const requireRole = (roleName) => {
    return (req, res, next) => {
        const user = req.session.user;
        if (!user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        const userRole = user.role_name;
        if (userRole !== roleName) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        next();
    };
};

export { requireLogin, requireRole};