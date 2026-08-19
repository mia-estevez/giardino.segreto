<?php
include("conexion.php");

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $conexion->query("DELETE FROM productos WHERE id=$id");
}

// Redirección corregida subiendo un nivel de carpeta
header("Location: ../catalogo.php");
exit();
?>