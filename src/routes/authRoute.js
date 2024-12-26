import express from "express";
const router = express.Router();
import * as controller from "../controllers/authController.js";
import {authVerification} from "../utils/authVerification.js";


router.post('/login',controller.logIn);
router.post('/register',controller.register);
router.get('/profile', authVerification, controller.getProfileData);
router.post('/logout',authVerification, controller.logOut
);


export default router;