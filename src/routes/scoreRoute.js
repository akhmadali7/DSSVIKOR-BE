import express from "express";
import * as controller from "../controllers/scoreController.js";
const router = express.Router();

router.get("/", controller.getAllScores)
router.put("/:ID_alternative", controller.updateScores)

export default router;
