function getData (){
    //récupérer les donées de l'API
    fetch ('http://localhost:3000/api/products')
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        data.forEach(element => {
            createElementDom(element)
        });
    })
    .catch(function(error){
        console.log(error)
    })
}
let card = document.getElementById('items')
getData()

function createElementDom(data){
    //data fais référence à un produit en particulier
    let article = document.createElement('a')
    article.setAttribute("href","./product.html?id="+data._id)
    article.innerHTML = `
    <article>
      <img src="${data.imageUrl}" alt="${data.altTxt}">
      <h3 class="productName">${data.name}</h3>
      <p class="productDescription">${data.description}</p>
    </article>`
card.appendChild(article)
}