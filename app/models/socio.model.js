import mongoose from "mongoose";

const socioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  fecha_nacimiento: { type: Date, required: true },
  dni: { type: String, required: true, unique: true },
  estado_civil: { type: String, required: true },
  nacionalidad: { type: String, required: true },
  calle: { type: String, required: true },
  numero_calle: { type: String, required: true },
  provincia: { type: String, required: true },
  localidad: { type: String, required: true },
  codigo_postal: { type: String, required: true },
  telefono: { type: String, required: true },
  mail: { type: String, required: true, unique: true },
  discord: { type: String, required: true },
});

const Socio = mongoose.model("Socio", socioSchema);
export default Socio;
