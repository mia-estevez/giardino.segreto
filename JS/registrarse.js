
// ELEMENTOS DEL HTML

const formulario = document.getElementById("formulario")
const email = document.getElementById("mail")
const nombre = document.getElementById("nom")
const telefono = document.getElementById("tel")
const inputPassword = document.getElementById("contra")
const btnVerPassword = document.getElementById("btnVerPassword")


// MOSTRAR Y OCULTAR CONTRASEÑA

btnVerPassword.addEventListener("click", function() {

    if (inputPassword.type === "password") {
        inputPassword.type = "text"
        btnVerPassword.textContent = "Ocultar"
    } else {
        inputPassword.type = "password"
        btnVerPassword.textContent = "Ver"
    }

})


// REGISTRAR USUARIO

formulario.addEventListener("submit", async (e) => {

    e.preventDefault()

    try {

        const resultado = await fetch("http://localhost:3000/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre.value,
                email: email.value,
                telefono: telefono.value,
                contraseña: inputPassword.value
            })
        })

        const respuesta = await resultado.json()

        if (!resultado.ok) {
            throw new Error(respuesta.error || "No se pudo registrar el usuario")
        }

        alert("¡Cuenta creada correctamente! Ya podés iniciar sesión.")

        formulario.reset()

        window.location.href = "login.html"

    } catch (error) {

        console.log("Error al registrar usuario:", error)

        alert(error.message)

    }

})
