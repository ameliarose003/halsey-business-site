import {body} from 'express-validator';

//Validation rules for user registration
const registrationValidation = [
    body('name')
        .trim()
        .isLength({min: 7})
        .withMessage('Name must be at least 7 characters long'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('confirmEmail')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid confirmation email')
        .normalizeEmail()
        .custom((value, { req }) => {
            if (value !== req.body.email) {
                throw new Error('Email addresses do not match');
            }
            return true;
        }),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password mush be at least 8 characters long')
        .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)
        .withMessage('Password must contain at least one number and one symbol (!@#$%^&*)'),

    body('confirmPassword')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .isLength({min: 8})
        .withMessage('Password is required')
];

const updateAccountValidation = [
    body('name')
        .trim()
        .isLength({min: 7})
        .withMessage('Name must be at least 7 characters long'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('role_name')
        .optional({checkFalsy: true})
        .trim()
        .isIn(['admin', 'user'])
        .withMessage('Please select valid role title, admin or user')
];

export { registrationValidation, loginValidation, updateAccountValidation};