<?php
include("conexion.php");

if($_POST){
    $nombre = $_POST['nombre'];
    $precio = $_POST['precio'];
    $stock = $_POST['stock'];

    // Validamos que los campos no estén vacíos
    if(!empty($nombre) && !empty($precio) && !empty($stock)) {
        $sql = "INSERT INTO productos (nombre, precio, stock) VALUES ('$nombre', '$precio', '$stock')";
        
        if($conexion->query($sql)) {
            // Salimos de la carpeta PHP/ para ir a catalogo.php en la raíz
            header("Location: ../catalogo.php");
            exit();
        } else {
            echo "Error al guardar el producto: " . $conexion->error;
        }
    } else {
        echo "Por favor completa todos los campos.";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Agregar Producto</title>
</head>
<body>
    <h2>Agregar Producto</h2>
    <form method="POST">
        <input type="text" name="nombre" placeholder="Producto" required>
        <input type="number" step="0.01" name="precio" placeholder="Precio" required>
        <input type="number" name="stock" placeholder="Stock" required>
        <button type="submit">Guardar</button>
    </form>
    <br>
    <a href="../catalogo.php">Volver al catálogo</a>
</body>
</html>