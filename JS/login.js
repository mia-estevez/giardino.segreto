
 // ELEMENTOS DEL HTML

const formulario = document.getElementById("formulario-login")
const email = document.getElementById("mail")
const contraseña = document.getElementById("contra")
const btnVerPassword = document.getElementById("btnVerPassword")


// MOSTRAR Y OCULTAR CONTRASEÑA

btnVerPassword.addEventListener("click", function() {

    if (contraseña.type === "password") {
        contraseña.type = "text"
        btnVerPassword.textContent = "Ocultar"
    } else {
        contraseña.type = "password"
        btnVerPassword.textContent = "Ver"
    }

})


// INICIAR SESIÓN

formulario.addEventListener("submit", async (e) => {

    e.preventDefault()

    try {

        const resultado = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.value,
                contraseña: contraseña.value
            })
        })

        const respuesta = await resultado.json()

        if (!resultado.ok) {
            throw new Error(respuesta.error || "No se pudo iniciar sesión")
        }

        // GUARDAR DATOS DEL USUARIO

        localStorage.setItem("usuario", JSON.stringify(respuesta.usuario))

        alert("¡Bienvenida/o a Giardino Segreto!")

        // IR AL INICIO

        window.location.href = "index.html"

    } catch (error) {

        console.log("Error al iniciar sesión:", error)

        alert(error.message)

    }

})
