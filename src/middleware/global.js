// Global Middleware

const setLocalVariables = (req, res) => {

    // get current year
    res.locals.currentYear = new Date().getFullYear();

    // Makes NODE_ENV available to all templates
    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

    // Makes req.query available to all templates
    res.locals.queryParams = { ...req.query };

    const user = req.session.user;

    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
        res.locals.currentUser = {
            id: user.id,
            role_name: user.role_name
        };
    };
};

const setHeadAssetsFunctionality = (res) => {
    res.locals.styles = [];
    res.locals.scripts = [];

    res.addStyle = (css, priority = 0) => {
        res.locals.styles.push({ content: css, priority });
    };

    res.addScript = (js, priority = 0) => {
        res.locals.scripts.push({ content: js, priority});
    };

    res.locals.renderStyles = () => {
        return res.locals.styles
            // sort by descending order
            .sort((a, b) => b.priority - a.priority)
            // exptract just the HTML content from each object
            .map(item => item.content)
            // join all HTML strings together separated by new lines
            .join('\n');
    };

    res.locals.renderScripts = () => {
        return res.locals.scripts
            // sort by priority, higher numbers first, descending
            .sort((a, b) => b.priority - a.priority)
            // extract just the HTML content
            .map(item => item.content)
            // join all HTML strings separated by newlines
            .join('\n');
    };
}

const globalMiddleware = (req, res, next) => {
    setLocalVariables(req, res);
    setHeadAssetsFunctionality(res);
    next();
};

export {globalMiddleware};