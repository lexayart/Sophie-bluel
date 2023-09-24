//On récupère les balises utiles du DOM
const formulaireLogin = document.querySelector(".login-form");
const errorParent = document.querySelector(".error-message")

//fonction pour login l'utilisateur
formulaireLogin.addEventListener("submit", async function (event) {
    event.preventDefault();
    //on met le mail et le mot de passe rentrés par l'utilisateur 
    //dans la charge utile qu'on va stringify pour l'envoyer à l'API
    const loginInput = {
        email: (event.target.querySelector("[name=input-email]").value),
        password: (event.target.querySelector("[name=input-password]").value)
    };
    const chargeUtile = JSON.stringify(loginInput);
    //On envoie le tout à l'API et on traite par la suite la réponse
    const reponseAPI = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: chargeUtile
    });
    const reponseLogin = await reponseAPI.json();
    //si le status est de 200, c'est une réussite
    if (reponseAPI.status === 200) {
        const tokenLogin = reponseLogin.token;
        window.sessionStorage.setItem("token", tokenLogin);
        window.location.assign("./index.html");
    }
    //Sinon, c'est que les identifiants sont faux donc affichage du message d'erreur
    else {
        errorParent.innerHTML = "";
        const errorMessage = document.createElement("p");
        errorMessage.innerText = "Votre email ou mot de passe sont incorrects";
        errorParent.appendChild(errorMessage);
    }
})