<?php

include("conexion.php");

$id = $_GET['id'];

if($_POST){

    $nombre = $_POST['nombre'];
    $precio = $_POST['precio'];
    $stock = $_POST['stock'];

    $sql = "
    UPDATE productos
    SET
    nombre='$nombre',
    precio='$precio',
    stock='$stock'
    WHERE id=$id
    ";

    $conexion->query($sql);

    header("Location: catalogo.php");
}

$producto = $conexion
->query("SELECT * FROM productos WHERE id=$id")
->fetch_assoc();

?>

<form method="POST">

<input
type="text"
name="nombre"
value="<?= $producto['nombre'] ?>">

<input
type="number"
name="precio"
value="<?= $producto['precio'] ?>">

<input
type="number"
name="stock"
value="<?= $producto['stock'] ?>">

<button type="submit">
Actualizar
</button>

</form>