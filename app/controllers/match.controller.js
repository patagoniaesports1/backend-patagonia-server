import Match from "../models/match.js";
 
 export async function createMatch(req, res) {
   try {
     const newMatch = new Match(req.body);
     await newMatch.save();
     res.status(201).send({ status: "ok", message: "Partido creado con éxito", match: newMatch });
   } catch (error) {
     res.status(400).send({ status: "Error", message: "Error al crear partido", error });
   }
 }
 
 export async function getMatches(req, res) {
   try {
     const matches = await Match.find();
     res.status(200).send(matches);
   } catch (error) {
     res.status(500).send({ status: "Error", message: "Error al obtener partidos", error });
   }
 }
 
 export async function getMatch(req, res) {
   try {
     const match = await Match.findById(req.params.id);
     if (!match) {
       return res.status(404).send({ status: "Error", message: "Partido no encontrado" });
     }
     res.status(200).send(match);
   } catch (error) {
     res.status(500).send({ status: "Error", message: "Error al obtener partido", error });
   }
 }
 
 export async function updateMatch(req, res) {
   try {
     const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
     if (!match) {
       return res.status(404).send({ status: "Error", message: "Partido no encontrado" });
     }
     res.status(200).send({ status: "ok", message: "Partido actualizado", match });
   } catch (error) {
     res.status(400).send({ status: "Error", message: "Error al actualizar partido", error });
   }
 }
 
 export async function deleteMatch(req, res) {
   try {
     const match = await Match.findByIdAndDelete(req.params.id);
     if (!match) {
       return res.status(404).send({ status: "Error", message: "Partido no encontrado" });
     }
     res.status(200).send({ status: "ok", message: "Partido eliminado" });
   } catch (error) {
     res.status(500).send({ status: "Error", message: "Error al eliminar partido", error });
   }
 }
 
 export const methods = {
   createMatch,
   getMatches,
   getMatch,
   updateMatch,
   deleteMatch
 };