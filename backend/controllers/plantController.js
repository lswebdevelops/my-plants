import asyncHandler from "../middleware/asyncHandler.js";
import Plant from "../models/plantModel.js";
import cloudinary2 from "../config/cloudinary2.js";
import fs from "fs";

// @desc Fetch all plants
// @route GET /api/plants
// @access Public
const getPlants = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT || 20;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Plant.countDocuments({ ...keyword });
  const plants = await Plant.find({ ...keyword })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ plants, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch single plant
// @route GET /api/plants/:id
// @access Public
const getPlantById = asyncHandler(async (req, res) => {
  const plant = await Plant.findById(req.params.id);
  if (plant) {
    res.json(plant);
  } else {
    res.status(404);
    throw new Error("Planta não encontrada.");
  }
});

// @desc Create new plant
// @route POST /api/plants
// @access Private/Admin
const createPlant = asyncHandler(async (req, res) => {
  const plant = new Plant({
    name: "Nova Planta Fictícia",
    user: req.user._id,
    image:
      "https://res.cloudinary.com/dvnxrzpnl/image/upload/v1752757753/icons8-leaf-96_lj5vq8.png",
    companions: ["Manjericão", "Calêndula"],
    season: ["Primavera", "Verão"],
    monthsByRegion: {
      norte: [7, 8, 9],
      nordeste: [8, 9, 10, 11],
      sul: [9, 10, 11, 12],
      sudeste: [9, 10, 11, 12],
      centroOeste: [9, 10, 11],
    },
    info: "Esta é uma descrição padrão para uma planta fictícia. Sinta-se à vontade para editar esta seção com informações relevantes sobre esta planta.",
  });

  const createdPlant = await plant.save();
  res.status(201).json(createdPlant);
});

// @desc Update plant
// @route PUT /api/plants/:id
// @access Private/Admin
const updatePlant = asyncHandler(async (req, res) => {
  const { name, image, companions, season, monthsByRegion, info } = req.body;

  const plant = await Plant.findById(req.params.id);

  if (plant) {
    plant.name = name || plant.name;
    plant.image = image || plant.image;
    plant.companions = companions || [];
    plant.season = season || [];
    plant.monthsByRegion = monthsByRegion || plant.monthsByRegion;
    plant.info = info || plant.info;

    const updatedPlant = await plant.save();
    res.json(updatedPlant);
  } else {
    res.status(404);
    throw new Error("Planta não encontrada.");
  }
});

// @desc Delete plant
// @route DELETE /api/plants/:id
// @access Private/Admin
const deletePlant = asyncHandler(async (req, res) => {
  const plant = await Plant.findById(req.params.id);
  if (plant) {
    await Plant.deleteOne({ _id: plant._id });
    res.status(200).json({ message: "Planta deletada com sucesso." });
  } else {
    res.status(404);
    throw new Error("Planta não encontrada.");
  }
});

// @desc Upload image to Cloudinary
// @route POST /api/upload
// @access Private/Admin
const uploadPlantImage = asyncHandler(async (req, res) => {
  const file = req.file;

  if (!file) {
    res.status(400);
    throw new Error("Nenhum arquivo enviado");
  }

  const uploadResult = await cloudinary2.uploader.upload(file.path, {
    folder: "plants",
  });

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
  uploadPlantImage,
};
