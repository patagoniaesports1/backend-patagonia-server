import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

// Fix para __dirname
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Importar controladores y middlewares
import { methods as authentication } from "./controllers/authentication.controller.js";
import { methods as authorization } from "./middlewares/authorization.js";
import { methods as matchController } from "./controllers/match.controller.js";
import { methods as blogController } from "./controllers/blog.controller.js";

import socioRoutes from "./routes/socio.routes.js";

dotenv.config();

// Inicializar el servidor
const app = express();
app.set("port", process.env.PORT || 4000);

// Configuración de middlewares
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch(error => console.error("Error al conectar a MongoDB Atlas:", error));

// Rutas
app.get("/", authorization.soloPublico, (req, res) => res.sendFile(path.join(__dirname, "pages", "login.html")));
app.get("/register", authorization.soloAdmin, (req, res) => res.sendFile(path.join(__dirname, "pages", "register.html")));
app.get("/admin", authorization.soloAdmin, (req, res) => res.sendFile(path.join(__dirname, "pages", "admin", "admin.html")));
app.get("/calendario", authorization.soloAdmin, (req, res) => res.sendFile(path.join(__dirname, "pages", "admin", "calendario.html")));

app.get("/blog", authorization.soloAdmin, (req, res) => res.sendFile(path.join(__dirname, "pages", "admin", "blog.html")));
app.get("/blogs", authorization.soloAdmin, (req, res) => res.sendFile(path.join(__dirname, "pages", "admin", "blogs.html")));


app.post("/api/login", authentication.login);
app.post("/api/register", authentication.register);

app.post("/api/matches",authorization.soloAdmin, matchController.createMatch);       // Crear un partido
app.get("/api/matches", matchController.getMatches);          // Obtener todos los partidos
app.get("/api/matches/:id", matchController.getMatch);        // Obtener un partido específico
app.put("/api/matches/:id",authorization.soloAdmin, matchController.updateMatch);     // Actualizar un partido
app.delete("/api/matches/:id",authorization.soloAdmin, matchController.deleteMatch);  // Eliminar un partido



app.post("/api/blogs",authorization.soloAdmin, blogController.createBlog);
app.get("/api/blogs", blogController.getBlogs);
app.get("/api/blogs/:id", blogController.getBlog);
app.put("/api/blogs/:id",authorization.soloAdmin, blogController.updateBlog);
app.delete("/api/blogs/:id",authorization.soloAdmin, blogController.deleteBlog);



app.use("/api", socioRoutes);


 
// Iniciar el servidor
app.listen(app.get("port"), () => {
  console.log("Servidor corriendo en puerto", app.get("port"));
});
