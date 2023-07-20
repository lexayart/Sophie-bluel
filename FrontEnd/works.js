//on récupère les projets de l'API
const reponse = await fetch("http://localhost:5678/api/works");
const projets = await reponse.json();



//on récupère le parent dans le DOM
const sectionGallery = document.querySelector(".gallery");

//on génère les filters
function genererfilterrs() {
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

genererfilterrs();

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