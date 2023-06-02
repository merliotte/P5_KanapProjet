// ---------------------------------------------------------------
// RECUPERER LES INFORMATIONS DU LOCALSTORAGE
// ---------------------------------------------------------------
function getIdFromLocalStorage (arrayCartItems){
    return arrayCartItems.map(item => item.id);
};

// ---------------------------------------------------------------
// RECUPERER L'OBJET DANS L'API ET LE STOCK 
// ---------------------------------------------------------------
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

// ---------------------------------------------------------------
// RECUPERER ET CREER UN TABLEAU 
// ---------------------------------------------------------------
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
// ---------------------------------------------------------------
// CREER DES ARTICLES HTML 
// ---------------------------------------------------------------
function renderKanapDataIntoHtml(kanapArray) {
    const articlesContainer = document.getElementById('cart__items');
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

// ---------------------------------------------------------------
// SUPPRIME UN ELEMENT AU CLICK
// ---------------------------------------------------------------
const deleteElement = (arrayKanaps) => {
  const cartItemsStorage = JSON.parse(localStorage.getItem('cartItems'));

  document.querySelectorAll(".deleteItem").forEach((button, index) => {
    button.addEventListener("click", () => {
      try {
        const articleElement = button.closest(".cart__item");
        cartItemsStorage.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItemsStorage));
        arrayKanaps.splice(index,1);

        // Cible le contenu supprimez 
        articleElement.parentNode.removeChild(articleElement);

        totalQuantity(cartItemsStorage);
        totalPrice(arrayKanaps);
      } catch (error) {
        console.error("Erreur du chargement du LocalStorage", error);
      }
    });
  });
};

// ---------------------------------------------------------------
// PERMET DE METTRE A JOUR LA QUANTITE/PRIX AU CHANGEMENT DE INPUT
// ---------------------------------------------------------------
const changementQuantity = (arrayKanaps) => {

     document.querySelectorAll('.itemQuantity').forEach((inputValue) => {
        inputValue.addEventListener("change", (event) => {
            try {
               
              const kanapIndex = arrayKanaps.findIndex(item => item.id === inputValue.closest("article").getAttribute("data-id"));
              const newCartQuantityItems = updateAfterQuantityChange(kanapIndex, parseInt(event.target.value),arrayKanaps);
                totalQuantity(newCartQuantityItems);
                totalPrice(arrayKanaps);
            } catch (error) {
                console.error("Erreur du chargement du LocalStorage", error);
            }
        });
    });
};

// ---------------------------------------------------------------
// PERMET DE METTRE A JOUR LA QUANTITE
// ---------------------------------------------------------------
function updateAfterQuantityChange(index, newQuantity,arrayKanaps) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems"));
      cartItems[index].quantity = newQuantity;
      arrayKanaps[index].quantity = newQuantity;

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    return cartItems; 
};
// ---------------------------------------------------------------
// CALCUL LA QUANTITE TOTAL
// ---------------------------------------------------------------
function totalQuantity(arrayKanaps) {
  const totalArticleElement = document.getElementById('totalQuantity');

  const totalArticles = arrayKanaps.reduce((actual, kanap) => {
    return actual + kanap.quantity;
  }, 0);

  totalArticleElement.textContent = totalArticles;
};
// ---------------------------------------------------------------
// CALCUL LE TOTAL DU PRIX 
// ---------------------------------------------------------------
const totalPrice = (arrayKanaps) => {
  const totalPriceItems = arrayKanaps.reduce((actual, next) => {
    if (typeof actual === "object"){
      return ( actual.quantity * actual.price ) + ( next.quantity * next.price )
    } 
    return actual + next.quantity * next.price 
   },0);
   document.getElementById("totalPrice").textContent = totalPriceItems;
};

// ---------------------------------------------------------------
// PERMET DE CONTROLER SI LA VALEUR EST COMPRISE ENTRE 1 ET 100 
// ---------------------------------------------------------------
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
};

