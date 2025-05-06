document.getElementById('blogForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar el envío de formulario tradicional
    
    // Recopilar datos del formulario
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').value;

    try {
        // Hacer la solicitud POST a la API
        const response = await fetch('https://backend-patagonia-server.vercel.app/api/blogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, image })
        });

        const data = await response.json();

        // Mostrar el mensaje de éxito o error
        if (response.ok) {
            document.getElementById('responseMessage').textContent = `Post creado con éxito: ${data.message}`;
        } else {
            document.getElementById('responseMessage').textContent = `Error: ${data.message}`;
        }
    } catch (error) {
        document.getElementById('responseMessage').textContent = `Error al conectarse a la API: ${error.message}`;
    }
});