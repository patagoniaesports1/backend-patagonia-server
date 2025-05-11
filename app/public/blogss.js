// Elementos del DOM
const blogContainer = document.getElementById('blogContainer');
const updateFormContainer = document.getElementById('updateFormContainer');
const updateForm = document.getElementById('updateForm');
const updateTitle = document.getElementById('updateTitle');
const updateDescription = document.getElementById('updateDescription');
const updateImage = document.getElementById('updateImage');
let currentBlogId = null;

// URL base de la API (usa la misma en todas las llamadas)
const API_BASE_URL = 'https://sportpatagonia-server.vercel.app/api/blogs';

// Función para escapar caracteres especiales en HTML
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Cargar y mostrar todos los blogs
async function fetchBlogs() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Error al cargar blogs');
        const blogs = await response.json();
        
        blogContainer.innerHTML = '';
        blogs.forEach(blog => {
            const blogElement = document.createElement('div');
            blogElement.classList.add('blog');
            blogElement.innerHTML = `
                <h2>${escapeHtml(blog.title)}</h2>
                <p>${escapeHtml(blog.description)}</p>
                <img src="${escapeHtml(blog.image)}" alt="Imagen del blog" style="max-width:100%; height:auto;">
                <p>Fecha de Subida: ${new Date(blog.uploadDate).toLocaleDateString()}</p>
                <button class="update-btn" data-id="${escapeHtml(blog._id)}">Actualizar</button>
                <button class="delete-btn" data-id="${escapeHtml(blog._id)}">Borrar</button>
            `;
            blogContainer.appendChild(blogElement);
        });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        alert("Error al cargar los blogs: " + error.message);
    }
}

// Mostrar formulario de actualización
function showUpdateForm(blog) {
    currentBlogId = blog._id;
    updateTitle.value = blog.title;
    updateDescription.value = blog.description;
    updateImage.value = blog.image;
    updateFormContainer.style.display = 'block';
}

// Manejador de eventos para los botones
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        if (confirm('¿Estás seguro de que quieres borrar este blog?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/${e.target.dataset.id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) throw new Error('Error al borrar');
                await fetchBlogs();
            } catch (error) {
                console.error("Error deleting blog:", error);
                alert("Error al borrar el blog: " + error.message);
            }
        }
    }
    
    if (e.target.classList.contains('update-btn')) {
        try {
            const response = await fetch(`${API_BASE_URL}/${e.target.dataset.id}`);
            if (!response.ok) throw new Error('Error al cargar blog');
            const blog = await response.json();
            showUpdateForm(blog);
        } catch (error) {
            console.error("Error loading blog for update:", error);
            alert("Error al cargar el blog para editar: " + error.message);
        }
    }
});

// Enviar actualización del blog
updateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const updatedBlog = {
            title: updateTitle.value,
            description: updateDescription.value,
            image: updateImage.value
        };
        
        const response = await fetch(`${API_BASE_URL}/${currentBlogId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedBlog)
        });
        
        if (!response.ok) throw new Error('Error al actualizar');
        
        updateFormContainer.style.display = 'none';
        await fetchBlogs();
    } catch (error) {
        console.error("Error updating blog:", error);
        alert("Error al actualizar el blog: " + error.message);
    }
});

// Cargar blogs al inicio
document.addEventListener('DOMContentLoaded', fetchBlogs);