// // Get works from api
async function worksGen() {
    let response = await fetch("http://localhost:5678/api/works");
    let works = await response.json();

    for (let i = 0; i < works.length; i++) {

        const imgElement = document.createElement("img");
        imgElement.src = works[i].imageUrl;

        const textElement = document.createElement("figcaption")
        textElement.innerHTML = works[i].title;

        const sectionGallery = document.querySelector(".gallery");
        const figureElement = document.createElement("figure");

        sectionGallery.appendChild(figureElement)
        figureElement.appendChild(imgElement);
        figureElement.appendChild(textElement);
    }
}
worksGen();