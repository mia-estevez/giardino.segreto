
const usuario = JSON.parse(localStorage.getItem("usuario"));

const listaCarrito = document.getElementById("lista-carrito");
const carritoContenido = document.getElementById("carrito-contenido");
const carritoVacio = document.getElementById("carrito-vacio");

const subtotalCarrito = document.getElementById("subtotal-carrito");
const totalCarrito = document.getElementById("total-carrito");

const btnIrCheckout = document.getElementById("btn-ir-checkout");
const seccionCheckout = document.getElementById("seccion-checkout");
const btnVolverCarrito = document.getElementById("btn-volver-carrito");
const formCheckout = document.getElementById("form-checkout");
const seccionComprobante = document.getElementById("seccion-comprobante");

let productosCarrito = [];

// VERIFICAR USUARIO
if (!usuario || usuario.rol !== "comprador") {
    alert("El carrito es exclusivo para clientes.");
    window.location.replace("productos.html");
} else {
    mostrarCarrito();
}

// FORMATO DE PRECIOS
function formatoPrecio(precio) {
    return `$${Number(precio).toLocaleString("es-AR")}`;
}

// CONSULTAR CARRITO
async function mostrarCarrito() {

    try {
        const respuesta = await fetch(
            `http://localhost:3000/carrito/${usuario.id}`
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo consultar el carrito");
        }

        productosCarrito = await respuesta.json();

        listaCarrito.innerHTML = "";

        if (productosCarrito.length === 0) {
            carritoContenido.style.display = "none";
            carritoVacio.style.display = "block";
            return;
        }

        carritoContenido.style.display = "grid";
        carritoVacio.style.display = "none";

        let subtotalGeneral = 0;

        productosCarrito.forEach(producto => {

            const precio = Number(producto.precio);
            const cantidad = Number(producto.cantidad);
            const subtotal = precio * cantidad;

            subtotalGeneral += subtotal;

            const item = document.createElement("div");
            item.classList.add("carrito-item");

            // INFORMACIÓN DEL PRODUCTO
            const informacion = document.createElement("div");
            informacion.classList.add("item-info");

            const imagen = document.createElement("div");
            imagen.classList.add("item-imagen-placeholder");

            imagen.innerHTML = `
                <span class="material-symbols-outlined">local_florist</span>
            `;

            const datos = document.createElement("div");

            const nombre = document.createElement("h4");
            nombre.textContent = producto.nombre;

            const descripcion = document.createElement("small");
            descripcion.textContent = producto.descripcion;

            datos.appendChild(nombre);
            datos.appendChild(descripcion);

            informacion.appendChild(imagen);
            informacion.appendChild(datos);

            // PRECIO
            const precioElemento = document.createElement("span");
            precioElemento.classList.add("item-precio");
            precioElemento.textContent = formatoPrecio(precio);

            // CANTIDAD
            const cantidadContenedor = document.createElement("div");
            cantidadContenedor.classList.add("item-cantidad");

            const cantidadInput = document.createElement("input");
            cantidadInput.type = "number";
            cantidadInput.min = "1";
            cantidadInput.max = producto.stock;
            cantidadInput.value = cantidad;

            cantidadContenedor.appendChild(cantidadInput);

            // SUBTOTAL
            const subtotalElemento = document.createElement("span");
            subtotalElemento.classList.add("item-subtotal");
            subtotalElemento.textContent = formatoPrecio(subtotal);

            // ELIMINAR
            const botonEliminar = document.createElement("button");
            botonEliminar.type = "button";
            botonEliminar.classList.add("btn-eliminar-item");
            botonEliminar.title = "Eliminar producto";

            botonEliminar.innerHTML = `
                <span class="material-symbols-outlined">delete</span>
            `;

            item.appendChild(informacion);
            item.appendChild(precioElemento);
            item.appendChild(cantidadContenedor);
            item.appendChild(subtotalElemento);
            item.appendChild(botonEliminar);

            listaCarrito.appendChild(item);

            // ACTUALIZAR CANTIDAD
            cantidadInput.addEventListener("change", async () => {

                const nuevaCantidad = Number(cantidadInput.value);

                if (!Number.isInteger(nuevaCantidad) || nuevaCantidad < 1) {
                    alert("La cantidad debe ser como mínimo 1.");
                    cantidadInput.value = cantidad;
                    return;
                }

                if (nuevaCantidad > Number(producto.stock)) {
                    alert(`Solo hay ${producto.stock} unidades disponibles.`);
                    cantidadInput.value = cantidad;
                    return;
                }

                try {
                    const respuesta = await fetch(
                        `http://localhost:3000/carrito/${usuario.id}/${producto.id}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                cantidad: nuevaCantidad
                            })
                        }
                    );

                    const datos = await respuesta.json();

                    if (!respuesta.ok) {
                        throw new Error(datos.error || "No se pudo modificar la cantidad");
                    }

                    await mostrarCarrito();

                } catch (error) {
                    console.error(error);
                    alert(error.message);
                }
            });

            // ELIMINAR PRODUCTO
            botonEliminar.addEventListener("click", async () => {

                try {
                    const respuesta = await fetch(
                        `http://localhost:3000/carrito/${usuario.id}/${producto.id}`,
                        {
                            method: "DELETE"
                        }
                    );

                    const datos = await respuesta.json();

                    if (!respuesta.ok) {
                        throw new Error(datos.error || "No se pudo eliminar el producto");
                    }

                    await mostrarCarrito();

                } catch (error) {
                    console.error(error);
                    alert(error.message);
                }
            });

        });

        // ACTUALIZAR TOTALES
        subtotalCarrito.textContent = formatoPrecio(subtotalGeneral);
        totalCarrito.textContent = formatoPrecio(subtotalGeneral);

    } catch (error) {
        console.error("Error al cargar el carrito:", error);
        listaCarrito.innerHTML = `
            <p class="mensaje-productos">
                No se pudo cargar tu carrito. Intentá nuevamente.
            </p>
        `;
    }
}

