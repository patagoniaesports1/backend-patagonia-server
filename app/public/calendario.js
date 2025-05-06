const menuBtn = document.querySelector('.menu-btn');
const navMenu1 = document.getElementById('nav-menu1');
const navMenu2 = document.getElementById('nav-menu2');

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active'); // Cambia la apariencia del botón
    navMenu1.classList.toggle('active'); // Muestra el menú
    navMenu2.classList.toggle('active'); // Muestra el segundo menú
});
// Declarar matchesData fuera de DOMContentLoaded para hacerlo global
let matchesData = [];

document.addEventListener('DOMContentLoaded', () => {

    // Cambiar la URL de 'matches.json' a la API local
    fetch('https://backend-patagonia-server.vercel.app/api/matches')
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar los datos");
            }
            return response.json();
        })
        .then(matches => {
            matchesData = matches;
            renderMatches(matchesData); // Renderizar todos los partidos inicialmente
        })
        .catch(error => {
            console.error("Error:", error);
        });

    document.querySelectorAll('.months span').forEach(monthElement => {
        monthElement.addEventListener('click', () => {
            const month = monthElement.getAttribute('data-month');
            if (month === 'all') {
                renderMatches(matchesData); // Mostrar todos los partidos
            } else {
                filterMatchesByMonth(parseInt(month, 10)); // Filtrar por mes específico
            }
        });
    });
});



