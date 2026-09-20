const inputPassword = document.getElementById("contra");
const btnVerPassword = document.getElementById("btnVerPassword");

btnVerPassword.addEventListener("click", function() {
    
    if (inputPassword.type === "password") {
        inputPassword.type = "text";
        btnVerPassword.textContent = "Ocultar";
        console.log("Estado de contraseña: visible");
    } else {
        inputPassword.type = "password";
        btnVerPassword.textContent = "Ver";
        console.log("Estado de contraseña: oculta");
    }

    console.log("Tipo actual (.type):", inputPassword.type);
    console.log("ID del elemento (.id):", inputPassword.id);
    console.log("Formulario contenedor (.form.id):", inputPassword.form.id);
});