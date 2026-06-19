<?php

include("conexion.php");

if($_POST){

    $nombre = $_POST['nombre'];
    $precio = $_POST['precio'];
    $stock = $_POST['stock'];

    $sql = "
    INSERT INTO productos
    (nombre,precio,stock)
    VALUES
    ('$nombre','$precio','$stock')
    ";

    $conexion->query($sql);

    header("Location: catalogo.php");
}
?>

<form method="POST">

    <input
    type="text"
    name="nombre"
    placeholder="Producto">

    <input
    type="number"
    name="precio"
    placeholder="Precio">

    <input
    type="number"
    name="stock"
    placeholder="Stock">

    <button type="submit">
        Guardar
    </button>

</form>