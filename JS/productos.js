
const contenedorProductos = document.getElementById("contenedor-productos");

const usuario = JSON.parse(localStorage.getItem("usuario"));

// MOSTRAR PRODUCTOS
async function mostrarProductos() {

    if (!contenedorProductos) {
        console.error("No se encontró el contenedor de productos");
        return;
    }

    try {
        const resultado = await fetch("http://localhost:3000/producto");

        if (!resultado.ok) {
            throw new Error("Error al consultar los productos");
        }

        const productos = await resultado.json();

        // CONSULTAR FAVORITOS
        let favoritos = [];

        if (usuario && usuario.rol === "comprador") {

            const respuestaFavoritos = await fetch(
                `http://localhost:3000/favoritos/${usuario.id}`
            );

            if (!respuestaFavoritos.ok) {
                throw new Error("No se pudieron consultar los favoritos");
            }

            favoritos = await respuestaFavoritos.json();
        }

        contenedorProductos.innerHTML = "";

        if (productos.length === 0) {
            contenedorProductos.innerHTML = `
                <p class="mensaje-productos">
                    Todavía no hay productos disponibles.
                </p>
            `;
            return;
        }

        // RECORRER PRODUCTOS
        productos.forEach(producto => {

            const tarjeta = document.createElement("div");
            tarjeta.classList.add("card-variedad");

            // VERIFICAR SI ES FAVORITO
            const esFavorito = favoritos.some(
                favorito => Number(favorito.id) === Number(producto.id)
            );

            // BOTÓN FAVORITOS
            const botonFavorito = document.createElement("button");

            botonFavorito.type = "button";
            botonFavorito.classList.add("btn-fav-flotante");
            botonFavorito.title = "Guardar en favoritos";

            if (esFavorito) {
                botonFavorito.classList.add("favorito-activo");
                botonFavorito.title = "Quitar de favoritos";
            }

            botonFavorito.innerHTML = `
                <span class="material-symbols-outlined">favorite</span>
            `;

            // GUARDAR O QUITAR FAVORITO
            botonFavorito.addEventListener("click", async () => {

                if (!usuario || usuario.rol !== "comprador") {
                    alert("Iniciá sesión como comprador para guardar favoritos.");
                    return;
                }

                try {

                    if (botonFavorito.classList.contains("favorito-activo")) {

                        const respuesta = await fetch(
                            `http://localhost:3000/favoritos/${usuario.id}/${producto.id}`,
                            {
                                method: "DELETE"
                            }
                        );

                        const datos = await respuesta.json();

                        if (!respuesta.ok) {
                            throw new Error(datos.error || "No se pudo quitar el favorito");
                        }

                        botonFavorito.classList.remove("favorito-activo");
                        botonFavorito.title = "Guardar en favoritos";

                        alert("Producto eliminado de favoritos");

                    } else {

                        const respuesta = await fetch(
                            "http://localhost:3000/favoritos",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    id_usuario: usuario.id,
                                    id_producto: producto.id
                                })
                            }
                        );

                        const datos = await respuesta.json();

                        if (!respuesta.ok) {
                            throw new Error(datos.error || "No se pudo guardar el favorito");
                        }

                        botonFavorito.classList.add("favorito-activo");
                        botonFavorito.title = "Quitar de favoritos";

                        alert("¡Producto agregado a favoritos!");
                    }

                } catch (error) {
                    console.error("Error con favoritos:", error);
                    alert(error.message);
                }
            });

            // CONTENIDO DE LA TARJETA
            const contenido = document.createElement("div");

            const icono = document.createElement("span");
            icono.classList.add("emoji-flor");
            icono.textContent = "🌷";

            const titulo = document.createElement("h3");
            titulo.textContent = producto.nombre;

            const descripcion = document.createElement("p");
            descripcion.textContent = producto.descripcion;

            const informacion = document.createElement("div");
            informacion.classList.add("info-producto");

            const precio = document.createElement("span");
            precio.classList.add("precio-producto");
            precio.textContent =
                `$${Number(producto.precio).toLocaleString("es-AR")}`;

            const stock = document.createElement("span");
            stock.classList.add("stock-producto");
            stock.textContent = `${producto.stock} disponibles`;

            informacion.appendChild(precio);
            informacion.appendChild(stock);

            contenido.appendChild(icono);
            contenido.appendChild(titulo);
            contenido.appendChild(descripcion);
            contenido.appendChild(informacion);

            // BOTÓN AGREGAR AL CARRITO
            const botonCarrito = document.createElement("button");

            botonCarrito.type = "button";
            botonCarrito.classList.add("btn-consultar-chico");
            botonCarrito.textContent = "Agregar al Carrito";

            botonCarrito.addEventListener("click", async () => {

                if (!usuario || usuario.rol !== "comprador") {
                    alert("Iniciá sesión como comprador para realizar compras.");
                    return;
                }

                if (Number(producto.stock) < 1) {
                    alert("Este producto no tiene stock disponible.");
                    return;
                }

                try {

                    const respuesta = await fetch(
                        "http://localhost:3000/carrito",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                id_usuario: usuario.id,
                                id_producto: producto.id,
                                cantidad: 1
                            })
                        }
                    );

                    const datos = await respuesta.json();

                    if (!respuesta.ok) {
                        throw new Error(
                            datos.error || "No se pudo agregar el producto"
                        );
                    }

                    alert("¡Producto agregado al carrito!");

                } catch (error) {
                    console.error("Error al agregar al carrito:", error);
                    alert(error.message);
                }
            });

            // ARMAR TARJETA
            tarjeta.appendChild(botonFavorito);
            tarjeta.appendChild(contenido);
            tarjeta.appendChild(botonCarrito);

            contenedorProductos.appendChild(tarjeta);
        });

    } catch (error) {

        console.error("Error al mostrar productos:", error);

        contenedorProductos.innerHTML = `
            <p class="mensaje-productos">
                No se pudieron cargar los productos.
                Intentá nuevamente más tarde.
            </p>
        `;
    }
}

// EJECUTAR
mostrarProductos();
