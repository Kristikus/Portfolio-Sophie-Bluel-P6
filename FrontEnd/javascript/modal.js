import { worksGen } from './main.js';
import { URL, data } from './url.js'
import { modalGal, modalPhoto } from './html-modals.js';
import { createDivModifyImg, createDivModifyProfil, edition } from './edition.js';

// Quand l'administrateur est connecté, faire disparaître les filtres de catégories et apparaître bande noire en mode édition et boutons "modifier"
edition()
createDivModifyImg();
createDivModifyProfil();

// Evénement sur le bouton modifier
const btnModify = document.querySelector(".modal-toggle");
btnModify.addEventListener("click", galleryModalActive);

const responseWorks = await fetch(`${URL}works`);
const works = await responseWorks.json();

const responseCategories = await fetch(`${URL}categories`);
const categories = await responseCategories.json();

// Générer la galerie dans la modale
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

        });
        figureElement.addEventListener("mouseout", function () {
            buttonMove.classList.remove("btn-edit-gallery", "btn-move");
            buttonMove.remove();
        });
    }
    deleteWorks();
}

// Supprimer un des travaux de la galerie de la modale
function deleteWorks() {
    // Itération sur chaque bouton de suppression
    const deletBtn = document.querySelectorAll(".btn-delete");

    for (let i = 0; i < deletBtn.length; ++i) {

        deletBtn[i].addEventListener("click", async function (e) {
            e.preventDefault();

            if (confirm("Vous êtes sur le point de supprimer une photo.") == true) {
                const res = await fetch(`${URL}works/${works[i].id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${data.token}`
                    }
                });
                if (res.ok) {
                    // console.log(res);
                    let index = works.indexOf(works[i]);
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

        const inputFile = document.querySelector(".modal-rectangle #file");
        inputFile.addEventListener("change", miniFile);

        postWork();

        // Création des options de catégories
        const menuCategory = document.querySelector("#category");
        for (let i = 0; i < categories.length; i++) {
            const optionList = document.createElement("option");
            optionList.textContent = categories[i].name;
            optionList.value = categories[i].id;
            optionList.setAttribute("id", categories[i].id);
            menuCategory.append(optionList);
        }

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
    const errorMessage = document.querySelector(".error");
    const valid = document.querySelector("#btn-add-photo_valid");
    valid.setAttribute("disabled", "");


    if (!regexFile.test(this.files[0].name)) {
        errorMessage.innerText = "Format d'image non supporté";
        return;
    }

    const file = this.files[0];
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
            errorMessage.innerText = error;
            valid.setAttribute("disabled", "");

            document.querySelector(".modal-rectangle label").style.visibility = "visible";
        });
    }

}
const error = "Remplissez tous les champs du formulaire";

function postWork() {
    const form = document.querySelector(".form-add-photo");
    const errorMessage = document.querySelector(".error");
    const valid = document.querySelector("#btn-add-photo_valid");
    valid.setAttribute("disabled", "");

    form.addEventListener("change", function () {
        validateFields();
    });

    const regexFile = /\.(jpe?g|png)$/i;

    function validateFields() {
        const image = document.querySelector("#file");

        const title = document.querySelector("#title");
        const category = document.querySelector("#category");

        const imageValue = image.value.trim();
        const titleValue = title.value.trim();
        const categoryValue = category.value.trim();

        if (imageValue == "") {
            errorMessage.innerText = error;
        } else if (!imageValue == "") {
            const fileRegex = document.querySelector("#file").files[0].name;
            // console.log(regexFile, regexFile.test(fileRegex));

            if ((titleValue !== "") && (categoryValue !== "") && regexFile.test(fileRegex)) {
                valid.removeAttribute("disabled");
                errorMessage.innerHTML = "";
            } else {
                errorMessage.innerText = error;
                valid.setAttribute("disabled", "");
            }
        }
    }

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

        const res = await fetch(`${URL}works`, {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${data.token}`
            }
        });
        // console.log(res)

        if (res.ok) {
            works.push(await res.json());
            document.querySelector(".gallery").innerHTML = "";
            worksGen(works)
            errorMessage.innerText = "Formulaire envoyé";
            errorMessage.style.color = "black";
            document.querySelector(".modal-contain2").classList.remove("active");
        } else {
            errorMessage.innerText = error;
        }
    });
}