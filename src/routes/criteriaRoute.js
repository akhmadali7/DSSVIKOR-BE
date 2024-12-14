import express from "express";
const router = express.Router();

import * as controller from '../controllers/criteriaController.js';

router.get('/', controller.getAllCriteria)
router.get('/total', controller.getTotalCriteria)
router.post('/', controller.createNewCriteria)

router.get('/:id', controller.getOneCriteria)
router.delete('/:id', controller.deleteOneCriteria)
router.put('/:id', controller.updateOneCriteria)


export default router;