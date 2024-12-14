import express from "express";
import * as controller from "../controllers/scoreController.js";
const router = express.Router();

router.get("/", controller.getAllScores)

export default router;
