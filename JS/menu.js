
// CARGAR NAVBAR
async function cargarNavbar() {
    try {
        const respuesta = await fetch("componentes/navbar.html");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el navbar");
        }

        const htmlNavbar = await respuesta.text();

        document.body.insertAdjacentHTML("afterbegin", htmlNavbar);

        // Cargar estilos del navbar
        if (!document.querySelector('link[href="CSS/navbar.css"]')) {
            const estilos = document.createElement("link");
            estilos.rel = "stylesheet";
            estilos.href = "CSS/navbar.css";
            document.head.appendChild(estilos);
        }

        // Una vez cargado el HTML, generar el menú
        configurarMenu();

    } catch (error) {
        console.error("Error al cargar el navbar:", error);
    }
}


// CONFIGURAR MENÚ SEGÚN EL USUARIO
function configurarMenu() {

    const navMenu = document.getElementById("nav-menu");
    const botonMenu = document.querySelector(".menu-toggle");
    const submenu = document.querySelector(".submenu");

    const usuarioGuardado = localStorage.getItem("usuario");

    // Si no hay sesión iniciada, volver al login
    if (!usuarioGuardado) {
        window.location.replace("login.html");
        return;
    }

    try {
        const usuario = JSON.parse(usuarioGuardado);

        if (!usuario || !usuario.rol) {
            throw new Error("Usuario no válido");
        }

        // Crear enlaces
        function crearEnlace(texto, destino) {
            const li = document.createElement("li");
            li.classList.add("li1");

            const enlace = document.createElement("a");
            enlace.href = destino;
            enlace.textContent = texto;

            li.appendChild(enlace);
            return li;
        }

        // Crear apartado Nosotros
        function crearNosotros() {
            const li = document.createElement("li");
            li.classList.add("li1");

            const enlace = document.createElement("a");
            enlace.href = "index.html";
            enlace.textContent = "Nosotros";

            const sublista = document.createElement("ul");

            const opciones = [
                { texto: "Cuidados", destino: "cuidados.html" },
                { texto: "Asesoramiento", destino: "asesoramiento.html" }
            ];

            opciones.forEach(opcion => {
                const subli = document.createElement("li");
                subli.classList.add("li2");

                const icono = document.createElement("span");
                icono.classList.add("material-symbols-outlined");
                icono.textContent = "deceased";

                const subenlace = document.createElement("a");
                subenlace.href = opcion.destino;
                subenlace.textContent = opcion.texto;

                subli.appendChild(icono);
                subli.appendChild(subenlace);
                sublista.appendChild(subli);
            });

            li.appendChild(enlace);
            li.appendChild(sublista);

            return li;
        }

        // Opciones según el rol
        if (usuario.rol === "admin") {

            navMenu.appendChild(crearNosotros());
            navMenu.appendChild(crearEnlace("Productos", "productos.html"));
            navMenu.appendChild(crearEnlace("Catálogo", "catalogo.html"));

        } else if (usuario.rol === "comprador") {

            navMenu.appendChild(crearNosotros());
            navMenu.appendChild(crearEnlace("Productos", "productos.html"));
            navMenu.appendChild(crearEnlace("Favoritos", "favoritos.html"));
            navMenu.appendChild(crearEnlace("Carrito", "carrito.html"));

        } else {
            throw new Error("Rol de usuario no válido");
        }

        // Nombre del usuario
        const liUsuario = document.createElement("li");
        liUsuario.classList.add("li1", "usuario-menu");

        const nombreUsuario = document.createElement("span");
        nombreUsuario.classList.add("usuario-nombre");
        nombreUsuario.textContent = usuario.nombre;

        liUsuario.appendChild(nombreUsuario);
        navMenu.appendChild(liUsuario);

        // Cerrar sesión
        const liCerrarSesion = document.createElement("li");
        liCerrarSesion.classList.add("li1");

        const botonCerrarSesion = document.createElement("button");
        botonCerrarSesion.type = "button";
        botonCerrarSesion.classList.add("cerrar-sesion");
        botonCerrarSesion.textContent = "Cerrar sesión";

        botonCerrarSesion.addEventListener("click", function() {
            localStorage.removeItem("usuario");
            window.location.replace("login.html");
        });

        liCerrarSesion.appendChild(botonCerrarSesion);
        navMenu.appendChild(liCerrarSesion);

        // Menú hamburguesa
        botonMenu.addEventListener("click", function() {
            submenu.classList.toggle("activo");
        });

    } catch (error) {
        console.error("Error al configurar el menú:", error);
        localStorage.removeItem("usuario");
        window.location.replace("login.html");
    }
}


// INICIAR
cargarNavbar();
