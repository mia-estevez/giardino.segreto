
const express = require(`express`);
const cors = require(`cors`);
const mysql = require(`mysql2`);
const bcrypt = require(`bcrypt`);

const app = express();

app.use(cors());
app.use(express.json());

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "2909",
    database: "mydb",
    port: 3300
});

const PORT = 3000;


// CREAR USUARIO
app.post("/usuarios", async (req, res) => {

    const { nombre, email, telefono, contraseña } = req.body;

    if (!nombre || !email || !telefono || !contraseña) {
        return res.status(400).json({
            error: "Todos los datos son obligatorios"
        });
    }

    try {
        const contraseñaCifrada = await bcrypt.hash(contraseña, 10);

        const consulta = `
            INSERT INTO usuarios (nombre, email, telefono, contraseña, rol)
            VALUES (?, ?, ?, ?, ?)
        `;

        conexion.query(
            consulta,
            [nombre, email, telefono, contraseñaCifrada, "comprador"],
            (error, resultado) => {

                if (error) {
                    console.log("Error de MySQL:", error);

                    if (error.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({
                            error: "El email o teléfono ya está registrado"
                        });
                    }

                    return res.status(500).json({
                        error: "Error al registrar usuario"
                    });
                }

                res.status(201).json({
                    mensaje: "Usuario creado correctamente",
                    id_nuevo_usuario: resultado.insertId,
                    rol: "comprador"
                });
            }
        );

    } catch (error) {
        console.log("Error al cifrar contraseña:", error);

        res.status(500).json({
            error: "Error al registrar usuario"
        });
    }
});


 // INICIAR SESIÓN

app.post("/login", (req, res) => {

    const { email, contraseña } = req.body

    if (!email || !contraseña) {
        return res.status(400).json({
            error: "Ingresá tu email y contraseña"
        })
    }

    const consulta = `
        SELECT * FROM usuarios
        WHERE email = ?
    `

    conexion.query(consulta, [email], async (error, resultado) => {

        if (error) {
            console.log("Error de MySQL:", error)

            return res.status(500).json({
                error: "Error al iniciar sesión"
            })
        }

        if (resultado.length === 0) {
            return res.status(401).json({
                error: "Email o contraseña incorrectos"
            })
        }

        const usuario = resultado[0]

        try {
            const contraseñaCorrecta = await bcrypt.compare(
                contraseña,
                usuario.contraseña
            )

            if (!contraseñaCorrecta) {
                return res.status(401).json({
                    error: "Email o contraseña incorrectos"
                })
            }

            res.status(200).json({
                mensaje: "Inicio de sesión correcto",
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol
                }
            })

        } catch (error) {
            console.log("Error al verificar contraseña:", error)

            res.status(500).json({
                error: "Error al verificar los datos"
            })
        }
    })
})



// AGREGAR PRODUCTOS
app.post("/producto", (req, res) => {

    const { nombre, descripcion, precio, stock } = req.body;

    if (nombre === undefined || descripcion === undefined ||
        precio === undefined || stock === undefined) {
        return res.status(400).json({
            error: "Todos los campos son obligatorios"
        });
    }

    const consulta = `
        INSERT INTO producto (nombre, descripcion, precio, stock)
        VALUES (?, ?, ?, ?)
    `;

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
});


// MOSTRAR PRODUCTOS
app.get("/producto", (req, res) => {

    const consulta = `SELECT * FROM producto`;

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
});


// ELIMINAR PRODUCTOS
app.delete("/producto/:id", (req, res) => {

    const { id } = req.params;

    const consulta = `DELETE FROM producto WHERE id = ?`;

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
});


// MODIFICAR PRODUCTOS
app.put("/producto/:id", (req, res) => {

    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;

    if (nombre === undefined || descripcion === undefined ||
        precio === undefined || stock === undefined) {
        return res.status(400).json({
            error: "Todos los campos son obligatorios"
        });
    }

    const consulta = `
        UPDATE producto
        SET nombre = ?, descripcion = ?, precio = ?, stock = ?
        WHERE id = ?
    `;

    conexion.query(
        consulta,
        [nombre, descripcion, precio, stock, id],
        (error, resultado) => {

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
        }
    );
});


