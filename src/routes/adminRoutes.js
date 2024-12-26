import express from "express";
const router = express.Router();

import * as controller from '../controllers/adminController.js'

router.get('/accounts', controller.getAllUsers)
router.get('/accounts/:uuid', controller.getUserByUUID)
router.delete('/accounts/:uuid', controller.deleteUserByUUID)
router.put('/accounts/change-status/:uuid', controller.changeStatus)


export default router