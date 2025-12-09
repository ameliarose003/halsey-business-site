import {body} from 'express-validator';

const podcastValidation = [
    body('title')
        .notEmpty().withMessage('Podcast title required')
        .isString().withMessage('Title must be text')
        .isLength({min: 5, max: 100}).withMessage('Title must be between 5 and 100 characters.'),
    
    body('description')
        .notEmpty().withMessage('Podcast description required.')
        .isString().withMessage('Description must be text')
        .isLength({max: 250}).withMessage('Description cannot exceed 250 characters.'),
    
    body('url')
        .notEmpty().withMessage('URL required')
        .isURL().withMessage('Must be correct URL format.')
        .isLength({max: 150}).withMessage('URL cannot exceed 150 characters.')
];

export { podcastValidation };