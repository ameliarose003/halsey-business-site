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
import { updateUser } from '../models/forms/registration.js';

router.get('/', homePage);
router.get('/phases', phasesPage);
router.get('/resources', resourcesPage);
router.get('/merch', merchPage);
router.get('/menu', menuPage);
router.get('/podcasts', podcastsPage);
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

export default router;