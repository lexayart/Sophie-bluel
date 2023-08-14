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
//fonction pour enlever la class highlight pour par la suite la mettre sur le filtre sélectionné
function resetFilters() {
    const listHighlights = document.querySelectorAll(".highlights")
    for (const highlight of listHighlights) {
        //on retire la class highlights de la list des classe de l'objet en question
        highlight.classList.remove("highlights");
    }
};

//fonction du bouton filtre tous
const boutonTous = document.querySelector(".tous");
boutonTous.addEventListener("click", function () {
    projetsList.innerHTML = "";
    resetFilters();
    //on ajoute la class highlight à l'objet en question
    boutonTous.classList.add("highlights")
    genererProjets(projets);
});

//fonction des autres boutons filtre
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

//On vérifie que le token bearer est présent pour modifier les projets
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

//pour afficher les projets dans la liste de projets de la modale
const modalLink = document.querySelector(".modal-js")
const modal = document.querySelector("#modal1")
const mainWrapper = document.querySelector(".main-wrapper")
const modalPhotoListeWrapper = document.querySelector(".modal-liste-photo")
const modalPhotosWrapper = document.querySelector(".modal-photos-wrapper")
function modalAfficherProjets() {
    for (let i = 0; i < projets.length; i++) {
        const projet = projets[i]
        const PhotoParent = document.createElement("div")
        PhotoParent.className = "photo-parent"
        const photoElement = document.createElement("img")
        photoElement.src = projet.imageUrl
        const deleteButton = document.createElement("button")
        deleteButton.className = "delete-button"
        deleteButton.type = "button"
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

modalAfficherProjets()

//fonction d'ouverture de la modale
const openModal = function (e) {
    e.preventDefault()
    mainWrapper.setAttribute("aria-hidden", "true")
    modal.style.display = null;
    modal.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true");
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)

    //fonction pour supprimer un projet de la liste
    const deletebuttons = document.querySelectorAll(".delete-button")
    for (let i = 0; i < deletebuttons.length; i++) {
        const deletebutton = deletebuttons[i]
        deletebutton.addEventListener("click", async function () {
            e.preventDefault()
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

//fonction de fermeture de modale
const closeModal = function (e) {
    e.preventDefault()
    mainWrapper.setAttribute("aria-hidden", "false")
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-modal", "false");
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
}

modalLink.addEventListener("click", openModal)

//pour quitter la modale à l'aide d'esc pour l'accessibilité
window.addEventListener("keydown", function (event) {
    if (event.key === "Escape" || event.key === "Esc") {
        closeModal(event)
        returnWhenClose(event)
    }
})

//code de la deuxième modale
const modalWrapperDeux = modal.querySelector(".modal-ajouter-photo")

//Pour retourner à la première page de la modale quand on quitte la modale
const returnWhenClose = function () {
    modalPhotoListeWrapper.style.display = "block";
    modalWrapperDeux.style.display = "none";
    modal.querySelector(".js-modal-close2").removeEventListener("click", returnWhenClose)

}

//passage d'une modale à l'autre
const returnButton = modal.querySelector(".js-modal-return")
const openModalDeux = function () {
    modalPhotoListeWrapper.style.display = "none";
    modalWrapperDeux.style.display = "block";
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-close2").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close2").addEventListener("click", returnWhenClose)
    returnButton.addEventListener("click", retourModalUne)

}

//fonction pour retourner à la première page de la modale en cliquant sur le bouton retour
const retourModalUne = function () {
    modalPhotoListeWrapper.style.display = "block";
    modalWrapperDeux.style.display = "none";
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close2").removeEventListener("click", closeModal)
    returnButton.removeEventListener("click", retourModalUne)
}

//application de la fonction pour passer à la deuxième page de la modale
const buttonAjouterPhoto = modal.querySelector(".ajouter-photo")
buttonAjouterPhoto.addEventListener("click", openModalDeux)

//Récupération des balises inputs du formulaire pour ajouter une photo
const inputFile = modal.querySelector("#file")
const inputTitle = modal.querySelector("#title")
const inputCategory = modal.querySelector("#category")

//on joint le bouton ajouter photo à l'input file
const buttonFileInput = modal.querySelector(".button-file-input")
buttonFileInput.addEventListener("click", function (event) {
    event.preventDefault()
    inputFile.click()
})

//Pour afficher un preview de la photo choisie
const previewImage = (event) => {
    const blockInputFile = document.querySelector(".input-file-block")
    const inputInfos = document.querySelector(".input-file-infos")
    const imageFiles = event.target.files;
    const imageSrc = URL.createObjectURL(imageFiles[0])
    const imagePreviewElement = document.createElement("img")
    imagePreviewElement.alt = "image sélectionnée"
    imagePreviewElement.src = imageSrc
    imagePreviewElement.className = "image-preview"
    blockInputFile.appendChild(imagePreviewElement)
    inputInfos.style.display = "none"
}

inputFile.addEventListener("change", previewImage)

//fonction pour activer le boutton seulement si les champs du formulaire sont remplis
const buttonValiderForm = modal.querySelector(".modal-valider-button")
buttonValiderForm.disabled = true

inputFile.addEventListener("input", updateButtonValider)
inputTitle.addEventListener("input", updateButtonValider)
inputCategory.addEventListener("input", updateButtonValider)

//Activation du bouton seulement si les trois inputs sont remplis
function updateButtonValider() {
    if (inputFile.files.length > 0 && inputTitle.value !== "" && inputCategory.value !== "null") {
        buttonValiderForm.disabled = false
    } else {
        buttonValiderForm.disabled = true
    }
}

//fonction pour ajouter un projet à la liste
const formAjoutPhoto = modal.querySelector(".form-ajout-photo")
formAjoutPhoto.addEventListener("submit", async function (event) {
    event.preventDefault()

    const projetInput = new FormData()
    projetInput.append("image", modal.querySelector("#file").files[0]); // Assuming the file input has the id "file"
    projetInput.append("title", modal.querySelector("#title").value);
    projetInput.append("category", modal.querySelector("#category").value);

    const reponsePostProjet = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${tokenBearer}`
        },
        body: projetInput
    })
    miseAJourProjets()
})

function miseAJourProjets(){
    modalPhotosWrapper.innerHTML = ""
    modalAfficherProjets()
    projetsList.innerHTML = ""
    genererProjets(projets)
}
