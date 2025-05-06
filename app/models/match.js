
import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  fecha: { type: Date, required: true },
  equipo1: {
    nombre_completo: { type: String, required: true },
    abreviacion: { type: String, required: true },
    img_logo: { type: String, required: true },
  },
  equipo2: {
    nombre_completo: { type: String, required: true },
    abreviacion: { type: String, required: true },
    img_logo: { type: String, required: true },
  },
  resultado: { type: String, default: "- : -" },
  descripcion: { type: String, required: true },
  formato: { 
    type: String, 
    enum: ["BO1", "BO3", "BO5"], // Opciones válidas
    default: "BO1"                    // Valor predeterminado
  },
  juego: { 
    type: String, 
    enum: ["csgo2", "lol", "valorant"], // Opciones válidas
    default: "csgo2"                    // Valor predeterminado
  }
});

export default mongoose.model("Match", matchSchema);
