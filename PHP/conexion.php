<?php

$conexion = new mysqli(
    "localhost",
    "root",
    "",
    "floreria"
);

if($conexion->connect_error){
    die("Error de conexión");
}

?>