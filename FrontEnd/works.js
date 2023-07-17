//on récupère les projets de l'API
const reponse = await fetch("http://localhost:5678/api/works");
const projets = await reponse.json();

//on récupère le parent dans le DOM
const sectionGallery = document.querySelector(".gallery");

//on génère les filtres
function genererFiltrers() {
    const filtersList = document.createElement("div");
    filtersList.className = "filters";

    const filterTous = document.createElement("input");
    filterTous.className = "tous";
    filterTous.type = "button";
    filterTous.value = "Tous";
    const filterObjets = document.createElement("input");
    filterObjets.className = "objets";
    filterObjets.type = "button";
    filterObjets.value = "Objets";
    const filterAppartements = document.createElement("input");
    filterAppartements.className = "appartements";
    filterAppartements.type = "button";
    filterAppartements.value = "Appartements";
    const filterHotels = document.createElement("input");
    filterHotels.className = "hotels";
    filterHotels.type = "button";
    filterHotels.value = "Hôtels et restaurants";
    sectionGallery.appendChild(filtersList);
    filtersList.appendChild(filterTous);
    filtersList.appendChild(filterObjets);
    filtersList.appendChild(filterAppartements);
    filtersList.appendChild(filterHotels);
};

genererFiltrers();

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

//boutons filtre
const boutonTous = document.querySelector(".tous");
boutonTous.addEventListener("click", function () {
    projetsList.innerHTML = "";
    boutonTous.className = "higlight"
    genererProjets(projets);

});

const boutonObjets = document.querySelector(".objets");
boutonObjets.addEventListener("click", function () {
    const projetsObjets = projets.filter(function (projet) {
        return projet.category.name === "Objets";
    });

    projetsList.innerHTML = "";
    genererProjets(projetsObjets);
});

const boutonAppartements = document.querySelector(".appartements");
boutonAppartements.addEventListener("click", function () {
    const projetsAppartements = projets.filter(function (projet) {
        return projet.category.name === "Appartements";
    });

    projetsList.innerHTML = "";
    genererProjets(projetsAppartements);
});

const boutonHotels = document.querySelector(".hotels");
boutonHotels.addEventListener("click", function () {
    const projetsHotels = projets.filter(function (projet) {
        return projet.category.name === "Hotels & restaurants";
    });

    projetsList.innerHTML = "";
    genererProjets(projetsHotels);
});