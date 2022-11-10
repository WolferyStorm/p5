const url = window.location.search;
const id = new URLSearchParams(url).get("id");

function getProductData (){
    fetch('http://localhost:3000/api/products/'+id)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        viewProduct(data)
    })
    .catch(function(error){
        console.log(error)
    })
}

getProductData()

 // Afficher produit

function viewProduct (product){
    const imgDiv = document.getElementsByClassName("item__img")[0]
    imgDiv.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}"/>`

    const title = document.getElementById("title")
    title.innerText = product.name

    const price  = document.getElementById("price")
    price.innerText = product.price

    const description = document.getElementById("description")
    description.innerText = product.description

    let colorsofproduct = product.colors;
    for (let colors of colorsofproduct) {
        let colorOption = document.createElement("option");
        document.getElementById("colors").appendChild(colorOption);
        colorOption.setAttribute("option", colors);
        colorOption.innerHTML = colors;
    }

}

let btnCart = document.getElementById("addToCart")
btnCart.addEventListener("click",onsubmit)

//

function onsubmit (){
    let colorSelect = document.getElementById("colors")
    if (colorSelect.value ==""){
        alert("Veuillez choisir une couleur")
        return
    }
    let quantityProduct = document.getElementById("quantity")
    let quantityValue = parseInt(quantityProduct.value)
    if (quantityValue <1 | quantityValue >100){
        alert("Veuillez choisir une quantité valide")
        return
    }

    let carts = JSON.parse(window.localStorage.getItem("carts"))
    if(!carts){
        carts = []
    }
    let item = {
        id : id,
        couleur : colorSelect.value,
        quantite : quantityValue
    }
    let productExist = carts.find(element =>element.id === item.id && element.couleur === item.couleur)
    if(productExist){
        productExist.quantite = parseInt(productExist.quantite)+parseInt(item.quantite)
    }else{
        carts.push(item)
    }
    window.localStorage.setItem("carts",JSON.stringify(carts))
    alert("Votre produit à bien été ajouté au panier")
    
}