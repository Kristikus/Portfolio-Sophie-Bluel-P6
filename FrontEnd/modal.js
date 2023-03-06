import { test } from './main.js'

// Quand l'utilisateur administrateur est connecté, faire disparaître les filtres de catégories et apparaître le bouton "modifier"

if (test.userId == 1) {
    // console.log("kjfdsfkhkfjhsjk");
    document.querySelector(".categories").style.display = "none";
    const buttonModify = document.createElement("a");
    buttonModify.setAttribute("href", "#modal-open");
    buttonModify.classList.add("modal-modify")
    buttonModify.innerText = "Modifier"
    document.querySelector("#portfolio h2").append(buttonModify);
}


// Création page html modale
const modalHtml =
`<aside id="modal-open" class="modal" aria-hidden="true" role="dialog" aria-labeledby="modal-title" style="display: none">
<div class="modal-content modal-stop">
<div class="btn-close-div">
    <button class="btn-close-modal">X</button>
</div>
    <h2 id="title-modal">Galerie photo</h2>
    <div id="gallery"></div>
    <div class="modal-buttons">
        <button type="button" class="btn btn_selected">Ajouter une photo</button>
        <br>
        <button type="button" class="btn-delete-gallery">Supprimer la galerie</button>
    </div>
</div>
</aside>
</body>
</html>`

const modalPlace = document.querySelector(".modal-place");
    modalPlace.innerHTML = modalHtml;

let modal = null;
const focusSelector = "button, input";
let focus = [];

const openModal = function(e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href"));
    focus = Array.from(modal.querySelectorAll(focusSelector));
    modal.style.display = null;
    modal.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal);
    modal.querySelector(".btn-close-modal").addEventListener("click", closeModal);
    modal.querySelector(".modal-stop").addEventListener("click", stopPropagation);
}

const closeModal = function(e) {
    if (modal === null) return
    e.preventDefault;
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-modal", "false");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".btn-close-modal").removeEventListener("click", closeModal);
    modal.querySelector(".modal-stop").removeEventListener("click", stopPropagation);
    modal = null;
}

const stopPropagation = function (e) {
    e.stopPropagation();
}

const focusModal = function (e) {
    e.preventDefault();
    let i = focus.findIndex(f => f === modal.querySelector(":focus"));
    if (e.shiftKey === true) {
        i--
    }else {
    i++;
    }
    if (i >= focus.length) {
        i = 0;
    }
    if (i < 0) {
        i = focus.length-1;
    }
    focus[i].focus()
}

document.querySelector(".modal-modify").addEventListener("click", openModal)
    
window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === "Tab" && modal != null) {
        focusModal(e)
    }
})






// Insertion des images de la galerie dans la modale
const response = await fetch("http://localhost:5678/api/works");
const works = await response.json();

async function worksGen(works) {
    for (let i = 0; i < works.length; i++) {

        const gallery = works[i];

        const figureElement = document.createElement("figure");

        const imgElement = document.createElement("img");
        imgElement.src = gallery.imageUrl;

        const buttonSupr = document.createElement("button");
        buttonSupr.classList.add("btn-supr");

        const textElement = document.createElement("figcaption");
        textElement.innerHTML = "Editer";

        sectionGallery.appendChild(figureElement);
        figureElement.appendChild(imgElement);
        figureElement.appendChild(textElement);
        figureElement.appendChild(buttonSupr);
    }
}
const sectionGallery = document.querySelector("#gallery");
worksGen(works);