const blogContainer = document.getElementById('blogContainer');
const updateFormContainer = document.getElementById('updateFormContainer');
const updateForm = document.getElementById('updateForm');
const updateTitle = document.getElementById('updateTitle');
const updateDescription = document.getElementById('updateDescription');
const updateImage = document.getElementById('updateImage');
let currentBlogId = null;

// Cargar y mostrar todos los blogs
async function fetchBlogs() {
    const response = await fetch('https://backend-patagonia-server.vercel.app/api/blogs');
    const blogs = await response.json();
    blogContainer.innerHTML = '';
    blogs.forEach(blog => {
        const blogElement = document.createElement('div');
        blogElement.classList.add('blog');
        blogElement.innerHTML = `
            <h2>${blog.title}</h2>
            <p>${blog.description}</p>
            <img src="${blog.image}" alt="Imagen del blog" style="max-width:100%; height:auto;">
            <p>Fecha de Subida: ${new Date(blog.uploadDate).toLocaleDateString()}</p>
            <button onclick="showUpdateForm('${blog._id}', '${blog.title}', '${blog.description}', '${blog.image}')">Actualizar</button>
            <button onclick="deleteBlog('${blog._id}')">Borrar</button>
        `;
        blogContainer.appendChild(blogElement);
    });
}

// Mostrar formulario de actualización
function showUpdateForm(id, title, description, image) {
    currentBlogId = id;
    updateTitle.value = title;
    updateDescription.value = description;
    updateImage.value = image;
    updateFormContainer.style.display = 'block';
}

// Enviar actualización del blog
updateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const updatedBlog = {
        title: updateTitle.value,
        description: updateDescription.value,
        image: updateImage.value
    };
    await fetch(`https://sportpatagonia-server.vercel.app/api/blogs/${currentBlogId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBlog)
    });
    updateFormContainer.style.display = 'none';
    fetchBlogs();
});

// Borrar un blog
async function deleteBlog(id) {
    await fetch(`https://sportpatagonia-server.vercel.app/api/blogs/${id}`, {
        method: 'DELETE'
    });
    fetchBlogs();
}

// Cargar blogs al inicio
fetchBlogs();
