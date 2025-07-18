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
  uploadPlantImage,
} from "../controllers/plantController.js";

const router = express.Router();

// Buscar todas as plantas e criar nova planta
router.route("/").get(getPlants).post(protect, admin, createPlant);

// Upload de imagem
router.post("/upload", protect, admin, upload.single("image"), uploadPlantImage);

// Operações por ID: buscar, editar e deletar
router
  .route("/:id")
  .get(getPlantById)
  .put(protect, admin, checkObjectId, updatePlant)
  .delete(protect, admin, checkObjectId, deletePlant);

export default router;
