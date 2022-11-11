// Afficher numéro commande
let params = new URLSearchParams(window.location.search);
const orderId = params.get("orderId");
document.getElementById("orderId").innerHTML += `${orderId}`;