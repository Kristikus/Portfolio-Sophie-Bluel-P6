// // Obtention des travaux depuis l'api
const response = await fetch("http://localhost:5678/api/works");
const works = await response.json();

async function worksGen(works) {

    for (let i = 0; i < works.length; i++) {

        const gallery = works[i];

        const sectionGallery = document.querySelector(".gallery");
        const figureElement = document.createElement("figure");

        const imgElement = document.createElement("img");
        imgElement.src = gallery.imageUrl;

        const textElement = document.createElement("figcaption");
        textElement.innerHTML = gallery.title;

        sectionGallery.appendChild(figureElement);
        figureElement.appendChild(imgElement);
        figureElement.appendChild(textElement);
    }
}
worksGen(works);


// Création d'une div pour contenir les boutons et leur appliquer un style css
const categorieElement = document.querySelector("#portfolio h2");
const categorieDiv = document.createElement("div");
categorieElement.after(categorieDiv);

const categorieDivStyle = document.querySelector("#portfolio div");
categorieDivStyle.classList.add("categories");


// Création bouton "Tous"
const buttonAll = document.createElement("button");
buttonAll.innerText = "Tous";
buttonAll.classList.add("btn", "btn-all");
categorieDivStyle.appendChild(buttonAll);

buttonAll.addEventListener("click", function () {
    const buttonAllFilter = works.filter(function (work) {
        return work.categorieId === works.id;
    });
    document.querySelector(".gallery").innerHTML = "";
    worksGen(buttonAllFilter);
})

// Creation categories boutons depuis l'api
const reponse = await fetch("http://localhost:5678/api/categories");
const categories = await reponse.json();

for (let i = 0; i < categories.length; i++) {
    const buttonFilter = document.createElement('button');
    buttonFilter.classList.add("btn");
    buttonFilter.textContent = categories[i].name;
    categorieDivStyle.appendChild(buttonFilter);

    buttonFilter.addEventListener("click", function () {
        const worksFiltered = works.filter(function (work) {
            return work.categoryId === works[i].id
        });
        document.querySelector(".gallery").innerHTML = "";
        worksGen(worksFiltered)
    });
}

