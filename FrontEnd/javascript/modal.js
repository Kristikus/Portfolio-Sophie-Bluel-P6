import { data } from './main.js'
import { worksGen } from './main.js';

// Quand l'utilisateur administrateur est connecté, faire disparaître les filtres de catégories et apparaître le bouton "modifier"
if (data.userId === 1) {
    document.querySelector(".categories").style.display = "none";
    const buttonModify = document.createElement("button");
    buttonModify.classList.add("modal-modify", "modal-toggle");
    buttonModify.innerText = "Modifier";

    const editIcon = document.createElement("i");
    editIcon.classList.add("fa-regular", "fa-pen-to-square");

    document.querySelector("#portfolio h2").append(buttonModify);
    document.querySelector(".modal-modify").before(editIcon);

    document.querySelector(".login-logout").innerText = "logout";
}

// Création page html modale
const modalGal =
    `<aside class="modal-contain1" role="dialog" aria-labeledby="modal-title">
    <div class="modal-layer modal-toggle"></div>

    <div id="modal-gallery">
        <button class="btn-close modal-toggle">X</button>
        <h2 id="modal-title">Galerie photo</h2>
        <div id="gallery"></div>
        <div class="modal-buttons">
            <button type="button" class="btn btn_selected">Ajouter une photo</a></button>
            <br>
            <button type="button" class="btn-delete-gallery">Supprimer la galerie</button>
        </div>
    </div>
</aside>`;

const modalPhoto =
    `<aside class="modal-contain2" role="dialog" aria-labeledby="modal-title">
    <div class="modal-layer modal-toggle"></div>

    <div class="modal-photo">
        <a href="#modal-gallery" class="modal-redirect"><i class="fa-solid fa-arrow-left"></i></a>
        <button class="btn-close modal-toggle">X</button>
        <h2 id="modal-title">Ajout photo</h2>
        <form class="form-add-photo">
            <div class="modal-rectangle">
                <i class="fa-regular fa-image"></i>
                <input type="file" id="file" accept=".png, .jpeg, .jpg">
                <label for="file">+ Ajouter photo</label>
                <p>jpg, png : 4mo max</p>
            </div>
            <label for="title">Titre</label>
            <input type="text" id="title">
            <label for="category">Catégorie</label>
            <select id="category">
            </select>
            <div class="modal-buttons">
                <input type="submit" value="Valider" id="btn-add-photo_valid">
            </div>
        </form>
    </div>
</aside>`;

// Event sur boutton modifier
const btnModify = document.querySelector(".modal-modify");
btnModify.addEventListener("click", galleryModalActive);

const responseWorks = await fetch("http://localhost:5678/api/works");
const works = await responseWorks.json();

const responseCategories = await fetch("http://localhost:5678/api/categories");
const categories = await responseCategories.json();


// Au chargement des images, rajouter attribut id à l'image : setAttribute("id", works[i].id)
async function worksGenerate(works) {

    for (let i = 0; i < works.length; i++) {

        gallery = works[i];

        const figureElement = document.createElement("figure");
        figureElement.setAttribute("id", works[i].id);

        const imgElement = document.createElement("img");
        imgElement.src = gallery.imageUrl;

        const buttonSupr = document.createElement("button");
        buttonSupr.classList.add("btn-edit-gallery", "btn-delete");

        const buttonMove = document.createElement("button");

        const iconSupr = document.createElement("i");
        iconSupr.classList.add("fa-solid", "fa-trash-can");

        const iconMove = document.createElement("i");
        iconMove.classList.add("fa-solid", "fa-arrows-up-down-left-right");

        const textElement = document.createElement("figcaption");
        textElement.innerHTML = "Editer";

        const sectionGallery = document.querySelector("#gallery");
        sectionGallery.appendChild(figureElement);
        figureElement.appendChild(imgElement);
        figureElement.appendChild(textElement);
        figureElement.appendChild(buttonSupr);
        buttonSupr.appendChild(iconSupr);


        figureElement.addEventListener("mouseover", function () {
            buttonMove.classList.add("btn-edit-gallery", "btn-move");
            figureElement.appendChild(buttonMove);
            buttonMove.appendChild(iconMove);

        })
        figureElement.addEventListener("mouseout", function () {
            buttonMove.classList.remove("btn-edit-gallery", "btn-move");
            buttonMove.remove();
        });
    }
    DeleteWorks()
}


