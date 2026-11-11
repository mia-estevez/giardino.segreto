// ELEMENTOS DEL HTML

const tabla = document.getElementById("tabla-productos")
const formulario = document.getElementById("formulario-producto")
const btnMostrar = document.getElementById("btn-mostrar-formulario")
const btnCancelar = document.getElementById("btn-cancelar")

let productosCargados = []


// MOSTRAR PRODUCTOS

async function mostrarProductos() {

    try {
        const resultado = await fetch("http://localhost:3000/producto")

        if (!resultado.ok) {
            throw new Error("Error al consultar productos")
        }

        const productos = await resultado.json()

        productosCargados = productos

        tabla.innerHTML = ""

        if (productos.length === 0) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="6">Todavía no hay productos registrados.</td>
                </tr>
            `
            return
        }

        productos.forEach(producto => {

            const fila = document.createElement("tr")

            fila.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.descripcion}</td>
                <td>$${producto.precio}</td>
                <td>${producto.stock}</td>
                <td>
                    <button class="btn-editar" onclick="modificarProducto(${producto.id})">
                        Editar
                    </button>

                    <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">
                        Eliminar
                    </button>
                </td>
            `

            tabla.appendChild(fila)
        })

    } catch (error) {
        console.log("Error al mostrar productos:", error)

        tabla.innerHTML = `
            <tr>
                <td colspan="6">No se pudieron cargar los productos</td>
            </tr>
        `
    }
}


// MOSTRAR FORMULARIO

btnMostrar.addEventListener("click", () => {
    formulario.hidden = false
})


// CANCELAR FORMULARIO

btnCancelar.addEventListener("click", () => {
    formulario.hidden = true
    formulario.reset()
})


// AGREGAR PRODUCTO

formulario.addEventListener("submit", async (e) => {

    e.preventDefault()

    const nombre = document.getElementById("nombre-producto").value
    const descripcion = document.getElementById("descripcion-producto").value
    const precio = Number(document.getElementById("precio-producto").value)
    const stock = Number(document.getElementById("stock-producto").value)

    try {
        const resultado = await fetch("http://localhost:3000/producto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre,
                descripcion: descripcion,
                precio: precio,
                stock: stock
            })
        })

        const respuesta = await resultado.json()

        if (!resultado.ok) {
            throw new Error(respuesta.error || "No se pudo agregar el producto")
        }

        alert("¡Producto agregado correctamente!")

        formulario.reset()
        formulario.hidden = true

        mostrarProductos()

    } catch (error) {
        console.log("Error al agregar producto:", error)
        alert(error.message)
    }
})


// ELIMINAR PRODUCTO

async function eliminarProducto(id) {

    const confirmar = confirm("¿Estás segura de que querés eliminar este producto?")

    if (!confirmar) {
        return
    }

    try {
        const resultado = await fetch(`http://localhost:3000/producto/${id}`, {
            method: "DELETE"
        })

        const respuesta = await resultado.json()

        if (!resultado.ok) {
            throw new Error(respuesta.error || "No se pudo eliminar el producto")
        }

        alert("Producto eliminado correctamente")

        mostrarProductos()

    } catch (error) {
        console.log("Error al eliminar producto:", error)
        alert(error.message)
    }
}


// MODIFICAR PRODUCTO

async function modificarProducto(id) {

    const producto = productosCargados.find(p => p.id === id)

    if (!producto) {
        alert("No se encontró el producto")
        return
    }

    const nombre = prompt("Nuevo nombre:", producto.nombre)

    if (nombre === null) return

    const descripcion = prompt("Nueva descripción:", producto.descripcion)

    if (descripcion === null) return

    const precio = prompt("Nuevo precio:", producto.precio)

    if (precio === null) return

    const stock = prompt("Nuevo stock:", producto.stock)

    if (stock === null) return

    if (nombre.trim() === "" || descripcion.trim() === "" ||
        precio.trim() === "" || stock.trim() === "" ||
        Number(precio) < 0 || Number(stock) < 0 ||
        !Number.isFinite(Number(precio)) || !Number.isFinite(Number(stock))) {

        alert("Ingresá datos válidos para modificar el producto")
        return
    }

    try {
        const resultado = await fetch(`http://localhost:3000/producto/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre,
                descripcion: descripcion,
                precio: Number(precio),
                stock: Number(stock)
            })
        })

        const respuesta = await resultado.json()

        if (!resultado.ok) {
            throw new Error(respuesta.error || "No se pudo modificar el producto")
        }

        alert("Producto modificado correctamente")

        mostrarProductos()

    } catch (error) {
        console.log("Error al modificar producto:", error)
        alert(error.message)
    }
}


// EJECUTAR AL ABRIR LA PÁGINA

mostrarProductos()
