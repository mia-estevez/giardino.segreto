const formulario = document.getElementById("formulario")
const email = document.getElementById("mail")
const nombre = document.getElementById("nom")
const telefono = document.getElementById("tel")
const contraseña = document.getElementById("contra")

formulario.addEventListener("submit", async(e) => {
    e.preventDefault() // Evitamos que se reinicie el formulario
    try{
        let resultado = await fetch(`http://localhost:3000/usuarios`, {
            method: "post", 
            body: JSON.stringify({
                nombre: nombre.value,
                email: email.value, 
                telefono: telefono.value,
                contraseña: contraseña.value
            }),
            headers: {"content-type": "application/json"}
        })
        let res = await resultado.json()
        console.log(res)
        console.log(resultado.status)
        setTimeout(() => {
            window.location.href = "index.html"
        }, 1500); 
    }
    catch(error){
        console.log(error)
    }
})