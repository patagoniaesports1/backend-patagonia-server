import express from "express";
import { methods as socioController } from "../controllers/socio.controller.js";

const router = express.Router();

router.post("/socios", socioController.createSocio);
router.get("/socios", socioController.getSocios);
router.get("/socios/:id", socioController.getSocioById);
router.put("/socios/:id", socioController.updateSocio);
router.delete("/socios/:id", socioController.deleteSocio);

export default router;