// ---------------------------------------------------------------
// PERMET DE CONTROLER SI LA VALEUR EST UN ENTIER
// ---------------------------------------------------------------
const controlQuantityTest = () => {
  const inputQuantity = document.querySelectorAll(".itemQuantity");

  inputQuantity.forEach((inputQuantityTest) => {
    inputQuantityTest.addEventListener("input", (event) => {
      event.target.value = event.target.value.replace(/\D/g, '');
    });
  });
};
// ---------------------------------------------------------------
// PERMET VERIFIER LE CONTENU DES CHAMPS REMPLIS
// ---------------------------------------------------------------
function submitForm() {
  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    // VERIFIE SI UN CHAMP EST VIDE
    function fieldValidatorIsEmpty(value) {
      return value.length ? true : "Veuillez remplir ce champ."
    }
    // VERIFIE LE FORMAT DES CHAMPS REMPLIS ET RETOURNE SI CELUI CI EST VALIDE
    function fieldValidatorName(value) {
      return /^[a-z ,.'-]+$/i.test(value) ? true : "Veuillez entrer un prénom valide."
    }

    function fieldValidatorLastName(value) {
      return /^[a-z ,.'-]+$/i.test(value) ? true : "Veuillez entrer un nom valide."
    }

    function fieldValidatorMail(value) {
      return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i.test(value) ? true : "veuillez entrer une adresse email valide."
    }
    
    function fieldValidatorWrapper(value, fn) {
      const isFieldEmpty = fieldValidatorIsEmpty(value)

      if (typeof isFieldEmpty === "string" ) return isFieldEmpty;
      return fn ? fn(value) : true
    }

    // TABLEAU
    const inputData = [
      {
        inputId: "firstName",
        validator: (inputValue) => fieldValidatorWrapper(inputValue, fieldValidatorName), 
        inputIdError: "firstNameErrorMsg",
      },

      {
        inputId: "lastName",
        validator: (inputValue) => fieldValidatorWrapper(inputValue, fieldValidatorLastName),  
        inputIdError: "lastNameErrorMsg",
      },

      {
        inputId: "address",
        validator: (inputValue) => fieldValidatorWrapper(inputValue),  
        inputIdError: "addressErrorMsg",
      },

      {
        inputId: "city",
        validator: (inputValue) => fieldValidatorWrapper(inputValue),  
        inputIdError: "cityErrorMsg",
      },

      {
        inputId: "email",
        validator: (inputValue) => fieldValidatorWrapper(inputValue, fieldValidatorMail),  
        inputIdError: "emailErrorMsg",
      },

    ];

    // PERMET DE VERIFIER LES CONDITIONS
    const isFormValid = inputData.every((data) => {
      const inputValue = document.getElementById(data.inputId).value;
      const isFieldValid = data.validator(inputValue);
      const inputAsError = document.getElementById(data.inputIdError);


      if (isFieldValid === true && inputAsError.textContent) {
        inputAsError.textContent = "";
      }

      if (typeof isFieldValid === "string") {
        document.getElementById(data.inputIdError).textContent = isFieldValid;
        return false
      }
      console.log(isFieldValid);
      return isFieldValid
    })
      
    if(!isFormValid) return false; 
    // CREER UN OBJET 
    const dataToSend = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value
    };

    const kanapId = JSON.parse(localStorage.getItem("cartItems")).map((item) => item.id);
    
    fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ contact: dataToSend, products: kanapId })
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
  })
};

// ---------------------------------------------------------------
// APPEL TOUTES LES FONCTIONS
// ---------------------------------------------------------------
async function main () {
    try {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      // Vérification de la préscence 
      if (!cartItems.length) return;
      const productIdArray = getIdFromLocalStorage(cartItems); 

      const arrayKanaps = await getProductFromApi(productIdArray, cartItems);

      renderKanapDataIntoHtml(arrayKanaps);

      deleteElement(arrayKanaps);

      totalQuantity(arrayKanaps);
      totalPrice(arrayKanaps);

      controlQuantity(totalQuantity); 

      changementQuantity(arrayKanaps);

      submitForm();

    } catch (error) {
        console.log(error);
    }
};
main();
