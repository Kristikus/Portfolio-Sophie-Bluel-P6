import { data } from './main.js';

// Quand l'administrateur est connecté, faire disparaître les filtres de catégories et apparaître bande noire en mode édition et bouton modale "modifier"
export function edition() {
    if (data.userId === 1) {
        document.querySelector(".categories").style.display = "none";
        const buttonModify = document.createElement("button");
        buttonModify.classList.add("modal-modify", "modal-toggle");
        buttonModify.innerText = "Modifier";

        const editIcon = document.createElement("i");
        editIcon.classList.add("fa-regular", "fa-pen-to-square");

        document.querySelector("#portfolio h2").append(buttonModify);
        document.querySelector(".modal-modify").before(editIcon);

        let login = document.querySelector(".login-logout")
        login.innerText = "logout";
        login.addEventListener("click", function () {
            window.sessionStorage.removeItem("userToken")
        });

        let header = document.querySelector("header");
        let editionMode = document.createElement("div");
        editionMode.classList.add("edition-mode");

        const editIcon2 = document.createElement("i");
        editIcon2.classList.add("fa-regular", "fa-pen-to-square", "pen-edition-mode");

        const editionPara = document.createElement("p");
        editionPara.innerText = "mode édition"

        const editionButton = document.createElement("button");
        editionButton.classList.add("edition-btn");
        editionButton.innerText = "publier les changements"

        header.before(editionMode);
        editionMode.appendChild(editIcon2);
        editionMode.appendChild(editionPara);
        editionMode.appendChild(editionButton);
    }
}

// Créer div avec le bouton "modifier" en mode édition sous la photo de profil dans l'introduction
export function createDivModifyImg() {
    const divEdition = document.createElement("div");
    divEdition.classList.add("edition-profil");

    const icon = document.createElement("i");
    icon.classList.add("fa-regular", "fa-pen-to-square",);

    const button = document.createElement("button");
    button.classList.add("modal-modify");
    button.innerText = "Modifier";

    document.querySelector("#introduction figure").append(divEdition)
    divEdition.appendChild(icon);
    divEdition.appendChild(button);
}
// createDivModifyImg();

// Créer div avec le bouton "modifier" en mode édition pour le profil de l'utilisateur dans l'introduction
export function createDivModifyProfil() {
    const divEdition = document.createElement("div");

    const icon = document.createElement("i");
    icon.classList.add("fa-regular", "fa-pen-to-square", "pen-profil");

    const button = document.createElement("button");
    button.classList.add("modal-modify", "modal-modify-profil");
    button.innerText = "Modifier";

    document.querySelector("#introduction h2").before(divEdition)
    divEdition.appendChild(icon);
    divEdition.appendChild(button);
}
// createDivModifyProfil()