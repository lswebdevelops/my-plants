import asyncHandler from "../middleware/asyncHandler.js";
import Plant from "../models/plantModel.js";
import cloudinary2 from "../config/cloudinary2.js";
import fs from "fs";

// @desc Fetch all plants
// @route get /api/plants
// @access Public

const getPlants = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Plant.countDocuments({ ...keyword });

  const plants = await Plant.find({ ...keyword })
  .sort({ createdAt: -1})// newest plants first
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ plants, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch a plant
// @route get /api/plants/:id
// @access Public

const getPlantById = asyncHandler(async (req, res) => {
  const plant = await Plant.findById(req.params.id);

  if (plant) {
    res.json(plant);
  } else {
    res.status(404);
    throw new Error("Recurso não encontrado.");
  }
});

// @desc create a new plant
// @route post /api/plants
// @access private admin

const createPlant = asyncHandler(async (req, res) => {
  const plant = new Plant({
    name: "Vegetais",
    price: 1.12,
    user: req.user._id,
    image: "https://res.cloudinary.com/dvnxrzpnl/image/upload/v1752757753/icons8-leaf-96_lj5vq8.png",
    brand: "Estação",
    category: "plantas companheiras",
    countInStock: 0,
    numReviews: 0,
    description: "Plantar e colher",
  });

  const createdPlant = await plant.save();
  res.status(201).json(createdPlant);
});

// @desc update a plant
// @route PUT  /api/plant/:id
// @access private admin

const updatePlant = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const plant = await Plant.findById(req.params.id);

  if (plant) {
    plant.name = name;
    plant.price = price;
    plant.description = description;
    plant.image = image;
    plant.brand = brand;
    plant.category = category;
    plant.countInStock = countInStock;

    const updatedPlant = await plant.save();
    res.json(updatedPlant);
  } else {
    res.status(404);
    throw new Error("Plant not found");
  }
});

// @desc delete a plant
// @route delete  /api/plant/:id
// @access private admin

const deletePlant = asyncHandler(async (req, res) => {
  const plant = await Plant.findById(req.params.id);

  if (plant) {
    await Plant.deleteOne({ _id: plant._id });
    res.status(200).json({ message: "Cultivo deletado" });
  } else {
    res.status(404);
    throw new Error("Recurso não encontrado");
  }
});

// @desc create a new review
// @route post  /api/plants/:id/reviews
// @access private

const createPlantReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const plant = await Plant.findById(req.params.id);

  if (plant) {
    const alreadyReviewed = plant.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Obra já avaliada.");
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    plant.reviews.push(review);

    plant.numReviews = plant.reviews.length;

    plant.rating =
      plant.reviews.reduce((acc, review) => acc + review.rating, 0) /
      plant.reviews.length;

    await plant.save();
    res.status(201).json({ message: "Avaliação adicionada" });
  } else {
    res.status(404);
    throw new Error("Recurso não encontrado");
  }
});

// @desc get top rated plant
// @route get /api/plants/top
// @access Public

const getTopPlants = asyncHandler(async (req, res) => {
  const plants = await Plant.find({}).sort({ rating: -1 }).limit(3);
  res.status(200).json(plants);
});

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin

const uploadPlantImage = asyncHandler(async (req, res) => {
  const file = req.file;

  if (!file) {
    res.status(400);
    throw new Error("Nenhum arquivo enviado");
  }

  const uploadResult = await cloudinary2.uploader.upload(file.path, {
    folder: "plants", // <- isso define a pasta correta
  });

  // 🔍 Adicione isto:
  console.log("Upload result (PLANT):", uploadResult);

  fs.unlinkSync(file.path);

  res.status(200).json({
    message: "Imagem enviada com sucesso",
    image: uploadResult.secure_url,
  });
});



export {
  getPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  createPlantReview,
  getTopPlants,
  uploadPlantImage,
};
