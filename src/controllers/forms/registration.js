import { validationResult} from 'express-validator';
import {emailExists, saveUser, getAllUsers, getUserById, updateUser, deleteUser} from '../../models/forms/registration.js';

const addRegistrationSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
};

// Display registration form
const showRegistrationForm = (req, res) => {
    addRegistrationSpecificStyles(res); 
    res.render('forms/registration/form', {
        title: 'Create Account'
    });
};

// Process user registration submission
const processRegistration = async (req, res) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            req.flash('error')
            return res.redirect('/signup');
        }

        const {name, email, password} = req.body;
        const emailTaken = await emailExists(email);
        if (emailTaken) {
            req.flash('warning', 'An account with this email already exists')
            return res.redirect('/signup');
        }

        const savedUser = await saveUser(name, email, password);
        if (!savedUser) {
            req.flash('error', 'Failed to save user');
            return res.redirect('/signup');
        }

        req.flash('success', 'Sign-up complete! You can now log in.');
        res.redirect('/login');
    } catch (error) {
        console.log('There was an error processing the registration :(');
        req.flash('error', 'Error processing registration');
        return res.redirect('/signup');
    }
};

// Display all registered users
const showAllUsers = async (req, res) => {
    const allRegisteredUsers = await getAllUsers();

    addRegistrationSpecificStyles(res);
    res.render('forms/registration/list', {
        title: 'Registered Users',
        allRegisteredUsers: allRegisteredUsers,
    });
};

// Display the edit account form
// Users can edit their own account, admins can edit any account
const showEditAccountForm = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;
    // Check if the current user exists
    if (!currentUser) {
        req.flash('error', 'User not found.')
        return res.redirect('/users');
    };
    const targetUser = await getUserById(targetUserId);
    // Check if the target user (the user clicked on) exists
    if (!targetUser) {
        req.flash('error', 'Target User not found')
        return res.redirect('/users');
    };

    const isUser = currentUser.id === targetUserId;
    const isAdmin = currentUser.role_name === 'admin';
    // Show error if the user trying to edit doesn't have proper permissions
    if (!(isUser || isAdmin)) {
        req.flash('error', 'You do not have permission to edit this accound.');
        return res.redirect('/users');
    };

    addRegistrationSpecificStyles(res);
    res.render('forms/registration/edit', {
        title: 'Edit Account',
        user: targetUser
    });
};

// Process account edit form submission
const processEditAccount = async (req, res) => {
    const errors = validationResult(req);
    // Check for validation errors
    if (!errors.isEmpty()) {
        req.flash('error', 'Please correct the errors in the form.');
        return res.redirect(`/users/${req.params.id}/edit`);
    }

    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;
    const { name, email, role_name } = req.body;
    const targetUser = await getUserById(targetUserId);
    if (!targetUser) {
        req.flash('error', 'User not found')
        return res.redirect('/users');
    }
    //check edit permissions
    const isAdmin = currentUser.role_name === 'admin';
    const isUser = currentUser.id === targetUserId;
    if (!(isAdmin || isUser)) {
        req.flash('error', "You don't have permission to edit this account");
        return res.redirect('/users');
    }

    // Check if new email already exists for a different user
    if (await emailExists(email) && email !== targetUser.email) {
        req.flash('error', 'Email not available')
        return res.redirect(`/users/${req.params.id}/edit`);
    }

    // Update user in database using updateUser
    const currentRole = targetUser.role_name || 'user';
    const finalRole = role_name && role_name.trim() ? role_name.trim() : currentRole;

    // if (finalRole !== 'admin' && isAdmin) {
    //     req.flash('error', "You cannot make yourself")
    // }

    const updatedUser = await updateUser(targetUserId, name, email, finalRole);
    if (!updatedUser) {
        req.flash('error', 'Update failed');
        return res.redirect(`/users/${req.params.id}/edit`);
    }

    // Update session if current user edits their own account
    if (isUser) {
        req.session.user = {
            ...req.session.user,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role_name
        }
    }

    req.flash('success', 'Account updated successfully.');
    return res.redirect(`/users/${req.params.id}/edit`);
};

// Delete a user account (admin only)
const processDeleteAccount = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;
    if (!currentUser) {
        req.flash('error', 'Not logged in');
        return res.redirect('/login');
    }

    //Verify currentUser is admin
    const isAdmin = currentUser.role_name === 'admin';
    if (!isAdmin) {
        req.flash('error', 'Need further permissions to access page.');
        return res.redirect('/');
    }

    //Prevent admin from deleting their own account
    if (targetUserId === currentUser.id) {
        req.flash('error', 'You cannot delete your own account.');
        return res.redirect('/dashboard');
    }

    //Delete the user using deleteUser function
    const deletedUser = await deleteUser(targetUserId);
    if (!deletedUser) {
        req.flash('error', 'User deletion failed');
        return res.redirect('/dashboard');
    }

    req.flash('success', 'Account deleted successfully.');
    return res.redirect('/users');
    //Think about adding a success redirect for the non admin users to be redirected to the registration page.

};

export {
    showRegistrationForm,
    processRegistration,
    showAllUsers,
    showEditAccountForm,
    processEditAccount,
    processDeleteAccount,
};