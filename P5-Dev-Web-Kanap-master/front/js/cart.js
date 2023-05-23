// RECUPERER LES INFORMATIONS DU LOCALSTORAGE
function getIdFromLocalStorage (arrayCartItems){
    return arrayCartItems.map(item => item.id);
};
// RECUPERER L'OBJET ET LE STOCK 
async function fetchProduct(kanapId) {
    try {
        const kanap = await fetch(`http://localhost:3000/api/products/${kanapId}`)
        const promessdata = kanap.json()
        return promessdata;
}
    catch (error) {
        console.error(error.message);
    } 
};
// RECUPERER ET CREER UN TABLEAU 
async function getProductFromApi (arrayStringId, arrayCartItems) {
    return await Promise.all(
        await arrayStringId.map(async (id, index) => {
           const kanap =  await fetchProduct(id);
           return {
                ...kanap, 
                ...arrayCartItems[index]
           }
        })
    )
};
async function getasyncfunction(arraystringID, arrayitems) {
    return await Primise.all (
      await arraystringID.map(async(id, index) => {
        const kanap = await fetchProdcut(id)
      })
    )
}
// CREER DES ARTICLES HTML 
function renderKanapDataIntoHtml(kanapArray) {
    const articlesContainer = document.getElementById('cart__items');
    // Efface le HTML de base 
    articlesContainer.innerHTML= '';
    kanapArray.forEach((canap) => {
        const article = document.createElement('article');
        article.classList.add( 'cart__item');
        article.setAttribute ("data-id", canap.id);
        article.setAttribute ("data-color", canap.color);
            article.innerHTML += `
            <div class="cart__item__img">
              <img src="${canap.imageUrl}" alt="${canap.altTxt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${canap.name}</h2>
                <p>${canap.color}</p>
                <p> Prix : ${canap.price} €</p>
                <p>Prix Total : ${(canap.price)*(canap.quantity)} €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Quantité :</p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${canap.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
            `;   
      articlesContainer.appendChild(article);
    }
    ); 
    controlQuantity();
    changementQuantity(kanapArray);  
  };
// Supprime un Element au click 
const deleteElement =  (deleteButtons) => {
  const cartItemsStorage = JSON.parse(localStorage.getItem('cartItems'));
    deleteButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        try {
          const articleElement = button.closest(".cart__item");
            cartItemsStorage.splice(index, 1);
            localStorage.setItem('cartItems', JSON.stringify(cartItemsStorage));
          // Cible le contenu supprimez 
            articleElement.parentNode.removeChild(articleElement);
            totalQuantity(cartItemsStorage);
        } catch (error) {
          console.error("Erreur du chargement du LocalStorage", error);
        }
      });
    });
};
// Controle du changement de la quantité indiqué
const changementQuantity = (arrayKanaps) => {
    const inputQuantity = document.querySelectorAll('.itemQuantity');
    
    inputQuantity.forEach((inputValue, index) => {
        inputValue.addEventListener("change", (event) => {
            try {
              controlQuantity(arrayKanaps);
              const newCartQuantityItems = updateAfterQuantityChange(index, parseInt(event.target.value),arrayKanaps);
              totalQuantity(newCartQuantityItems);
              totalPrice(arrayKanaps);
              renderKanapDataIntoHtml(arrayKanaps);
            } catch (error) {
                console.error("Erreur du chargement du LocalStorage", error);
            }
        });
    });
};
// PERMET DE METTRE A JOUR LA QUANTITE
function updateAfterQuantityChange(index, newQuantity,arrayKanaps) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems"));
  
    cartItems[index].quantity = newQuantity;
    arrayKanaps[index].quantity = newQuantity;

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    return cartItems; 
}
// Calcul du Total quantité
function totalQuantity(arrayKanaps) {
  const totalArticleElement = document.getElementById('totalQuantity');

  const totalArticles = arrayKanaps.reduce((actual, kanap) => {
    return actual + kanap.quantity;
  }, 0);

  totalArticleElement.textContent = totalArticles;
}
// Calcul du Total du Prix 
const totalPrice = (arrayKanaps) => {
    const totalPriceItem = document.querySelector("#totalPrice")
    let totalPriceItems = 0;

    arrayKanaps.forEach((kanap) => {
            totalPriceItems += parseInt((kanap.price)*(kanap.quantity)) ;
    });
    totalPriceItem.textContent = totalPriceItems.toFixed(2);

}
// Controle les données mis par l'utilisateur dans l'input 
function controlQuantity() {
  const inputQuantityList = document.querySelectorAll('.itemQuantity');

  inputQuantityList.forEach((inputQuantity) => {
    inputQuantity.addEventListener("input", (event) => {
      const value = parseInt(event.target.value);

      if (value < 0 || value > 100) {
        event.target.value = Math.max(0, Math.min(100, value));
      }
      controlQuantityTest();
    });
  });
}


const controlQuantityTest = () => {
  const inputQuantity = document.querySelectorAll(".itemQuantity");

  inputQuantity.forEach((inputQuantityTest) => {
    inputQuantityTest.addEventListener("input", (event) => {
      event.target.value = event.target.value.replace(/\D/g, '');
    });
  });
};

// Test si un champ et vide et lui change sa couleur lors du remplissage
function testInData(element) {
	if (element.id != 'order') {
		if (element.value === '') {
			element.setAttribute('style', 'border:1px solid #FF0000; padding-left: 15px;');
		} else {
			element.setAttribute('style', 'border:1px solid #767676; padding-left: 15px;');
			switch (element.id) {
				case 'firstName': {
					document.querySelector('#firstNameErrorMsg').textContent = '';
					break;
				}
				case 'lastName': {
					document.querySelector('#lastNameErrorMsg').textContent = '';
					break;
				}
				case 'address': {
					document.querySelector('#addressErrorMsg').textContent = '';
					break;
				}
				case 'city': {
					document.querySelector('#cityErrorMsg').textContent = '';
					break;
				}
			}
		}
	}
}

