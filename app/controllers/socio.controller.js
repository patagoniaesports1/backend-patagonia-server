import Socio from "../models/socio.model.js";

const createSocio = async (req, res) => {
  try {
    const socio = new Socio(req.body);
    await socio.save();
    res.status(201).json({ message: "Socio registrado exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSocios = async (req, res) => {
  try {
    const socios = await Socio.find();
    res.status(200).json(socios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSocioById = async (req, res) => {
  try {
    const socio = await Socio.findById(req.params.id);
    if (!socio) return res.status(404).json({ message: "Socio no encontrado" });
    res.status(200).json(socio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSocio = async (req, res) => {
  try {
    const socio = await Socio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!socio) return res.status(404).json({ message: "Socio no encontrado" });
    res.status(200).json(socio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSocio = async (req, res) => {
  try {
    const socio = await Socio.findByIdAndDelete(req.params.id);
    if (!socio) return res.status(404).json({ message: "Socio no encontrado" });
    res.status(200).json({ message: "Socio eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const methods = { createSocio, getSocios, getSocioById, updateSocio, deleteSocio };