function renderMatches(matches) {
    const container = document.getElementById('matches');
    container.innerHTML = '';

    matches.forEach(match => {
        console.log(match);
        const matchDate = new Date(match.fecha);
        let formattedDate = matchDate.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Eliminar la coma entre la fecha y la hora
        formattedDate = formattedDate.replace(',', '');

        // Definir la imagen del juego en función del valor de `juego`
        let gameLogo = '';
        switch (match.juego) {
            case 'lol':
                gameLogo = 'img/lol.svg';
                break;
            case 'valorant':
                gameLogo = 'img/valorant/V_Lockup_Vertical_Off-White.png';
                break;
            case 'csgo2':
            default:
                gameLogo = 'img/logo_cs2.png';
                break;
        }

        const card = document.createElement('div');
        card.classList.add('match-card');

        card.innerHTML = `
            <div class="match-tittle">
                <img class="logo-lol" src="${gameLogo}" alt="${match.juego} Logo">
                <div class="match-tittle2">
                    <h3 class="date">${formattedDate}</h3>
                    <p class="match-description">${match.descripcion}</p>
                </div>
            </div>
            <div class="match-info">
                <div class="team">
                    <img src="${match.equipo1.img_logo}" alt="${match.equipo1.nombre_completo} Logo" class="team-logo">
                    <div><p class="team-abbr">${match.equipo1.abreviacion}</p> <p class="team-nc"> ${match.equipo1.nombre_completo} </p></div>
                </div>
                <div class="result">
                    <div class="format">${match.formato}</div>
                    ${match.resultado}
                </div>
                <div class="team">
                    <div class="team2"><p class="team-abbr">${match.equipo2.abreviacion}</p> <p class="team-nc"> ${match.equipo2.nombre_completo} </p></div>
                    <img src="${match.equipo2.img_logo}" alt="${match.equipo2.nombre_completo} Logo" class="team-logo2">
                </div>
            </div>
            <button class="update-button" data-id="${match._id}">Actualizar</button>
            <button class="delete-btn">BORRAR</button>
            
        `;
        card.querySelector('.delete-btn').addEventListener('click', () => deleteMatch(match._id, card));
        container.appendChild(card);
    });

    // Añadir evento a cada botón de actualización
    document.querySelectorAll('.update-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const matchId = e.target.getAttribute('data-id');
            showUpdateForm(matchId);
        });
    });
}
function deleteMatch(id, cardElement) {
    fetch(`https://sportpatagonia-server.vercel.app/api/matches/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al borrar el partido");
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message);
        cardElement.remove(); // Elimina la tarjeta del DOM
    })
    .catch(error => {
        console.error("Error:", error);
    });
}
function showUpdateForm(matchId) {
    // Cargar datos del partido seleccionado
    const match = matchesData.find(m => m._id === matchId);

    // Crear el formulario de actualización con los datos actuales
    const formContainer = document.createElement('div');
    formContainer.classList.add('update-form-container');
    formContainer.innerHTML = `
        <h3>Actualizar Partido</h3>
        <form id="updateMatchForm">
            <label>Descripción:</label>
            <input type="text" name="descripcion" value="${match.descripcion}" required>
            
            <label>Fecha y Hora:</label>
            <input type="datetime-local" name="fecha" value="${new Date(match.fecha).toISOString().slice(0, 16)}" required>
            
            <label>Juego:</label>
            <select name="juego" required>
                <option value="csgo2" ${match.juego === 'csgo2' ? 'selected' : ''}>CSGO2</option>
                <option value="lol" ${match.juego === 'lol' ? 'selected' : ''}>LoL</option>
                <option value="valorant" ${match.juego === 'valorant' ? 'selected' : ''}>Valorant</option>
            </select>

            <label>Formato:</label>
            <select name="formato" required>
                <option value="BO1" ${match.formato === 'BO1' ? 'selected' : ''}>BO1</option>
                <option value="BO3" ${match.formato === 'BO3' ? 'selected' : ''}>BO3</option>
                <option value="BO5" ${match.formato === 'BO5' ? 'selected' : ''}>BO5</option>
            </select>

            <fieldset>
                <legend>Equipo 1</legend>
                <label>Nombre completo:</label>
                <input type="text" name="equipo1[nombre_completo]" value="${match.equipo1.nombre_completo}" required>
                
                <label>Abreviación:</label>
                <input type="text" name="equipo1[abreviacion]" value="${match.equipo1.abreviacion}" required>
                
                <label>URL del logo:</label>
                <input type="text" name="equipo1[img_logo]" value="${match.equipo1.img_logo}" required>
            </fieldset>

            <fieldset>
                <legend>Equipo 2</legend>
                <label>Nombre completo:</label>
                <input type="text" name="equipo2[nombre_completo]" value="${match.equipo2.nombre_completo}" required>
                
                <label>Abreviación:</label>
                <input type="text" name="equipo2[abreviacion]" value="${match.equipo2.abreviacion}" required>
                
                <label>URL del logo:</label>
                <input type="text" name="equipo2[img_logo]" value="${match.equipo2.img_logo}" required>
            </fieldset>

            <label>Resultado:</label>
            <input type="text" name="resultado" value="${match.resultado}" required>

            <button type="submit">Guardar Cambios</button>
            <button type="button" onclick="closeUpdateForm()">Cancelar</button>
        </form>
    `;

    document.body.appendChild(formContainer);

    // Manejar el envío del formulario
    document.getElementById('updateMatchForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        // Ajustar la fecha y hora al formato ISO
        const fechaInput = formData.get("fecha");
        const fecha = new Date(fechaInput).toISOString();

        // Construir el objeto con los datos anidados
        const updatedData = {
            fecha: fecha,
            descripcion: formData.get("descripcion"),
            juego: formData.get("juego"),
            formato: formData.get("formato"),
            equipo1: {
                nombre_completo: formData.get("equipo1[nombre_completo]"),
                abreviacion: formData.get("equipo1[abreviacion]"),
                img_logo: formData.get("equipo1[img_logo]")
            },
            equipo2: {
                nombre_completo: formData.get("equipo2[nombre_completo]"),
                abreviacion: formData.get("equipo2[abreviacion]"),
                img_logo: formData.get("equipo2[img_logo]")
            },
            resultado: formData.get("resultado")
        };

        try {
            const response = await fetch(`https://sportpatagonia-server.vercel.app/api/matches/${matchId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });
            const result = await response.json();
            console.log(result);
            alert("Partido actualizado");
            closeUpdateForm();
            fetch('https://sportpatagonia-server.vercel.app/api/matches')
                .then(response => response.json())
                .then(data => {
                    matchesData = data; // Actualizar el array global
                    renderMatches(matchesData); // Renderizar la lista actualizada
                })
                .catch(error => console.error("Error al recargar los partidos:", error));
             // Actualizar la lista de partidos
        } catch (error) {
            console.error("Error al actualizar partido:", error);
        }
    });
}

function closeUpdateForm() {
    const formContainer = document.querySelector('.update-form-container');
    if (formContainer) formContainer.remove();
}
