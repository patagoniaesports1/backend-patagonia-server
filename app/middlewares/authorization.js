import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";
 // Importa el modelo de usuario

dotenv.config();

async function soloAdmin(req, res, next) {
  const logueado = await revisarCookie(req);
  if (logueado) return next();
  return res.redirect("/");
}

async function soloPublico(req, res, next) {
  const logueado = await revisarCookie(req);
  if (!logueado) return next();
  return res.redirect("/admin");
}

async function revisarCookie(req) {
  try {
    const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
    const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
    const usuarioAResvisar = await User.findOne({ user: decodificada.user });
    return !!usuarioAResvisar;
  } catch (error) {
    return false;
  }
}

export const methods = {
  soloAdmin,
  soloPublico,
};
