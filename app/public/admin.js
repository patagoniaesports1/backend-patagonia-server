
// Evento de envío del formulario para crear un partido
document.getElementById("createMatchForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("Evento submit capturado"); // Para depuración

  const formData = new FormData(e.target);
  const fecha = new Date(formData.get("fecha")).toISOString();

  const matchData = {
    fecha: fecha,
    descripcion: formData.get("descripcion"),
    juego: formData.get("juego"),
    equipo1: {
      nombre_completo: formData.get("equipo1_nombre_completo"),
      abreviacion: formData.get("equipo1_abreviacion"),
      img_logo: formData.get("equipo1_img_logo"),
    },
    equipo2: {
      nombre_completo: formData.get("equipo2_nombre_completo"),
      abreviacion: formData.get("equipo2_abreviacion"),
      img_logo: formData.get("equipo2_img_logo"),
    },
    formato: formData.get("formato"),
    resultado: formData.get("resultado"),
  };

  console.log("Datos que se enviarán:", matchData);

  try {
    const response = await fetch("https://backend-patagonia-server.vercel.app/api/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(matchData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error del servidor:", errorData);
      alert(`Error al crear partido: ${errorData.message || response.status}`);
      return;
    }

    const result = await response.json();
    console.log("Partido creado:", result);
    alert("Partido creado con éxito");
  } catch (error) {
    console.error("Error al conectar con la API:", error);
    alert("Error al conectar con la API");
  }
});
