import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadBlogImagesMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

import {
  getPlantById,
  getPlants,
  createPlant,
  updatePlant,
  deletePlant,
  createPlantReview,
  getTopPlants,
  uploadPlantImage, // ✅ IMPORTA AQUI
} from "../controllers/plantController.js";

const router = express.Router();

router.route("/").get(getPlants).post(protect, admin, createPlant);

// ✅ NOVA ROTA DE UPLOAD
router.post("/upload", protect, admin, upload.single("image"), uploadPlantImage);

router.route("/:id/reviews").post(protect, checkObjectId, createPlantReview);

router.get("/top", getTopPlants);

router
  .route("/:id")
  .get(getPlantById)
  .put(protect, admin, checkObjectId, updatePlant)
  .delete(protect, admin, checkObjectId, deletePlant);

export default router;