// IR AL CHECKOUT
btnIrCheckout.addEventListener("click", () => {

    if (productosCarrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    carritoContenido.style.display = "none";
    seccionCheckout.style.display = "block";
});

// VOLVER AL CARRITO
btnVolverCarrito.addEventListener("click", () => {

    seccionCheckout.style.display = "none";
    carritoContenido.style.display = "grid";
});

// GENERAR COMPROBANTE
formCheckout.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (productosCarrito.length === 0) {
        alert("No hay productos para comprar.");
        return;
    }

    const nombre = document.getElementById("checkout-nombre").value;
    const telefono = document.getElementById("checkout-tel").value;
    const direccion = document.getElementById("checkout-direccion").value;
    const pago = document.getElementById("checkout-pago").value;

    const total = productosCarrito.reduce((acumulado, producto) => {
        return acumulado + Number(producto.precio) * Number(producto.cantidad);
    }, 0);

    // DATOS DEL CLIENTE
    document.getElementById("t-nombre").textContent = nombre;
    document.getElementById("t-tel").textContent = telefono;
    document.getElementById("t-direccion").textContent = direccion;
    document.getElementById("t-pago").textContent = pago;
    document.getElementById("t-fecha").textContent =
        new Date().toLocaleDateString("es-AR");

    // PRODUCTOS DEL COMPROBANTE
    const ticketLista = document.getElementById("ticket-lista-productos");
    ticketLista.innerHTML = "";

    productosCarrito.forEach(producto => {

        const subtotal = Number(producto.precio) * Number(producto.cantidad);

        const item = document.createElement("li");

        const nombreProducto = document.createElement("span");
        nombreProducto.textContent =
            `${producto.nombre} (x${producto.cantidad})`;

        const precioProducto = document.createElement("span");
        precioProducto.textContent = formatoPrecio(subtotal);

        item.appendChild(nombreProducto);
        item.appendChild(precioProducto);

        ticketLista.appendChild(item);
    });

    document.getElementById("ticket-total").textContent = formatoPrecio(total);

    // VACIAR CARRITO EN LA BASE DE DATOS
    try {

        const respuesta = await fetch(
            `http://localhost:3000/carrito/${usuario.id}`,
            {
                method: "DELETE"
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.error || "No se pudo finalizar la compra");
        }

        seccionCheckout.style.display = "none";
        seccionComprobante.style.display = "block";

    } catch (error) {
        console.error("Error al finalizar compra:", error);
        alert(error.message);
    }

});
