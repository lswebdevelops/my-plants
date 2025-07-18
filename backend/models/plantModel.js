import mongoose from "mongoose";

const plantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    companions: {
      type: [String], // Ex: ['Tomate', 'Manjericão']
      default: [],
    },
    season: {
      type: [String], // Ex: ['Primavera', 'Verão']
      default: [],
    },
    monthsByRegion: {
      norte: [Number],        // Ex: [1, 2, 3]
      nordeste: [Number],     // Ex: [2, 3, 4]
      sul: [Number],          // Ex: [9, 10, 11]
      sudeste: [Number],      // ...
      centroOeste: [Number],  // ...
    },
    info: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Plant = mongoose.model("Plant", plantSchema);

export default Plant;
