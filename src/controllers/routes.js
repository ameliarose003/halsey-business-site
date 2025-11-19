import { Router } from 'express';

const router = Router();

import { homePage, phasesPage, resourcesPage, merchPage, menuPage, podcastsPage, testErrorPage } from './index.js'


router.get('/', homePage);
router.get('/phases', phasesPage);
router.get('/resources', resourcesPage);
router.get('/merch', merchPage);
router.get('/menu', menuPage);
router.get('/podcasts', podcastsPage);
router.get('/test-error', testErrorPage);

export default router;