import express  from 'express';

const router = express.Router();

import * as controller from '../controllers/scoreVController.js';

router.get('/', controller.getAllScoreV)
router.put('/', controller.updateScoreV)

export default router