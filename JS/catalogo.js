let productos = [
    {
        nombre: "Ramo de Rosas",
        precio: 15000,
        stock: 12
    },
    {
        nombre: "Tulipanes",
        precio: 12000,
        stock: 8
    },
    {
        nombre: "Orquídea",
        precio: 20000,
        stock: 5
    }
];

const tabla = document.getElementById("tablaProductos");

function mostrarProductos(){

    tabla.innerHTML = "";

    productos.forEach((producto, indice)=>{

        tabla.innerHTML += `
        <tr>
            <td>${producto.nombre}</td>
            <td>$${producto.precio}</td>
            <td>${producto.stock}</td>

            <td>
                <button class="editar"
                onclick="editarProducto(${indice})">
                Actualizar
                </button>

                <button class="eliminar"
                onclick="eliminarProducto(${indice})">
                Eliminar
                </button>
            </td>
        </tr>
        `;
    });
}

function agregarProducto(){

    let nombre = prompt("Nombre del producto:");

    if(!nombre) return;

    let precio = prompt("Precio:");

    let stock = prompt("Stock:");

    productos.push({
        nombre,
        precio,
        stock
    });

    mostrarProductos();
}

function eliminarProducto(indice){

    if(confirm("¿Eliminar producto?")){

        productos.splice(indice,1);

        mostrarProductos();
    }
}

function editarProducto(indice){

    let nuevoNombre = prompt(
        "Nuevo nombre:",
        productos[indice].nombre
    );

    let nuevoPrecio = prompt(
        "Nuevo precio:",
        productos[indice].precio
    );

    let nuevoStock = prompt(
        "Nuevo stock:",
        productos[indice].stock
    );

    productos[indice].nombre = nuevoNombre;
    productos[indice].precio = nuevoPrecio;
    productos[indice].stock = nuevoStock;

    mostrarProductos();
}

document
.getElementById("btnAgregar")
.addEventListener("click", agregarProducto);

mostrarProductos();