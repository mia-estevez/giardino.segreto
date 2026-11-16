const express = require(`express`);
const cors = require(`cors`)
const mysql = require(`mysql2`)

const app = express()

app.use(cors())
app.use(express.json())

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "2909",
    database: "mydb",
    port: 3300
})

const PORT = 3000

//CREAR USUARIO
app.post("/usuarios", (req, res) => {
    const { nombre, email, telefono, contraseña }= req.body
    if (nombre===undefined || email===undefined || telefono===undefined || contraseña===undefined){
        return res.status(400).json({error:"Todos los datos son obligatorios"})
    }
    const consulta = `INSERT INTO usuarios(nombre, email, telefono, contraseña) VALUES (?, ?, ?, ?)`

    conexion.query(consulta, [nombre, email, telefono, contraseña], (error, resultado) => {
        if (error){
    console.log("Error de MySQL:", error);
    return res.status(500).json({ 
        error: "Error al agregar",
        detalle: error.message
    });
}
        res.status(201).json({
            mensaje: "Usuario creado correctamente",
            id_nuevo_usuario: resultado.insertId
        });
    });
})


//AGREGAR PRODUCTOS
app.post("/producto", (req, res) => {
    const { nombre, descripcion, precio, stock } = req.body

    if (nombre === undefined || descripcion === undefined || precio === undefined || stock === undefined) {
        return res.status(400).json({error: "Todos los campos son obligatorios"})
    }

    const consulta = `INSERT INTO producto (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)`

    conexion.query(consulta, [nombre, descripcion, precio, stock], (error, resultado) => {
        if (error) {
            console.log("Error de MySQL:", error);
            return res.status(500).json({
                error: "Error al agregar",
                detalle: error.message
            });
        }

        res.status(201).json({
            mensaje: "Producto agregado correctamente",
            id_nuevo_producto: resultado.insertId
        });
    });
})


//MOSTRAR PRODUCTOS
app.get("/producto", (req, res) => {

    const consulta = `SELECT * FROM producto`

    conexion.query(consulta, (error, resultado) => {
        if (error) {
            console.log("Error de MySQL:", error);
            return res.status(500).json({
                error: "Error al consultar productos",
                detalle: error.message
            });
        }

        res.status(200).json(resultado);
    });
})


//ELIMINAR PRODUCTOS
app.delete("/producto/:id", (req, res) => {

    const { id } = req.params

    const consulta = `DELETE FROM producto WHERE id = ?`

    conexion.query(consulta, [id], (error, resultado) => {
        if (error) {
            console.log("Error de MySQL:", error);
            return res.status(500).json({
                error: "Error al eliminar producto",
                detalle: error.message
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                error: "No se encontró el producto"
            });
        }

        res.status(200).json({
            mensaje: "Producto eliminado correctamente"
        });
    });
})


//MODIFICAR PRODUCTOS
app.put("/producto/:id", (req, res) => {

    const { id } = req.params
    const { nombre, descripcion, precio, stock } = req.body

    if (nombre === undefined || descripcion === undefined || precio === undefined || stock === undefined) {
        return res.status(400).json({
            error: "Todos los campos son obligatorios"
        })
    }

    const consulta = `UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?`

    conexion.query(consulta, [nombre, descripcion, precio, stock, id], (error, resultado) => {
        if (error) {
            console.log("Error de MySQL:", error);
            return res.status(500).json({
                error: "Error al modificar producto",
                detalle: error.message
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                error: "No se encontró el producto"
            });
        }

        res.status(200).json({
            mensaje: "Producto modificado correctamente"
        });
    });
})


//INICIAR SESIÓN
//const consulta = `SELECT * FROM usuarios WHERE email = ${email} AND contraseña = ${contraseña}`

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})