// ---------------------------------------------------------------
// PERMET DE RECUPERER LES DONNEES DE L'API ET DE CREER UN ITEM HTML
// ---------------------------------------------------------------
const url = "http://localhost:3000/api/products"; 

 fetch(url)
.then( (response) => response.json())
.then ((data) => {

data.forEach(kanap => { 
  document.getElementById("items").innerHTML+= `
    
        <a href="./product.html?id=${kanap._id}">
            <article>
              <img src="${kanap.imageUrl}" alt="${kanap.altTxt}">
              <h3 class="productName">${kanap.name}</h3>
              <p class="productDescription">${kanap.description}</p>
            </article>
            `
  });
}); 


