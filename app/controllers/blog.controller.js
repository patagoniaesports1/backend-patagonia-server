import Blog from "../models/blog.js";
 
 export async function createBlog(req, res) {
   try {
     const newBlog = new Blog(req.body);
     await newBlog.save();
     res.status(201).send({ status: "ok", message: "Blog creado con éxito", blog: newBlog });
   } catch (error) {
     res.status(400).send({ status: "Error", message: "Error al crear blog", error });
   }
 }
 
 export async function getBlogs(req, res) {
   try {
     const blogs = await Blog.find();
     res.status(200).send(blogs);
   } catch (error) {
     res.status(500).send({ status: "Error", message: "Error al obtener blogs", error });
   }
 }
 
 export async function getBlog(req, res) {
   try {
     const blog = await Blog.findById(req.params.id);
     if (!blog) {
       return res.status(404).send({ status: "Error", message: "Blog no encontrado" });
     }
     res.status(200).send(blog);
   } catch (error) {
     res.status(500).send({ status: "Error", message: "Error al obtener blog", error });
   }
 }
 
 export async function updateBlog(req, res) {
   try {
     const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
     if (!blog) {
       return res.status(404).send({ status: "Error", message: "Blog no encontrado" });
     }
     res.status(200).send({ status: "ok", message: "Blog actualizado", blog });
   } catch (error) {
     res.status(400).send({ status: "Error", message: "Error al actualizar blog", error });
   }
 }
 
 export async function deleteBlog(req, res) {
   try {
     const blog = await Blog.findByIdAndDelete(req.params.id);
     if (!blog) {
       return res.status(404).send({ status: "Error", message: "Blog no encontrado" });
     }
     res.status(200).send({ status: "ok", message: "Blog eliminado" });
   } catch (error) {
     res.status(500).send({ status: "Error", message: "Error al eliminar blog", error });
   }
 }
 
 export const methods = {
   createBlog,
   getBlogs,
   getBlog,
   updateBlog,
   deleteBlog
 };