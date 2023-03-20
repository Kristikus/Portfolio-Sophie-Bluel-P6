import { data } from './main.js'
import { worksGen } from './main.js';

// Quand l'utilisateur administrateur est connecté, faire disparaître les filtres de catégories et apparaître changements en mode édition
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


// Modale html de la gallerie
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

// Modale html pour l'ajout de photo
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
                <input type="file" id="file" name="file" accept=".png, .jpeg, .jpg" class="select">
                <label for="file">+ Ajouter photo</label>
                <p>jpg, png : 4mo max</p>
            </div>
            <label for="title">Titre</label>
            <input type="text" id="title" name="title" class="select">
            <label for="category">Catégorie</label>
            <select id="category" name="select">
                <option value="">Choisissez une catégorie</option>
            </select>
            <div class="modal-buttons">
                <p class="error"></p>
                <input type="submit" value="Valider" id="btn-add-photo_valid">
            </div>
        </form>
    </div>
</aside>`;


// Evénement sur le bouton modifier
const btnModify = document.querySelector(".modal-modify");
btnModify.addEventListener("click", galleryModalActive);

const responseWorks = await fetch("http://localhost:5678/api/works");
const works = await responseWorks.json();

const responseCategories = await fetch("http://localhost:5678/api/categories");
const categories = await responseCategories.json();


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

// Fonction pour supprimer un des travaux à partir de la modale de la gallerie
function DeleteWorks() {
    // Itération sur chaque bouton de suppression
    const deletBtn = document.querySelectorAll('.btn-delete');

    for (let i = 0; i < deletBtn.length; ++i) {

        deletBtn[i].addEventListener('click', async function (e) {
            e.preventDefault();
            // console.log(deletBtn[i], "click", works[i].id)

            if (confirm("Vous êtes sur le point de supprimer une photo.") == true) {
                const res = await fetch(`http://localhost:5678/api/works/${works[i].id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${data.token}`
                    }
                });
                if (res.ok) {
                    // console.log(res);
                    let index = works.indexOf(works[i]);
                    // console.log(index)
                    works.splice(index, 1);
                    document.querySelector("#gallery").innerHTML = "";
                    worksGenerate(works);

                    const newGallery = document.querySelector(".gallery");
                    newGallery.innerHTML = "";
                    worksGen(works);
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

    // Atteindre le bouton Ajouter pour mettre un eventListener
    const btnAddPhoto = document.querySelector(".modal-buttons .btn");
    btnAddPhoto.addEventListener("click", galleryDesactive);

    // Désactiver la première modale pour aller sur la deuxième
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

        // Ajout attribut "disabled" sur le bouton de validation du formulaire Ajout de photo
        const validButton = document.querySelector("#btn-add-photo_valid");
        validButton.setAttribute("disabled", "")

        const inputFile = document.querySelector(".modal-rectangle #file");
        inputFile.addEventListener("change", miniFile);


        // Création des options de catégories
        const menuCategory = document.querySelector("#category");
        for (let i = 0; i < categories.length; i++) {
            const elemli = document.createElement("option");
            elemli.textContent = categories[i].name;
            elemli.value = categories[i].id;
            elemli.setAttribute("id", categories[i].id);
            menuCategory.append(elemli);
        }

        postWork();

        // Enlever classe active pour fermer première modale
        const modalToggle = document.querySelectorAll(".modal-toggle");
        modalToggle.forEach(close => close.addEventListener("click", function () {
            modalAddPhoto.classList.remove("active");
        }));
    }
}

//Création d'une miniature de l'image sélectionnée à télécharger 
function miniFile() {
    const regexFile = /\.(jpe?g|png)$/i;

    if (!regexFile.test(this.files[0].name)) {
        return;
    }

    const file = this.files[0];
    // console.log(file.name)
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener("load", (e) => appearImage(e));

    function appearImage(e) {
        const image = document.createElement("img");
        image.src = e.target.result;
        image.id = "file-image";

        document.querySelector(".modal-rectangle").appendChild(image);
        document.querySelector(".modal-rectangle label").style.visibility = "hidden";

        disappearImage();
    }

    function disappearImage() {
        const img = document.querySelector("#file-image");
        const input = document.querySelector("#file");
        img.addEventListener("click", function () {
            input.value = "";
            img.remove();
            document.querySelector(".modal-rectangle label").style.visibility = "visible";
        });
    }
}


// Fonction pour poster une nouvelle image à l'envoi du formulaire
function postWork() {
    const form = document.querySelector(".form-add-photo");
    const errorMessage = document.querySelector(".error");

    form.addEventListener("change", function () {
        const file = document.querySelector("#file").files[0];
        console.log(file);
        const title = document.querySelector("#title").value;
        console.log(title);
        const category = document.querySelector("#category").value;
        console.log(category);
        const valid = document.querySelector("#btn-add-photo_valid");

        if (file && title && category) {
            valid.removeAttribute("disabled")
            errorMessage.innerText = "";
        }
        else {
            errorMessage.innerText = "Veuillez remplir tous les champs du formulaire";
            valid.setAttribute("disabled", "")
        }
    });


    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const image = document.querySelector("#file").files[0];
        // console.log(document.querySelector("#file").files[0], document.querySelector("#file").value, document.getElementById("file").value)
        const title = document.querySelector("#title").value;
        const category = document.querySelector("#category").value;

        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);
        formData.append("category", category);

        const res = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${data.token}`
            }
        });
        console.log(res)

        if (res.ok) {
            console.log("jdkfndjfsdflndslfndslfndslkndskfdslknfl")
            const paraMessage = document.querySelector(".error");

            const newGallery = document.querySelector(".gallery");
            newGallery.innerHTML = "";
            works.push(await res.json());
            worksGen(works)

            paraMessage.innerText = "Formulaire envoyé";
            paraMessage.style.color = "black";
            console.log(image.size, title)
        } else {
            paraMessage.innerText = "Problème avec le formulaire";
        }
    });
}