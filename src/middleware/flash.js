const flashMiddleware = (req, res, next) => {
    req.flash = function(type, message) {
        // Initialize flash storage if it doesn't exist
        if (!req.session.flash) {
            req.session.flash = {
                success: [],
                error: [],
                warning: [],
                info: []
            };
        }

        // SETTING: Two arguments means we're storing a new message
        if (type && message) {
            // Ensure this message type's array exists
            if (!req.session.flash[type]) {
                req.session.flash[type] = [];
            }
            // Add the message to the appropriate type array
            req.session.flash[type].push(message);
            return;
        }

        // GETTING ONE TYPE: One argument means retrieve messages of that type
        if (type && !message) {
            const messages = req.session.flash[type] || [];
            // Clear this type's message after retrieving
            req.session.flash[type] = [];
            return messages;
        }

        // GETTING ALL: No arguments means retrieve all message types
        const allMessages = req.session.flash || {
            success: [],
            error: [],
            warning: [],
            info: []
        };

        // Clear all flash messages after retrieving
        req.session.flash = {
            success: [],
            error: [],
            warning: [],
            info: []
        };

        return allMessages;
    };

    next();
}

// Make flash functions available to all templates via res.locals
const flashLocals = (req, res, next) => {
    res.locals.flash = req.flash;
    next()
};

const flash = (req, res, next) => {
    flashMiddleware(req, res, () => {
        flashLocals(req, res, next);
    });
};

export default flash;