//on récupère les projets de l'API
const reponse = await fetch("http://localhost:5678/api/works");
const projets = await reponse.json();

//on récupère le parent dans le DOM
const sectionGallery = document.querySelector(".gallery");

//on génère les filters
function genererfilters() {
    const filtersList = document.createElement("div");
    filtersList.className = "filters";
    const filterTous = document.createElement("input");
    filterTous.className = "tous highlights";
    filterTous.type = "button";
    filterTous.value = "Tous";
    const filterObjets = document.createElement("input");
    filterObjets.className = "filter";
    filterObjets.type = "button";
    filterObjets.value = "Objets";
    const filterAppartements = document.createElement("input");
    filterAppartements.className = "filter";
    filterAppartements.type = "button";
    filterAppartements.value = "Appartements";
    const filterHotels = document.createElement("input");
    filterHotels.className = "filter";
    filterHotels.type = "button";
    filterHotels.value = "Hotels & restaurants";
    sectionGallery.appendChild(filtersList);
    filtersList.appendChild(filterTous);
    filtersList.appendChild(filterObjets);
    filtersList.appendChild(filterAppartements);
    filtersList.appendChild(filterHotels);
};

genererfilters();

//Création du parent pour la liste de projets dans la gallerie
const projetsList = document.createElement("div");
projetsList.className = "projets-liste";
sectionGallery.appendChild(projetsList)

//On parcoure les projets pour les afficher
function genererProjets(projets) {
    for (let i = 0; i < projets.length; i++) {
        const projet = projets[i];
        //on crée les futurs éléments du dom ainsi que leur contenu

        const projetElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = projet.imageUrl;
        const descriptionElement = document.createElement("figcaption");
        descriptionElement.innerText = projet.title;

        //on relie les éléments au DOM
        projetsList.appendChild(projetElement);
        projetElement.appendChild(imageElement);
        projetElement.appendChild(descriptionElement);
    };
};

//Premier affichage de la page
genererProjets(projets);

//boutons filter
const allFilters = document.querySelectorAll(".filter");

function resetFilters() {
    const listHighlights = document.querySelectorAll(".highlights")
    for (const highlight of listHighlights) {
        //on retire la class highlights de la list des classe de l'objet en question
        highlight.classList.remove("highlights");
    }
};

const boutonTous = document.querySelector(".tous");
boutonTous.addEventListener("click", function () {
    projetsList.innerHTML = "";
    resetFilters();
    //on ajoute la class highlight à l'objet en question
    boutonTous.classList.add("highlights")
    genererProjets(projets);
});

for (let i = 0; i < allFilters.length; i++) {
    const filter = allFilters[i];
    filter.addEventListener("click", function () {
        const filteredProjets = projets.filter(function (projets) {
            return projets.category.name === filter.value;
        });

        resetFilters();
        filter.classList.add("highlights");
        projetsList.innerHTML = " ";
        genererProjets(filteredProjets);
    });
};

//On vérifie que le token bearer est présent
const tokenBearer = window.sessionStorage.getItem("token")
if (tokenBearer !== null) {
    const modifierParent = document.createElement("a");
    modifierParent.classList.add("modifier-projets")
    modifierParent.classList.add("modal-js")
    modifierParent.href = "#modal1"
    modifierParent.role = "button"
    modifierParent.innerHTML = '<i class="fa-regular fa-pen-to-square fa-sm" style="color: #000000;"></i>  modifier'
    const mesProjets = document.querySelector(".mes-projets")
    mesProjets.appendChild(modifierParent)

};

const modalLink = document.querySelector(".modal-js")
const modal = document.querySelector("#modal1")
const mainWrapper = document.querySelector(".main-wrapper")
const modalWrapper = document.querySelector(".modal-wrapper")
const modalPhotosWrapper = document.createElement("div")
modalPhotosWrapper.className = "modal-photos-wrapper"
function modalAfficherProjets() {
    for (let i = 0; i < projets.length; i++) {
        const projet = projets[i]
        const PhotoParent = document.createElement("div")
        PhotoParent.className = "photo-parent"
        const photoElement = document.createElement("img")
        photoElement.src = projet.imageUrl
        const deleteButton = document.createElement("button")
        deleteButton.className = "delete-button"
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can fa-xs"></i>'
        const edit = document.createElement("button")
        edit.innerText = "éditer"
        edit.className = "edit"
        modalPhotosWrapper.appendChild(PhotoParent)
        PhotoParent.appendChild(photoElement)
        PhotoParent.appendChild(deleteButton)
        PhotoParent.appendChild(edit)
    }
}

const closeButton = document.createElement("button")
closeButton.className = "js-modal-close"
closeButton.innerHTML = '<i class="fa-solid fa-xmark fa-lg"></i>'
const modalTitleGallery = document.createElement("h2")
modalTitleGallery.innerText = "Galerie photo"
modalWrapper.appendChild(closeButton)
modalWrapper.appendChild(modalTitleGallery)
modalWrapper.appendChild(modalPhotosWrapper)

modalAfficherProjets()
const line = document.createElement("hr")
const buttonAjouterPhoto = document.createElement("button")
buttonAjouterPhoto.innerText = "Ajouter une photo"
buttonAjouterPhoto.className = "ajouter-photo"
const supprimerGallerie = document.createElement("button")
supprimerGallerie.innerText = "Supprimer la galerie"
supprimerGallerie.className = "supp-galerie"
modalWrapper.appendChild(line)
modalWrapper.appendChild(buttonAjouterPhoto)
modalWrapper.appendChild(supprimerGallerie)

const openModal = function (e) {
    e.preventDefault()
    mainWrapper.setAttribute("aria-hidden", "true")
    modal.style.display = null;
    modal.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true");
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)


    const deletebuttons = document.querySelectorAll(".delete-button")
    for (let i = 0; i < deletebuttons.length; i++) {
        const button = deletebuttons[i]
        button.addEventListener("click", async function () {
            const adresseid = projets[i].id;
            const adresse = "http://localhost:5678/api/works/" + adresseid
            await fetch(adresse, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${tokenBearer}` }
            })
            const modalPhotosWrapper = document.querySelector(".modal-photos-wrapper")
            modalPhotosWrapper.innerHTML = ""
            modalAfficherProjets();
        })
    }

};

const closeModal = function (e) {
    e.preventDefault()
    mainWrapper.setAttribute("aria-hidden", "false")
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-modal", "false");
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
}

modalLink.addEventListener("click", openModal)

window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
})