import { validationResult } from 'express-validator';
import {titleExists, savePodcast, getAllPodcasts, getPodcastById, updatePodcast, deletePodcast} from '../../models/podcasts/podcasts.js';

const addPodcastSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/podcasts.css">');
};

const showPodcastForm = (req, res) => {
    addPodcastSpecificStyles(res);
    res.render('podcasts/form', {
        title: 'Upload New Podcasts'
    });
};

const processPodcast = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log('Validation errors', errors.array());
            req.flash('error', "Validation errors empty");
            return res.redirect('upload-video');
        }

        const {title, description, url} = req.body;
        const titleTaken = await titleExists(title);
        if (titleTaken) {
            req.flash('warning', 'Title already exists. Please give the podcast episode a new title');
            return res.redirect('upload-video');
        }

        const savedPodcast = await savePodcast(title, description, url);
        if (!savedPodcast) {
            req.flash('error', 'Failed to save podcast');
            return res.redirect('upload-video');
        }

        req.flash('success', 'Podcast saved successfully!');
        res.redirect('upload-video')
    } catch {
        console.log('There was an error processing the podcast submission.');
        req.flash('error', 'Error uploading podcast');
        return res.redirect('podcasts');
    }
};

// Display all podcasts
const showAllPodcasts = async (req, res) => {
    const allUploadedPodcasts = await getAllPodcasts();

    addPodcastSpecificStyles(res);
    res.render('podcasts/list', {
        title: 'Podcasts',
        allUploadedPodcasts: allUploadedPodcasts
    });
};

const showEditPodcastForm = async (req, res) => {
    const targetPodcastId = parseInt(req.params.id);
    // const currentPodcast = req.session.podcast???? Do I need this? I don't think so...
    const currentUser = req.session.user;
    if (!currentUser) {
        req.flash('error', 'User not found.');
        return res.redirect('/login');
    };
    console.log("targetPodcastId:", targetPodcastId);
    const targetPodcast = await getPodcastById(targetPodcastId);
    console.log("targetPodcast:", targetPodcast);
    if (!targetPodcast) {
        req.flash('error', 'Podcast not found.');
        return res.redirect('/podcasts');
    };

    const isAdmin = currentUser.role_name === 'admin';
    if (!isAdmin) {
        req.flash('error', 'You do not have permission to access this page');
        return res.redirect('/podcasts');
    };

    addPodcastSpecificStyles(res);
    res.render(`/podcasts/${req.params.id}/edit`, {
        title: 'Edit Podcast',
        podcast: targetPodcast
    });
};

const processEditPodcast = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', 'Please correct the errors in the form.');
        return res.redirect(`/podcasts/${req.params.id}/edit`);
    }

    const targetPodcastId = parseInt(req.params.id);
    const currentUser = req.session.user;
    const { title, description, url } = req.body;
    const targetPodcast = await getPodcastById(targetPodcastId);
    if (!targetPodcast) {
        req.flash('error', 'Podcast not found.');
        return res.redirect('/podcasts/list');
    };

    // Check permissions
    const isAdmin = currentUser.role_name === 'admin';
    if (!isAdmin) {
        req.flash('error', "You don't have permission to access this page");
        return res.redirect('/podcasts/list');
    };

    // Check if title already exists
    if (await titleExists(title) && title !== targetPodcast.title) {
        req.flash('error', 'Title not available');
        return res.redirect(`/podcasts/${req.params.id}/edit`);
    };

    // udpate podcast in database using 
    const updatedPodcast = await updatePodcast(targetPodcastId, title, description, url);
    if (!updatedPodcast) {
        req.flash('error', 'Update failed');
        return res.redirect(`/podcasts/${req.params.id}/edit`);
    };

    req.flash('success', 'Podcast updated successfully.');
    return res.redirect(`/podcasts/${req.params.id}/edit`);
};

const processDeletePodcast = async (req, res) => {
    const targetPodcastId = parseInt(req.params.id);
    const currentUser = req.session.user;
    if (!currentUser) {
        req.flash('error', 'Not logged in');
        return res.redirect('/login');
    };

    // Verify current user is admin
    const isAdmin = currentUser.role_name === 'admin';
    if (!isAdmin) {
        req.flash('error', "Further permissions required to access page");
        return res.redirect('/');
    };

    // Delete podcast using deletePodcast function
    const deletedPodcast = await deletePodcast(targetPodcastId);
    if (!deletedPodcast) {
        req.flash('error', 'Podcast deletion failed');
        return res.redirect('/podcasts/list');
    };

    req.flash('success', 'Podcast deleted successfully.');
    return res.redirect('/podcasts/list');

};

export {showPodcastForm, processPodcast, showAllPodcasts, showEditPodcastForm, processEditPodcast, processDeletePodcast};