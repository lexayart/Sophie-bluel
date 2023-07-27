const formulaireLogin = document.querySelector(".login-form");
const errorParent = document.querySelector(".error-message")
formulaireLogin.addEventListener("submit", async function (event) {
    event.preventDefault();
    console.log("ca marche")
    /*       const emailUser = document.querySelector(".input-email");
           const mdpUser = document.querySelector(".insput-password");*/
    const loginInput = {
        email: (event.target.querySelector("[name=input-email").value),
        password: (event.target.querySelector("[name=input-password").value)
    };
    const chargeUtile = JSON.stringify(loginInput);
    const reponseAPI = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: chargeUtile
    });
    const reponseLogin = await reponseAPI.json();
    console.log(reponseLogin);
    if (reponseAPI.status === 200) {
        const tokenLogin = reponseLogin.token;
        window.sessionStorage.setItem("token", tokenLogin);
        window.location.assign("./index.html");
    }
    else {
        errorParent.innerHTML ="";
        const errorMessage = document.createElement("p");
        errorMessage.innerText = "Votre email ou mot de passe sont incorrects";
        errorParent.appendChild(errorMessage);
    }
    console.log(reponseLogin)
})