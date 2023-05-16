// Récupération des informations de la page source
const urlParams = new URL(document.location).searchParams;
// Ajout de l'ID 
const urlId = urlParams.get("id");
// Connexion avec l'API 
const url = `http://localhost:3000/api/products/${urlId}`;
const arrayId = [
    {htmlElementId: "title",propsToLoadFromData:"name"}, 
    {htmlElementId: "description", propsToLoadFromData:"description"},
    {htmlElementId: "price", propsToLoadFromData:"price"},
    {htmlElementId: ".item__img > img", propsToLoadFromData:"imageUrl", useMethodByClass: true},
    {htmlElementId: ".item__img > img ", propsToLoadFromData:"altTxt"},
    {htmlElementId: "colors", propsToLoadFromData: "colors"}
];
//  Création de la function et Récupération des informations de l'API avec fetch
function addElements() { 
    // Ajout des informations depuis l'API
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
        arrayId.forEach(addkanap => {
            const img = document.querySelector(addkanap.htmlElementId);
           if(addkanap.useMethodByClass ) {
            img.setAttribute("src",data[addkanap.propsToLoadFromData]);
            return;  
        }      
           else if (addkanap.propsToLoadFromData === "altTxt") {
            img.setAttribute("alt",data[addkanap.propsToLoadFromData] + " - description de l'image");
            return;       
        }
           document.getElementById(addkanap.htmlElementId).innerHTML = data[addkanap.propsToLoadFromData];
        });
        // Lien avec le DOM et insertion de texte 
        const select = document.querySelector("select");
        select.innerHTML = `<option>Sélectionnez une couleur</option>`;
        
        // Réclamation des couleurs avec une boucle forEach
        data.colors.forEach(color => {
            select.innerHTML += `<option value="${color}">${color}</option>`;
        }); 
        // Stockage au click des informations dans le localStorage
        const informationKanap = document.getElementById("addToCart");
        const saveColor = document.getElementById("colors");
        const quantityKanap = document.getElementById("quantity");
        
        // EVENT
        informationKanap.addEventListener("click", () => {
            const selectedColor = saveColor.value;
            const selectedQuantity = quantityKanap.value;
            console.log(selectedColor);
            // Création de l'objet 
            if (selectedColor !== "Sélectionnez une couleur" && selectedQuantity > 0 ) {
                const cartItem = {
                    id : urlId,
                    color : selectedColor,
                    quantity : selectedQuantity,
                };
                
                // Récupérer les éléments de panier existants à partir du localstorage et les convertir en tableau   
                let cartItems = JSON.parse(window.localStorage.getItem("cartItems") || "[]");
                // Vérifier si un article de la même couleur existe déjà dans le panier
                const existingItemIndex = cartItems.findIndex((item) => item.color === selectedColor && item.quantity === selectedQuantity );
            if (existingItemIndex !== -1 )   {
                // Mettre à jour la quantité de l'article existant
                existingItemIndex.quantity += Number(selectedQuantity);
            } else {
                // Ajouter un nouvel article au tableau des articles du panier
                cartItems = [cartItem];
            }
            // Stocker les articles du panier mis à jour dans le localstorage
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            
            // Afficher quand le panier est rempli 
            if (cartItems.length > 0) {
                const panierRempli = document.getElementById("panier");
                panierRempli.style.color = "red";
            }
        }
    });
    // Réclamation des items avec une boucle forEach

      
    console.log(data);
});    
}
// Appel à la fonction 
addElements();
console.log(url);


 