function DeleteWorks() {
    // Itération sur chaque bouton de suppression
    const deletBtn = document.querySelectorAll('.btn-supr');

    for (let i = 0; i < deletBtn.length; ++i) {

        deletBtn[i].addEventListener('click', async function (e) {
            e.preventDefault();
            // console.log(deletBtn[i], "click", works[i].id)

            if (confirm("Voulez-vous supprimer la photo ?") == true) {
                const res = await fetch(`http://localhost:5678/api/works/${works[i].id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${data.token}`
                    }
                });
                if (res.ok) {
                    // console.log(res);
                    const toRemove = document.querySelector(`figure[id="${works[i].id}"]`);
                    toRemove.remove();
                    const toRemove2 = document.querySelector(`.gallery figure[id="${works[i].id}"]`);
                    toRemove2.remove();
                }
            }
        })
    }
}


async function galleryModalActive() {

    // innerHTML du premier aside
    const modalPlace = document.querySelector(".modal-place");
    modalPlace.innerHTML = modalGal;
    // Classe active sur premier aside
    const modalGallery = document.querySelector(".modal-contain1");
    modalGallery.classList.add("active");

    worksGenerate(works);

    // Enlever classe active pour fermer première modale
    const modalToggle = document.querySelectorAll(".modal-toggle");
    modalToggle.forEach(close => close.addEventListener("click", function () {
        modalGallery.classList.remove("active");
    }));

    // Atteindre le bouton Ajouter pour mettre un event
    const btnAddPhoto = document.querySelector(".modal-buttons .btn");
    btnAddPhoto.addEventListener("click", galleryDesactive);

    async function galleryDesactive() {

        modalGallery.classList.remove("active");
        const modalPlace = document.querySelector(".modal-place");
        modalPlace.innerHTML = modalPhoto;
        const modalAddPhoto = document.querySelector(".modal-contain2");
        modalAddPhoto.classList.add("active");

        const btnArrow = document.querySelector(".fa-arrow-left");
        btnArrow.addEventListener("click", function () {
            galleryModalActive();
        });

        showMinImage()

        // Création des options de catégories
        const menuCategory = document.querySelector("#category");
        for (let i = 0; i < categories.length; i++) {
            const elemli = document.createElement("option");
            elemli.textContent = categories[i].name;
            elemli.value = categories[i].id;
            elemli.setAttribute("id", categories[i].id);
            menuCategory.append(elemli);
        }

        submit();

        // Enlever classe active pour fermer première modale
        const modalToggle = document.querySelectorAll(".modal-toggle");
        modalToggle.forEach(close => close.addEventListener("click", function () {
            modalAddPhoto.classList.remove("active");
        }));
    }
}


// Afficher un aperçu de l'image à ajouter

function showMinImage() {
    const inputFile = document.querySelector(".modal-rectangle #file");
    inputFile.addEventListener("change", miniFile);

    function miniFile() {
        const regexFile = /\.(jpe?g|png)$/i;

        if (!regexFile.test(this.files[0].name)) {
            return;
        }

        const file = this.files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.addEventListener("load", (event) => appearImage(event));
    }

    function appearImage(event) {

        const image = document.createElement("img");
        image.src = event.target.result;
        image.id = "file-image";

        document.querySelector(".modal-rectangle").appendChild(image);
        document.querySelector(".modal-rectangle label").style.visibility = "hidden";
    }
}


//Envoi de formulaire avec la méhode FormData()
function submit() {
    const formSubmit = document.querySelector(".form-add-photo");
    const errorMessageForm = document.querySelector("#btn-add-photo_valid");
    const errorMessagePara = document.createElement("p");
    errorMessagePara.style.color = "red";
    errorMessagePara.classList.add("error");
    errorMessageForm.before(errorMessagePara);
    const paraMessage = document.querySelector(".error");


    formSubmit.addEventListener("submit", async function (e) {
        e.preventDefault();

        const image = document.querySelector("#file").files[0];
        const title = document.querySelector("#title").value;
        const category = document.querySelector("#category").value;

        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);
        formData.append("category", category);

        const res = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            mode: "cors",
            headers: {
                Authorization: `Bearer ${data.token}`
            }
        });

        if (res.ok) {
            // const sectionGallery = document.querySelector(".gallery");
            const newPhoto = document.querySelector(".gallery");
            works.push(await res.json());
            newPhoto.innerHTML = "";
            worksGen(works);

        } else {
            console.log("Erreur");
            paraMessage.innerText = "Erreur dans le remplissage du formulaire";
        }
        // return false;
    });
}