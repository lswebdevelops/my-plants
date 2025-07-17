import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadBlogImagesMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

import {
  getBookById,
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  createBookReview,
  getTopBooks,
  uploadBookImage, // ✅ IMPORTA AQUI
} from "../controllers/bookController.js";

const router = express.Router();

router.route("/").get(getBooks).post(protect, admin, createBook);

// ✅ NOVA ROTA DE UPLOAD
router.post("/upload", protect, admin, upload.single("image"), uploadBookImage);

router.route("/:id/reviews").post(protect, checkObjectId, createBookReview);

router.get("/top", getTopBooks);

router
  .route("/:id")
  .get(getBookById)
  .put(protect, admin, checkObjectId, updateBook)
  .delete(protect, admin, checkObjectId, deleteBook);

export default router;
