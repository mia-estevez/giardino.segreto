
const listaFavoritos = document.getElementById("lista-favoritos");
const contadorFavoritos = document.getElementById("contador-favoritos");
const favoritosVacios = document.getElementById("favoritos-vacios");

const usuario = JSON.parse(localStorage.getItem("usuario"));

// VERIFICAR QUE SEA UN CLIENTE
if (!usuario || usuario.rol !== "comprador") {
    alert("Esta sección es exclusiva para clientes.");
    window.location.replace("productos.html");
} else {
    mostrarFavoritos();
}

// MOSTRAR FAVORITOS
async function mostrarFavoritos() {
    try {
        const respuesta = await fetch(
            `http://localhost:3000/favoritos/${usuario.id}`
        );

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los favoritos");
        }

        const favoritos = await respuesta.json();

        listaFavoritos.innerHTML = "";

        // ACTUALIZAR CONTADOR
        const cantidad = favoritos.length;

        contadorFavoritos.textContent =
            cantidad === 1
                ? "1 producto guardado"
                : `${cantidad} productos guardados`;

        // VERIFICAR SI ESTÁ VACÍO
        if (cantidad === 0) {
            favoritosVacios.style.display = "block";
            return;
        }

        favoritosVacios.style.display = "none";

        // RECORRER FAVORITOS
        favoritos.forEach(producto => {

            const tarjeta = document.createElement("article");
            tarjeta.classList.add("card-favorito");
            tarjeta.dataset.id = producto.id;

            // IMAGEN / ICONO DEL PRODUCTO
            const imagenBox = document.createElement("div");
            imagenBox.classList.add("card-img-box");

            const icono = document.createElement("span");
            icono.classList.add(
                "material-symbols-outlined",
                "icono-producto-favorito"
            );
            icono.textContent = "local_florist";

            imagenBox.appendChild(icono);

            // BOTÓN QUITAR FAVORITO
            const botonQuitar = document.createElement("button");
            botonQuitar.type = "button";
            botonQuitar.classList.add("btn-quitar-fav");
            botonQuitar.title = "Quitar de favoritos";

            botonQuitar.innerHTML = `
                <span class="material-symbols-outlined">favorite</span>
            `;

            imagenBox.appendChild(botonQuitar);

            // CONTENIDO
            const contenido = document.createElement("div");
            contenido.classList.add("card-contenido");

            const categoria = document.createElement("span");
            categoria.classList.add("categoria-tag");
            categoria.textContent = "Producto floral";

            const titulo = document.createElement("h3");
            titulo.textContent = producto.nombre;

            const descripcion = document.createElement("p");
            descripcion.textContent = producto.descripcion;

            const pie = document.createElement("div");
            pie.classList.add("card-pie");

            const precio = document.createElement("span");
            precio.classList.add("precio");
            precio.textContent =
                `$${Number(producto.precio).toLocaleString("es-AR")}`;

            const botonCarrito = document.createElement("a");
            botonCarrito.href = "carrito.html";
            botonCarrito.classList.add("btn-carrito");

            botonCarrito.innerHTML = `
                <span class="material-symbols-outlined">shopping_bag</span>
                Agregar
            `;

            pie.appendChild(precio);
            pie.appendChild(botonCarrito);

            contenido.appendChild(categoria);
            contenido.appendChild(titulo);
            contenido.appendChild(descripcion);
            contenido.appendChild(pie);

            tarjeta.appendChild(imagenBox);
            tarjeta.appendChild(contenido);

            listaFavoritos.appendChild(tarjeta);

            // QUITAR DE FAVORITOS
            botonQuitar.addEventListener("click", async () => {

                try {
                    const respuesta = await fetch(
                        `http://localhost:3000/favoritos/${usuario.id}/${producto.id}`,
                        {
                            method: "DELETE"
                        }
                    );

                    const datos = await respuesta.json();

                    if (!respuesta.ok) {
                        throw new Error(
                            datos.error || "No se pudo quitar el favorito"
                        );
                    }

                    // ACTUALIZAR LA LISTA DESDE LA BASE DE DATOS
                    await mostrarFavoritos();

                } catch (error) {
                    console.error("Error al quitar favorito:", error);
                    alert(error.message);
                }
            });
        });

    } catch (error) {
        console.error("Error al mostrar favoritos:", error);

        contadorFavoritos.textContent = "Error al cargar favoritos";

        listaFavoritos.innerHTML = `
            <p class="mensaje-productos">
                No se pudieron cargar tus favoritos.
                Intentá nuevamente más tarde.
            </p>
        `;
    }
}
