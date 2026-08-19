<?php
include("conexion.php");

if (!isset($_GET['id']) || empty($_GET['id'])) {
    header("Location: ../catalogo.php");
    exit();
}

$id = $_GET['id'];

if($_POST){
    $nombre = $_POST['nombre'];
    $precio = $_POST['precio'];
    $stock = $_POST['stock'];

    $sql = "UPDATE productos SET nombre='$nombre', precio='$precio', stock='$stock' WHERE id=$id";

    if($conexion->query($sql)) {
        // Redirección corregida subiendo un nivel de carpeta
        header("Location: ../catalogo.php");
        exit();
    } else {
        echo "Error al actualizar: " . $conexion->error;
    }
}

$resultado = $conexion->query("SELECT * FROM productos WHERE id=$id");
$producto = $resultado->fetch_assoc();

if(!$producto) {
    die("El producto no existe.");
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Editar Producto</title>
</head>
<body>
    <h2>Editar Producto</h2>
    <form method="POST">
        <input type="text" name="nombre" value="<?= $producto['nombre'] ?>" required>
        <input type="number" step="0.01" name="precio" value="<?= $producto['precio'] ?>" required>
        <input type="number" name="stock" value="<?= $producto['stock'] ?>" required>
        <button type="submit">Actualizar</button>
    </form>
    <br>
    <a href="../catalogo.php">Volver al catálogo</a>
</body>
</html>