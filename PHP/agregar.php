<?php
include("conexion.php");

if ($_POST) {
    $nombre = trim($_POST['nombre']);
    $precio = trim($_POST['precio']);
    $stock = trim($_POST['stock']);

    if (!empty($nombre) && !empty($precio) && !empty($stock)) {
        $sql = "INSERT INTO productos (nombre, precio, stock) VALUES ('$nombre', '$precio', '$stock')";
        
        if ($conexion->query($sql)) {
            header("Location: ../catalogo.php");
            exit();
        } else {
            $error = "Error al guardar el producto: " . $conexion->error;
        }
    } else {
        $error = "Por favor completa todos los campos.";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Giardino Segreto - Agregar Producto</title>
    <link rel="stylesheet" href="../CSS/catalogo.css">
    <style>
        .form-container {
            width: 90%;
            max-width: 450px;
            margin: 40px auto;
            background: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.08);
            text-align: center;
        }
        .form-container input {
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            border: 1px solid #ecc2d0;
            border-radius: 8px;
            box-sizing: border-box;
            font-size: 1rem;
        }
        .form-container input:focus {
            outline: none;
            border-color: #d17b88;
        }
        .btn-guardar {
            width: 100%;
            background-color: #e792af;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 25px;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            margin-top: 15px;
            transition: background 0.3s ease;
        }
        .btn-guardar:hover {
            background-color: #d17b88;
        }
        .btn-volver {
            display: inline-block;
            margin-top: 15px;
            color: #888;
            text-decoration: none;
            font-size: 0.9rem;
        }
        .btn-volver:hover {
            color: #d17b88;
        }
        .error-msg {
            color: #d9534f;
            margin-bottom: 10px;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>

    <div class="form-container">
        <div class="titulo" style="margin-top:0;">
            <h1 style="font-size: 1.5rem;">Agregar Producto</h1>
        </div>

        <?php if (isset($error)): ?>
            <p class="error-msg"><?= $error ?></p>
        <?php endif; ?>

        <form method="POST">
            <input type="text" name="nombre" placeholder="Nombre del producto" required>
            <input type="number" step="0.01" name="precio" placeholder="Precio ($)" required>
            <input type="number" name="stock" placeholder="Cantidad en Stock" required>
            
            <button type="submit" class="btn-guardar">Guardar Producto</button>
        </form>

        <a href="../catalogo.php" class="btn-volver">← Volver al catálogo</a>
    </div>

</body>
</html>