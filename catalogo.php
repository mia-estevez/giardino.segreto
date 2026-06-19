<?php
include("conexion.php");

$resultado = $conexion->query(
    "SELECT * FROM productos"
);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Giardino Segreto</title> 
    <link rel="stylesheet" href="CSS/catalogo.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=deceased" />
</head>
<body>
    
    <header>
        <img id="foto" src="" alt="Logo" />

        <nav class="menu">

            <div class="botontres">
                <button class="menu-toggle">&#9776;</button>
            </div>
            <div class="submenu">
                <ul class="nav-menu">
                    <li class="li1"><a href="index.html">Nosotros</a><ul>
                        <li class="li2"><span class="material-symbols-outlined">deceased</span><a href="cuidados.html">Cuidados</a></li>
                        <li class="li2"><span class="material-symbols-outlined">deceased</span><a href="asesoramiento.html">Asesoramiento</a></li>
                    </ul></li>
                    <li class="li1"><a href="registrarse.html">Registrarse</a></li>
                    <li class="li1"><a href="productos.html">Productos</a><ul>
                        <li class="li2"><span class="material-symbols-outlined">deceased</span><a href="promo.html">Promo</a></li>
                        <li class="li2"><span class="material-symbols-outlined">deceased</span><a href="especial.html">Ediciones especiales</a></li>
                    </ul></li>
                    <li class="li1"><a href="favoritos.html">Favoritos</a></li>
                    <li class="li1"><a href="catalogo.html">Catalogo</a></li>
                    <li class="li1"><a href="carrito.html">Carrito</a></li>
                </ul>
            </div>  
       </nav>
    </header>

    <div class="contenedor">
        <div class="titulo">
            <h1>Catálogo de Productos</h1>
        </div> 
        <button id="btnAgregar">Agregar Producto</button>
        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                </tr>
                
                <?php while($p = $resultado->fetch_assoc()){ ?>
                <tr>
                    <td><?= $p['nombre'] ?></td>
                    <td>$<?= $p['precio'] ?></td>
                    <td><?= $p['stock'] ?></td>
                    <td><a href="editar.php?id=<?= $p['id'] ?>">
                        <button>Actualizar</button></a>
                        <a href="eliminar.php?id=<?= $p['id'] ?>">
                        <button>Eliminar</button></a>
                    </td>
                </tr>
                <?php } ?>

            </thead>
            <tbody id="tablaProductos">
            </tbody>
        </table>

    </div>

    <script src="JS/catalogo.js"></script>

    <footer>
        <p>&copy; 2026 Giardino Segreto. Todos los derechos reservados.</p>
    </footer>
</body>
</html>