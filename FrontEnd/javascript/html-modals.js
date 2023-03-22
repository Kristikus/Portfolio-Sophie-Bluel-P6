// Modale html de la galerie
export const modalGal =
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
export const modalPhoto =
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
            <input type="text" id="title" name="title">
            <label for="category">Catégorie</label>
            <select id="category">
                <option value=""></option>
            </select>
            <div class="modal-buttons">
                <p class="error"></p>
                <input type="submit" value="Valider" id="btn-add-photo_valid">
            </div>
        </form>
    </div>
</aside>`;