const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById("template-card").content;
const fragment = document.createDocumentFragment()
let carrito = {}

const json =
  [
    {
      "precio": 1250,
      "id": 1,
      "title": "Fragancia Coco y Lima",
      "thumbnailUrl": "../images/DSC_1251.JPG"
    },
    {
      "precio": 1250,
      "id": 2,
      "title": "Fragancia Pomelo Rosado",
      "thumbnailUrl": "../images/DSC_1215.JPG"
    },
    {
      "precio": 850,
      "id": 3,
      "title": "Vela Citrica",
      "thumbnailUrl": "../images/vela1.JPEG"
    },
    {
      "precio": 850,
      "id": 4,
      "title": "Vela Vainilla",
      "thumbnailUrl": "../images/vela2.JPEG"
    },
    {
      "precio": 1000,
      "id": 5,
      "title": "Almohadones",
      "thumbnailUrl": "../images/almohadones5.JPEG"
    },
    {
      "precio": 2500,
      "id": 6,
      "title": "Cubreedredon",
      "thumbnailUrl": "../images/fundas.JPG"
    }
  ]

$(document).ready(  e => { pintarCards(json) } );
//document.addEventListener('DOMContentLoaded', e => { pintarCards(json) });

const wishList = [];

// Pintar productos
const pintarCards = data => {
  data.forEach(item => {
    templateCard.querySelector('h5').textContent = item.title
    templateCard.querySelector('p').textContent = "$" + item.precio
    templateCard.querySelector('button').dataset.id = item.id
    templateCard.querySelector('img').setAttribute("src", `${item.thumbnailUrl}`);
    templateCard.querySelector('.wish-btn').setAttribute("value", `${item.id}`);
    const clone = templateCard.cloneNode(true)
    $(fragment).append(clone)
  })
  $(cards).append(fragment)
  // Eventos con JQUERY
  $(".wish-btn").click(appendWish)
}

function appendWish(e) {
  const target = $(e.target);
  const product = json.find(data => data.id == target.val());
  wishList.push(product);
  localStorage.setItem("wish-list", JSON.stringify(wishList));
  createPopup(product);
}

function createPopup(producto) {
    const popup = `<div class="popup-window">
                            <h5>${producto.title} - se ha agregado a favoritos ❤</h5>
                            <button id="close-popup" class="btn btn-dark">Cerrar</button>
                    </div>`
    
    $(popup).appendTo("main").hide().fadeIn(1000);
    $("#close-popup").click( e => $(e.target).parent().remove() )

}

