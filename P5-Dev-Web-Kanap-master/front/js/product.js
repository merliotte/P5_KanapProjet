// ---------------------------------------------------------------
// PERMET DE RECUPERER LES INFORMATIONS DES KANAPS
// ---------------------------------------------------------------
async function fetchKanapData() {
	try {
  	const kanapId = new URL(window.location).searchParams.get('id');
  	const res = await fetch(`http://localhost:3000/api/products/${kanapId}`);
      const canapData = await res.json();
      return canapData;
  } catch (error) {
  	console.error(error.message);
    window.alert (" La Connexion a échoué !");
  }
};
// ---------------------------------------------------------------
// PERMET D'AFFICHER LES INFORMATIONS DU KANAP
// ---------------------------------------------------------------
function fillHtmlWithCanapData(data) {
	const arrayId = [
    {htmlElementId: "title",propsToLoadFromData:"name"}, 
    {htmlElementId: "description", propsToLoadFromData:"description"},
    {htmlElementId: "price", propsToLoadFromData:"price"},
    {htmlElementId: ".item__img > img", propsToLoadFromData:"imageUrl", useMethodByClass: true},
    {htmlElementId: ".item__img > img ", propsToLoadFromData:"altTxt"},
    {htmlElementId: "colors", propsToLoadFromData: "colors"}
	];
  
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
       
     const select = document.querySelector("select");
     select.innerHTML += `<option>Sélectionnez une couleur</option>`;
        // Réclamation des couleurs avec une boucle forEach
        data.colors.forEach(color => {
            select.innerHTML += `<option value="${color}">${color}</option>`;

        });  
};

function isCanapInLocalStorage(canapId) {
  const cartItems = JSON.parse(window.localStorage.getItem("cartItems") || "[]");
  return cartItems.findIndex((item) => item.id === canapId);
  
};

// ---------------------------------------------------------------
//  PERMET DE STOCKER LES ITEMS DANS LE LOCALSTORAGE
// ---------------------------------------------------------------
function addItemsIntoStorage(canapId) {
  const saveColor = document.getElementById("colors");
  const quantityKanap = document.getElementById("quantity");
  const indexCanap = isCanapInLocalStorage(canapId);
  const cartItems = JSON.parse(window.localStorage.getItem("cartItems") || "[]");
  const newKanapData = {
  	id: canapId,
    quantity: Math.min(parseInt(quantityKanap.value), 100),
    color: saveColor.value,
  };
  if (saveColor.value === "Sélectionnez une couleur" || quantity.value === "0")
    return saveColor;

  if (indexCanap >= 0) {
  	cartItems[indexCanap] = newKanapData;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    return;
  }

  cartItems.push(newKanapData);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  if (newKanapData.quantity !== parseInt(quantityKanap.value)) {
    console.log("La quantité a été limitée à 100.");
  }
};
function controlQuantity() {
	const quantity = document.querySelector('#quantity').value;
    if (quantity < 0 ) document.querySelector('#quantity').value = 0;
    if (quantity > 100) document.querySelector('#quantity').value = 100;
};

async function main() {
    try {
        
        const canap = await fetchKanapData();
        fillHtmlWithCanapData(canap);
        document.querySelector('[name="itemQuantity"]').addEventListener('keyup', controlQuantity);
        document.getElementById("addToCart").addEventListener('click', () => addItemsIntoStorage(canap._id)
    );
  } catch(error) {
  	console.error(error.message);
  }
}

main();