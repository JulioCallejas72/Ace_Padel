// Esperamos a que toda la estructura HTML de la página esté cargada antes de ejecutar cualquier función
document.addEventListener("DOMContentLoaded", () => {
    
    // ==============================================================
    // 1. SISTEMA DE NAVEGACIÓN POR PESTAÑAS (TABS)
    // ==============================================================
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.tab-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Evita que la página salte al hacer clic
            
            // Quita la clase 'active' (línea amarilla) de todos los enlaces y se la pone al seleccionado
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Oculta todas las secciones de la página
            sections.forEach(sec => sec.classList.remove('active-tab'));
            
            // Muestra solo la sección que corresponde al enlace seleccionado
            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active-tab');

            // Sube la pantalla suavemente al inicio de la página
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // ==============================================================
    // 2. CARRUSEL AUTOMÁTICO DE IMÁGENES (SECCIÓN INICIO)
    // Cambia la imagen cada 5 segundos (5000 milisegundos)
    // ==============================================================
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0; // Lleva la cuenta de qué imagen se está mostrando (0 es la primera)

    if (slides.length > 0) {
        // setInterval ejecuta una función repetidamente cada cierto tiempo
        setInterval(() => {
            // Le quitamos la clase 'active' (que la hace visible) a la imagen actual
            slides[currentSlide].classList.remove('active');
            
            // Calculamos cuál es la siguiente imagen. El '%' hace que vuelva a 0 si llega a la última
            currentSlide = (currentSlide + 1) % slides.length;
            
            // Le ponemos la clase 'active' a la nueva imagen para mostrarla
            slides[currentSlide].classList.add('active');
        }, 5000); // 5000 ms = 5 segundos
    }

    // ==============================================================
    // 3. ENVÍO DE MENSAJE DE CONTACTO GENERAL A WHATSAPP (CONÓCENOS)
    // ==============================================================
    const formContactoWA = document.getElementById("contact-form-whatsapp");
    
    if (formContactoWA) {
        formContactoWA.addEventListener("submit", (e) => {
            e.preventDefault(); // Evita que la página se recargue
            
            // Obtenemos los valores que el usuario escribió en las cajas de texto
            const nombre = document.getElementById("wa-nombre-contacto").value;
            const telefono = document.getElementById("wa-tel-contacto").value;
            const mensaje = document.getElementById("wa-mensaje-contacto").value;
            
            // Número de WhatsApp al que llegará el mensaje (Código de México 52 + Número)
            const numeroWA = "522284255456";
            
            // Construimos el mensaje predeterminado que aparecerá en el chat de WhatsApp
            const textoMensaje = `¡Hola ACE PADEL Xalapa! 👋%0A%0AMi nombre es: *${nombre}*%0AMi teléfono es: *${telefono}*%0A%0A*Mensaje:* ${mensaje}`;
            
            // Creamos el enlace de WhatsApp y lo abrimos en una nueva pestaña
            const urlWA = `https://wa.me/${numeroWA}?text=${textoMensaje}`;
            window.open(urlWA, '_blank');
            
            // Limpiamos el formulario después de enviarlo
            formContactoWA.reset();
        });
    }

    // ==============================================================
    // 4. MODAL Y SOLICITUD DE PAQUETE DE CLASES POR WHATSAPP (CLASES)
    // ==============================================================
    const modalClases = document.getElementById("modal-clases");
    const btnAbrirModalClases = document.getElementById("btn-solicitar-clase");
    const btnCerrarModalClases = document.getElementById("close-clases");
    const formClases = document.getElementById("form-solicitar-clases");

    // Abrir ventana modal de clases
    if (btnAbrirModalClases) {
        btnAbrirModalClases.addEventListener("click", () => {
            modalClases.style.display = "flex";
        });
    }

    // Cerrar ventana modal con la 'X'
    if (btnCerrarModalClases) {
        btnCerrarModalClases.addEventListener("click", () => {
            modalClases.style.display = "none";
        });
    }

    // Enviar formulario de solicitud de clases a WhatsApp
    if (formClases) {
        formClases.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Recopilamos la información seleccionada por el usuario
            const nivel = document.getElementById("req-nivel").value;
            const paquete = document.getElementById("req-paquete").value;
            const personas = document.getElementById("req-personas").value;
            const nombre = document.getElementById("req-nombre").value;
            const tel = document.getElementById("req-tel").value;

            const numeroWA = "522284255456";
            
            // Texto formateado con negritas (usando asteriscos) para WhatsApp
            const textoClases = `🎾 *NUEVA SOLICITUD DE CLASES - ACE PADEL* 🎾%0A%0A*Nombre:* ${nombre}%0A*Teléfono:* ${tel}%0A*Nivel de Juego:* ${nivel}%0A*Paquete de Interés:* ${paquete}%0A*Cantidad de Alumnos:* ${personas}%0A%0A¡Hola! Me gustaría recibir más información para agendar este paquete.`;
            
            // Redirigir a WhatsApp
            const urlWA = `https://wa.me/${numeroWA}?text=${textoClases}`;
            window.open(urlWA, '_blank');
            
            // Ocultar modal y limpiar formulario
            modalClases.style.display = "none";
            formClases.reset();
        });
    }

    // ==============================================================
    // 5. GALERÍA DE IMÁGENES INTERACTIVA (SERVICIOS)
    // ==============================================================
    const modalGaleria = document.getElementById("modal-galeria");
    const btnCerrarGaleria = document.getElementById("close-gallery");
    const imagenGaleriaHTML = document.getElementById("imagen-actual-galeria");
    const btnPrev = document.getElementById("btn-prev-img");
    const btnNext = document.getElementById("btn-next-img");

    let arrayImagenesActual = []; // Guardará temporalmente la lista de imágenes del servicio clicado
    let indiceImagenActiva = 0;   // Saber qué número de foto estamos viendo

    // AQUÍ ES DONDE AGREGAS O QUITAS IMÁGENES
    // Cada llave ("canchas", "cafeteria"...) corresponde al 'data-gallery' que pusimos en el HTML
    const bancoDeImagenes = {
        "canchas": [
            "Cancha_Padel1.jpg", 
            "Cancha_Padel2.jpg", // Solo separa con comas y pon el nombre del archivo
            "Cancha_Padel3.jpg"
        ],
        "equipo_renta": [
            "Equipo_Padel.jpg",
            "Palas_Renta2.jpg"
        ],
        "equipo_compra": [
            "ComEquipo.jpg",
            "Tienda_Interna.jpg"
        ],
        "cafeteria": [
            "Cafeteria.jpg",
            "Cafeteria_Menu.jpg"
        ],
        "clases_servicio": [
            "Clases_A.png",
            "Clases_Grupo.jpg"
        ]
    };

    // Detectamos el clic en cualquier tarjeta de servicio
    const tarjetasServicio = document.querySelectorAll(".clickable-service");
    
    tarjetasServicio.forEach(tarjeta => {
        tarjeta.addEventListener("click", () => {
            // Averiguamos qué categoría clicó el usuario obteniendo el data-gallery
            const categoria = tarjeta.getAttribute("data-gallery");
            
            // Verificamos si esa categoría existe en nuestro banco de imágenes
            if (bancoDeImagenes[categoria] && bancoDeImagenes[categoria].length > 0) {
                // Cargamos la lista de imágenes correspondientes
                arrayImagenesActual = bancoDeImagenes[categoria];
                indiceImagenActiva = 0; // Empezamos siempre por la primera imagen (posición 0)
                
                // Ponemos la ruta de la primera imagen en la etiqueta <img> del modal
                imagenGaleriaHTML.src = arrayImagenesActual[indiceImagenActiva];
                
                // Mostramos el modal de la galería
                modalGaleria.style.display = "flex";
            } else {
                alert("Próximamente agregaremos la galería para esta sección.");
            }
        });
    });

    // Cerrar la galería al pulsar la X
    if (btnCerrarGaleria) {
        btnCerrarGaleria.addEventListener("click", () => {
            modalGaleria.style.display = "none";
        });
    }

    // Funcionalidad: Botón Siguiente Imagen (Flecha Derecha)
    if (btnNext) {
        btnNext.addEventListener("click", () => {
            // Avanzamos uno, si llega al final, regresa al principio por el '%'
            indiceImagenActiva = (indiceImagenActiva + 1) % arrayImagenesActual.length;
            imagenGaleriaHTML.src = arrayImagenesActual[indiceImagenActiva];
        });
    }

    // Funcionalidad: Botón Imagen Anterior (Flecha Izquierda)
    if (btnPrev) {
        btnPrev.addEventListener("click", () => {
            // Retrocedemos uno, si estamos en el principio, saltamos a la última imagen
            indiceImagenActiva = (indiceImagenActiva - 1 + arrayImagenesActual.length) % arrayImagenesActual.length;
            imagenGaleriaHTML.src = arrayImagenesActual[indiceImagenActiva];
        });
    }

    // ==============================================================
    // 6. CERRAR MODALES HACIENDO CLIC AFUERA DE LA CAJA NEGRA
    // ==============================================================
    window.addEventListener("click", (e) => {
        // Si el usuario hace clic exactamente en el fondo translúcido (overlay), se cierra el modal
        if (e.target === modalClases) {
            modalClases.style.display = "none";
        }
        if (e.target === modalGaleria) {
            modalGaleria.style.display = "none";
        }
    });
});
/*Aqui estara donde se va a redireccionar a las pag, al momento que le tome clic a boton de red social*/
// Selecciona todos los botones de la lista
            const botonesSociales = document.querySelectorAll('.wrapper .icon');

            // Asigna la acción de clic a cada uno de ellos
            botonesSociales.forEach(boton => {
                boton.addEventListener('click', function() {
                    // Obtiene el enlace personal del atributo data-url
                    const urlPersonal = this.getAttribute('data-url');
                    
                    if (urlPersonal) {
                        // Abre tu red social en una pestaña nueva de forma segura
                        window.open(urlPersonal, '_blank', 'noopener,noreferrer');
                    }
                });
            });