// Test Si le champ est vide le met en évidence en rouge
const testFieldsIsEmpty = () => {
	const form = document.querySelector('.cart__order__form');
	const inputs = form.querySelectorAll('input');
	let pass = true;
	inputs.forEach((element) => {
		element.addEventListener('input', () => testInData(element));

		switch (element.id) {
			case 'firstName': {
				if (element.value == '') {
					element.setAttribute('style', 'border:1px solid #FF0000; padding-left: 15px;');
					document.querySelector('#firstNameErrorMsg').textContent = 'Veuillez entrer votre prénom';
					pass = false;
				}
			}
			case 'lastName': {
				if (element.value == '') {
					element.setAttribute('style', 'border:1px solid #FF0000; padding-left: 15px;');
					document.querySelector('#lastNameErrorMsg').textContent = 'Veuillez entrer votre nom';
					pass = false;
				}
			}
			case 'address': {
				if (element.value == '') {
					element.setAttribute('style', 'border:1px solid #FF0000; padding-left: 15px;');
					document.querySelector('#addressErrorMsg').textContent = 'Veuillez entrer votre adresse';
					pass = false;
				}
			}
			case 'city': {
				if (element.value == '') {
					element.setAttribute('style', 'border:1px solid #FF0000; padding-left: 15px;');
					document.querySelector('#cityErrorMsg').textContent = 'Veuillez entrer une ville';
					pass = false;
				}
			}
			case 'email': {
				if (element.value == '') {
					element.setAttribute('style', 'border:1px solid #FF0000; padding-left: 15px;');
					document.querySelector('#emailErrorMsg').textContent = 'Veuillez entrer une adresse email valide !';
					pass = false;
				}
			}
		}
	});
	return pass;
}

function addFormSubmitListener() {
    // Ajouter un gestionnaire d'événements "submit" au formulaire
    const form = document.querySelector('.cart__order__form');
    form.addEventListener('submit', submitForm);
  }
  
  function submitForm(event) {
    event.preventDefault(); // Empêche la page de se recharger
  
    // Récupére les données du formulaire
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const email = document.getElementById('email').value;
  
    // Formate les données dans un objet JSON
    const contact = {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email
    };
    const products = listIDs(); // récupérer la liste des IDs de la commande
    
    const order = { contact, products }; // objets à envoyer au serveur
  
    // Envoi les données à votre API avec fetch()
    fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    })
      .then(response => response.json())
      .then(data => {
        // Traiter la réponse de l'API
        const orderId = data.orderId;
        // Rediriger l'utilisateur vers la page de confirmation
        window.location.href = `confirmation.html?orderId=${orderId}`;
      })
      .catch(error => {
        console.error('Erreur lors de l\'envoi de la commande:', error);
      });
  }
  
function listIDs(arrayKanap) {
    let ids = [];
    if (Array.isArray(arrayKanap)) {
      arrayKanap.forEach(kanap => {
        ids.push(kanap.id);
      });
    }
    return ids;
  }
  
  
function theBasketIsEmpty() {
    const parent = document.querySelector('#mess-oblig');
    parent.style.cssText = 'color: #82FA58; font-weight: bold; border-style: solid; border-color: #E3F6CE; background: #3d4c68; padding: 10px; border-radius: 15px; text-align: center;';
    parent.textContent = 'Votre panier est vide';
}
 const controlEmail = () => {
    const mailElement = document.querySelector("#email");
	const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i);
    const valueTextMail = mailElement.regex ; 
    const errorMsg = document.querySelector("#emailErrorMsg");

        if(valueTextMail === "") {
            errorMsg.innerHTML = "Veuillez entrer votre adresse e-mail.";
            regex.classList.add("error");
        return false ;
    }

        if (!mailElement.test(valueTextMail)){
            errorMsg.innerHTML = 'Veuillez saisir une adresse e-mail valide.';
            regex.classList.add("error");
        return false;
    }

        errorMsg.innerHTML = '';
        elem.classList.remove('error');
    return true;

}

function testValidityForm(parent) {
	let textTemp = parent.value;
    const newStr = textTemp.replace(/[^A-Za-z\s]/g, "");
        parent.value = newStr;
}
const orderButton = () => {
        const orderButtonSelector = document.querySelector("#order");
            orderButtonSelector.addEventListener('click', (order) => submitForm(order));
        const parent = document.getElementById("firstName");
            parent.addEventListener("keyup", () => testValidityForm(parent))
        const parent2 = document.getElementById("lastName");
            parent2.addEventListener("keyup", () => testValidityForm(parent2))
        const parent3 = document.getElementById("address");
            parent3.addEventListener("keyup", () => testValidityForm(parent3))
};

// Appel et stocke les autres fonctions 
async function main () {
    try {
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        // Vérification de la préscence 
        if (!cartItems.length) return;
        const productIdArray = getIdFromLocalStorage(cartItems); 

        const arrayKanaps = await getProductFromApi(productIdArray, cartItems);

        const renderContainer  = renderKanapDataIntoHtml(arrayKanaps);

        const deleteButtons = document.querySelectorAll(".deleteItem");
        deleteElement(deleteButtons, arrayKanaps);

        totalQuantity(arrayKanaps);
        totalPrice(arrayKanaps);

        controlQuantity(totalQuantity); 

        testFieldsIsEmpty();
        
        changementQuantity(arrayKanaps);

        addFormSubmitListener();

        listIDs(arrayKanaps);

        orderButton(arrayKanaps);
    } catch (error) {
        console.log(error);
    }
}

main();
