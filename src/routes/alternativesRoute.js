import express from "express";
const router = express.Router();

//Import controllers
import * as controller from "../controllers/alternativesController.js";


//Main route
router.get("/", controller.getAllAlternatives);
router.get("/total", controller.getTotalAlternatives);
router.get("/:id", controller.getOneAlternative);

router.put("/:id", controller.updateOneAlternative);
router.delete("/:id", controller.deleteOneAlternative);
router.post("/", controller.createNewAlternative);

export default router;
