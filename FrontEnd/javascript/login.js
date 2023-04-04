import { URL } from './export.js';

// Création d'un paragraphe avant le bouton de validation pour insérer un message d'erreur
const message = document.querySelector("#button");
const paraMessage = document.createElement("p");
paraMessage.classList.add("error");
message.before(paraMessage);
const para = document.querySelector(".error");

// Evenement sur le bouton de connexion et annule le comportement par défaut du "submit"
document.getElementById("login").addEventListener("submit", async function (event) {
    event.preventDefault();

    const inputs = {
        email: event.target.querySelector("#email").value,
        password: event.target.querySelector("#password").value,
    };

    const response = await fetch(`${URL}users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs)
    });
    // Si réponse différente de 200, alors insérer un message d'erreur global
    if (!response.ok) {
        para.innerText = "Erreur dans l'identifiant ou le mot de passe";
        // Sinon, récupérer la réponse (token) au format json et la sauvegarder dans le sessionStorage
    } else {
        let result = await response.json();
        const tokenResult = JSON.stringify(result);
        window.sessionStorage.setItem("userToken", tokenResult);
        // Enlever le message d'erreur et rediriger sur la page d'accueil
        para.remove();
        location.href = "./index.html";
    }
});