// ================================
// FAVORITOS
// ================================

// GUARDAR PRODUCTO EN FAVORITOS
app.post("/favoritos", (req, res) => {

    const { id_usuario, id_producto } = req.body;

    if (!id_usuario || !id_producto) {
        return res.status(400).json({
            error: "Faltan los datos del usuario o producto"
        });
    }

    const consulta = `
        INSERT INTO favoritos (id_usuario, id_producto)
        VALUES (?, ?)
    `;

    conexion.query(
        consulta,
        [id_usuario, id_producto],
        (error, resultado) => {

            if (error) {
                console.log("Error al guardar favorito:", error);

                if (error.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        error: "Este producto ya está en favoritos"
                    });
                }

                return res.status(500).json({
                    error: "No se pudo guardar el favorito"
                });
            }

            res.status(201).json({
                mensaje: "Producto agregado a favoritos correctamente",
                id: resultado.insertId
            });
        }
    );
});


// MOSTRAR FAVORITOS DE UN USUARIO
app.get("/favoritos/:id_usuario", (req, res) => {

    const { id_usuario } = req.params;

    const consulta = `
        SELECT
            producto.id,
            producto.nombre,
            producto.descripcion,
            producto.precio,
            producto.stock
        FROM favoritos
        INNER JOIN producto
            ON favoritos.id_producto = producto.id
        WHERE favoritos.id_usuario = ?
    `;

    conexion.query(consulta, [id_usuario], (error, resultado) => {

        if (error) {
            console.log("Error al consultar favoritos:", error);

            return res.status(500).json({
                error: "No se pudieron consultar los favoritos"
            });
        }

        res.status(200).json(resultado);
    });
});


// ELIMINAR PRODUCTO DE FAVORITOS
app.delete("/favoritos/:id_usuario/:id_producto", (req, res) => {

    const { id_usuario, id_producto } = req.params;

    const consulta = `
        DELETE FROM favoritos
        WHERE id_usuario = ? AND id_producto = ?
    `;

    conexion.query(
        consulta,
        [id_usuario, id_producto],
        (error, resultado) => {

            if (error) {
                console.log("Error al eliminar favorito:", error);

                return res.status(500).json({
                    error: "No se pudo eliminar el favorito"
                });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    error: "No se encontró el favorito"
                });
            }

            res.status(200).json({
                mensaje: "Producto eliminado de favoritos"
            });
        }
    );
});


// ================================
// CARRITO
// ================================

// AGREGAR PRODUCTO AL CARRITO
app.post("/carrito", (req, res) => {

    const { id_usuario, id_producto, cantidad } = req.body;

    if (!id_usuario || !id_producto || !cantidad || cantidad < 1) {
        return res.status(400).json({
            error: "Los datos del producto son obligatorios"
        });
    }

    const consulta = `
        INSERT INTO carrito (id_usuario, id_producto, cantidad)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)
    `;

    conexion.query(
        consulta,
        [id_usuario, id_producto, cantidad],
        (error, resultado) => {

            if (error) {
                console.log("Error al agregar al carrito:", error);

                return res.status(500).json({
                    error: "No se pudo agregar el producto al carrito"
                });
            }

            res.status(201).json({
                mensaje: "Producto agregado al carrito"
            });
        }
    );
});


// MOSTRAR CARRITO DE UN USUARIO
app.get("/carrito/:id_usuario", (req, res) => {

    const { id_usuario } = req.params;

    const consulta = `
        SELECT
            producto.id,
            producto.nombre,
            producto.descripcion,
            producto.precio,
            producto.stock,
            carrito.cantidad
        FROM carrito
        INNER JOIN producto
            ON carrito.id_producto = producto.id
        WHERE carrito.id_usuario = ?
    `;

    conexion.query(consulta, [id_usuario], (error, resultado) => {

        if (error) {
            console.log("Error al consultar carrito:", error);

            return res.status(500).json({
                error: "No se pudo consultar el carrito"
            });
        }

        res.status(200).json(resultado);
    });
});


