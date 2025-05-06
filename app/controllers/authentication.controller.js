import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";


dotenv.config();

export async function login(req, res) {
  const { user, password } = req.body;

  if (!user || !password) {
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
  }

  // Buscar usuario en la base de datos
  const usuarioAResvisar = await User.findOne({ user });
  if (!usuarioAResvisar) {
    return res.status(400).send({ status: "Error", message: "Error durante login" });
  }

  const loginCorrecto = await bcryptjs.compare(password, usuarioAResvisar.password);
  if (!loginCorrecto) {
    return res.status(400).send({ status: "Error", message: "Error durante login" });
  }

  const token = jsonwebtoken.sign(
    { user: usuarioAResvisar.user },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );

  const cookieOption = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    path: "/"
  };
  res.cookie("jwt", token, cookieOption);
  res.send({ status: "ok", message: "Usuario loggeado", redirect: "/admin" });
}

export async function register(req, res) {
  const { user, password, email } = req.body;

  if (!user || !password || !email) {
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
  }

  const usuarioAResvisar = await User.findOne({ user });
  if (usuarioAResvisar) {
    return res.status(400).send({ status: "Error", message: "Este usuario ya existe" });
  }

  const salt = await bcryptjs.genSalt(5);
  const hashPassword = await bcryptjs.hash(password, salt);

  const nuevoUsuario = new User({
    user,
    email,
    password: hashPassword,
  });

  await nuevoUsuario.save();
  return res.status(201).send({ status: "ok", message: `Usuario ${nuevoUsuario.user} agregado`, redirect: "/" });
}

export const methods = {
  login,
  register,
};
