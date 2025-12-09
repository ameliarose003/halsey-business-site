import { Router } from 'express';

const router = Router();

import { homePage, phasesPage, resourcesPage, merchPage, menuPage, podcastsPage, testErrorPage } from './index.js'
import {showRegistrationForm,
    processRegistration,
    showAllUsers,
    showEditAccountForm,
    processEditAccount,
    processDeleteAccount } from './forms/registration.js';
import { showLoginForm, 
    processLogin, 
    processLogout, 
    showDashboard
} from './forms/login.js';
import { loginValidation, registrationValidation, updateAccountValidation } from '../middleware/validation/forms.js';
import { requireLogin, requireRole } from '../middleware/auth.js';
import {showPodcastForm, processPodcast, showAllPodcasts, showEditPodcastForm, processEditPodcast, processDeletePodcast} from './podcasts/podcasts.js'
import {podcastValidation} from '../middleware/validation/podcasts.js'

router.get('/', homePage);
router.get('/phases', phasesPage);
router.get('/resources', resourcesPage);
router.get('/merch', merchPage);
router.get('/menu', menuPage);
router.get('/test-error', testErrorPage);

// Registration Routes
router.get('/signup', showRegistrationForm);
router.post('/signup', registrationValidation, processRegistration);

// Login Routes
router.get('/login', showLoginForm);
router.post('/login', loginValidation, processLogin);
router.get('/logout', processLogout);

// Protected routes (require auth)
router.get('/dashboard', requireLogin, showDashboard);
router.get('/users/:id/edit', requireLogin, showEditAccountForm);
router.post('/users/:id/update', requireLogin, updateAccountValidation, processEditAccount );

// Has require login so other viewers can't see any user info.
router.get('/users', requireLogin, requireRole('admin'), showAllUsers);
router.post('/users/:id/delete', requireLogin, requireRole('admin'), processDeleteAccount);

// podcast/:id/:slug slug wouldn't be needed, but is good for user experience or podcast/:timestamp/:slug ex. podcast/2025-nov/slug
router.get('/podcasts', showAllPodcasts);
router.get('/podcasts/upload-video', requireLogin, requireRole('admin'), showPodcastForm);
router.post('/podcasts/upload-video', requireLogin, requireRole('admin'), processPodcast, podcastValidation);
router.get('/podcasts/:id/edit', requireLogin, requireRole('admin'), showEditPodcastForm);
router.post('/podcasts/:id/update', requireLogin, requireRole('admin'), podcastValidation, processEditPodcast) ;
router.post('/podcasts/:id/delete', requireLogin, requireRole('admin'), processDeletePodcast);


export default router;