// MODIFICAR CANTIDAD
app.put("/carrito/:id_usuario/:id_producto", (req, res) => {

    const { id_usuario, id_producto } = req.params;
    const { cantidad } = req.body;

    if (!Number.isInteger(cantidad) || cantidad < 1) {
        return res.status(400).json({
            error: "La cantidad debe ser mayor a cero"
        });
    }

    const consulta = `
        UPDATE carrito
        SET cantidad = ?
        WHERE id_usuario = ? AND id_producto = ?
    `;

    conexion.query(
        consulta,
        [cantidad, id_usuario, id_producto],
        (error, resultado) => {

            if (error) {
                console.log("Error al modificar cantidad:", error);

                return res.status(500).json({
                    error: "No se pudo modificar la cantidad"
                });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    error: "No se encontró el producto en el carrito"
                });
            }

            res.status(200).json({
                mensaje: "Cantidad actualizada correctamente"
            });
        }
    );
});


// ELIMINAR PRODUCTO DEL CARRITO
app.delete("/carrito/:id_usuario/:id_producto", (req, res) => {

    const { id_usuario, id_producto } = req.params;

    const consulta = `
        DELETE FROM carrito
        WHERE id_usuario = ? AND id_producto = ?
    `;

    conexion.query(
        consulta,
        [id_usuario, id_producto],
        (error, resultado) => {

            if (error) {
                console.log("Error al eliminar del carrito:", error);

                return res.status(500).json({
                    error: "No se pudo eliminar el producto"
                });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    error: "No se encontró el producto"
                });
            }

            res.status(200).json({
                mensaje: "Producto eliminado del carrito"
            });
        }
    );
});


// VACIAR CARRITO
app.delete("/carrito/:id_usuario", (req, res) => {

    const { id_usuario } = req.params;

    conexion.query(
        "DELETE FROM carrito WHERE id_usuario = ?",
        [id_usuario],
        (error, resultado) => {

            if (error) {
                console.log("Error al vaciar carrito:", error);

                return res.status(500).json({
                    error: "No se pudo vaciar el carrito"
                });
            }

            res.status(200).json({
                mensaje: "Carrito vaciado correctamente"
            });
        }
    );
});


// CREAR ADMINISTRADOR PREDETERMINADO
async function crearAdministrador() {

    const email = "admin@gmail.com";
    const contraseña = "0123";

    conexion.query(
        `SELECT id FROM usuarios WHERE email = ?`,
        [email],
        async (error, resultado) => {

            if (error) {
                console.log("Error al buscar administrador:", error);
                return;
            }

            if (resultado.length > 0) {
                console.log("El administrador ya existe.");
                return;
            }

            try {
                const contraseñaCifrada = await bcrypt.hash(contraseña, 10);

                const consulta = `
                    INSERT INTO usuarios
                    (nombre, email, telefono, contraseña, rol)
                    VALUES (?, ?, ?, ?, ?)
                `;

                conexion.query(
                    consulta,
                    [
                        "Administrador",
                        email,
                        null,
                        contraseñaCifrada,
                        "admin"
                    ],
                    (error, resultado) => {

                        if (error) {
                            console.log("Error al crear administrador:", error);
                            return;
                        }

                        console.log("Administrador creado correctamente.");
                    }
                );

            } catch (error) {
                console.log("Error al cifrar contraseña del administrador:", error);
            }
        }
    );
}


// CONECTAR SERVIDOR
conexion.connect((error) => {

    if (error) {
        console.log("Error al conectar con MySQL:", error);
        return;
    }

    console.log("Conexión con MySQL establecida.");

    crearAdministrador();

    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
});
