let savedProduct = JSON.parse(localStorage.getItem("carts"));
console.log(savedProduct);
let total = 0

function getData (product){
    fetch ('http://localhost:3000/api/products/'+product.id)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
    viewItem(data,product)
    })
    .catch(function(error){
        console.log(error)
    })
}


if (savedProduct == null || savedProduct.length == 0 ) {
    document.getElementById("cart__items").innerHTML = `Votre panier est vide`;
} else {
    totalProduct()
    totalPrice()
    savedProduct.forEach(element => {
        getData(element)
   });
}

// Afficher produit dans le panier

function viewItem (product,localProduct){
    let items = document.getElementById("cart__items")
    let article = document.createElement("article")
    article.className = "cart__item"
    article.setAttribute("data-id",product.id)
    article.setAttribute("dat-color",localProduct.couleur)
    
    let div_img = document.createElement("div")
    div_img.className = "cart__item__img"
    let img = document.createElement("img")
    img.setAttribute("src",product.imageUrl)
    img.setAttribute("alt",product.altTxt)
    div_img.appendChild(img)

    let content = document.createElement("div")
    content.className = "cart__item__content"
    
    let content_description = document.createElement("div")
    content_description.className = "cart__item__content__description"
    let name = document.createElement("h2")
    name.innerText = product.name
    let color = document.createElement("p")
    color.innerText = localProduct.couleur
    let price = document.createElement("p")
    price.innerText = product.price+" €"
    content_description.appendChild(name)
    content_description.appendChild(color)
    content_description.appendChild(price)

    let content_setting = document.createElement("div")
    content_setting.className = "cart__item__content__settings"
    let content_setting_quantity =document.createElement("div")
    content_setting_quantity.className = "cart__item__content__settings__quantity"
    let quantite = document.createElement("p")
    quantite.innerText = "Qte :"
    let input_quantite = document.createElement("input")
    input_quantite.className = "itemQuantity"
    input_quantite.setAttribute("type","number")
    input_quantite.setAttribute("name","itemQuantity")
    input_quantite.setAttribute("min","1")
    input_quantite.setAttribute("max","100")
    input_quantite.setAttribute("value",localProduct.quantite)
    input_quantite.addEventListener("change",()=>{
        var newQuantity = parseInt(input_quantite.value)
        if(newQuantity >0 && newQuantity<101){
            localProduct.quantite = newQuantity
            let index = savedProduct.indexOf(localProduct)
            if(index>-1){
                savedProduct.splice(index,1)
                savedProduct.push(localProduct)
            }
            window.localStorage.setItem("carts",JSON.stringify(savedProduct))
            totalProduct()
            totalPrice()
        }
    })
    content_setting_quantity.appendChild(quantite)
    content_setting_quantity.appendChild(input_quantite)

    let content_setting_delete = document.createElement("div")
    content_setting_delete.className = "cart__item__content__settings__delete"
    let supprimer = document.createElement("p")
    supprimer.className = "deleteItem"
    supprimer.innerText = "Supprimer"
    supprimer.addEventListener("click",()=>{
        let index = savedProduct.indexOf(localProduct)
            if(index>-1){
                savedProduct.splice(index,1)
            }
            window.localStorage.setItem("carts",JSON.stringify(savedProduct))
            items.removeChild(article)
            totalProduct()
            totalPrice()
    })
    content_setting_delete.appendChild(supprimer)

    content_setting.appendChild(content_setting_quantity)
    content_setting.appendChild(content_setting_delete)

    content.appendChild(content_description)
    content.appendChild(content_setting)

    article.appendChild(div_img)
    article.appendChild(content)
    items.appendChild(article)


    
}
// Calculer le nombre de produit

function totalProduct(){
    var total = 0
    savedProduct.map((element)=>{
        total += element.quantite
    })
    document.getElementById("totalQuantity").innerText = total+""
    
}
// Calculer le prix du panier
function totalPrice() {
    var total = 0 
    savedProduct.map((element)=>{
        fetch ('http://localhost:3000/api/products/'+element.id)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
     total+= parseInt(data.price) * parseInt(element.quantite)
     document.getElementById("totalPrice").innerText = total+""//
     
    })
    .catch(function(error){
        console.log(error)
    })
    })
}
// traiter donnée formulaire

function valideInput (id,error,type){
    var erreur = document.getElementById(error)
    erreur.innerHTML = ""
    let regex = /^[a-zA-Z-\s]+$/
    let regexEmail = /.+@.+\..+/
    let regexCity = /^\p{Lu}\p{L}*(?:[\s-]\p{Lu}\p{L}*)*$/
    let regexAddress = /^[a-zA-Z0-9\s,'-]*$/
    if(type === "text"){
        if(id==="address"){
            if(!regexAddress.test(document.getElementById(id).value) || document.getElementById(id).value==""){
                erreur.innerText = "Champs à complémenter"
                return ""
            }
        }else if(id==="city"){
            if(!regexAddress.test(document.getElementById(id).value)){
                erreur.innerText = "Champs à complémenter"
                return ""
            }
        }else{
            if(!regex.test(document.getElementById(id).value)){
                erreur.innerText = "Champs à complémenter"
                return ""
            }

        }
        return document.getElementById(id).value
    }else if(type === "email"){
        if(!regexEmail.test(document.getElementById(id).value)){
            erreur.innerText = "Champs à complémenter"
            return ""
        }
        
        return document.getElementById(id).value
    }
    
}

let form  = document.getElementById("order")
form.addEventListener("click",function(e){
    e.preventDefault()
    var firstName = valideInput("firstName","firstNameErrorMsg","text")
    var lastName = valideInput("lastName","lastNameErrorMsg","text")
    var email = valideInput("email","emailErrorMsg","email")
    var city =valideInput("city","cityErrorMsg","text")
    var address = valideInput("address","addressErrorMsg","text")

    let contact = {firstName,lastName,address,city,email}
    let productId = []
    savedProduct.forEach(element=>{
        productId.push(element.id)
    })
    console.log(contact)
    console.log(productId)
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify({contact, productId}),
        headers: { "Content-Type": "application/json"}
    })
        .then(function (res) {
            console.log(res)
            return res.json()
        })
        .then(function (data) {
            //window.localStorage.clear();
            console.log("data")
            //document.location.href = "confirmation.html?orderId=" + data.orderId;
        })
        .catch(function (err) {
            console.log(err)
        })
})
 