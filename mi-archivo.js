const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById("template-card").content;
const fragment = document.createDocumentFragment()
let carrito = {}

const json =
  [
    {
      "precio": 800,
      "id": 1,
      "title": "Fragancia Coco y Lima",
      "thumbnailUrl": "../images/spray_lima.JPG"
    },
    {
      "precio": 800,
      "id": 2,
      "title": "Fragancia Pomelo Rosado",
      "thumbnailUrl": "../images/spray_pomelo.JPG"
    },
    {
      "precio": 900,
      "id": 3,
      "title": "Vela Citrica",
      "thumbnailUrl": "../images/vela1.JPEG"
    },
    {
      "precio": 900,
      "id": 4,
      "title": "Vela Vainilla",
      "thumbnailUrl": "../images/vela2.JPEG"
    },
    {
      "precio": 1500,
      "id": 5,
      "title": "Almohadones",
      "thumbnailUrl": "../images/almohadones5.JPEG"
    },
    {
      "precio": 8000,
      "id": 6,
      "title": "Cubre edredón",
      "thumbnailUrl": "../images/fundas.JPG"
    }
  ]


class CartItem {

  constructor({ data, count }) {
    this.data = data;
    this.count = count;
  }

  calculateSubtotal() {
    return this.data.precio * this.count;
  }

  renderHTML() {
    const htmlContent = `<tr id="producto-${this.data.id}">
                            <td class="producto-nombre">${this.data.title}</td>
                            <td class="producto-cantidad">${this.count}</td>
                            <td>$ <span class="producto-subtotal"> ${this.calculateSubtotal()} </span> </td>
                            <td class="button-cell"> <button class="btn-remove btn btn-danger" value="${this.data.id}" title="eliminar producto" aria-label="eliminar producto">X</button>
                        </tr>`
    $("#carrito-body").append(htmlContent);
  }

  deleteHTML() {
    const row = $(`#producto-${this.data.id}`);
    const remove = () => row.remove();
    row.hide("fast", remove);
  }

  update(value) {
    this.count += value;
    $(`#producto-${this.data.id} .producto-subtotal`).text(this.calculateSubtotal());
    $(`#producto-${this.data.id} .producto-cantidad`).text(this.count);
  }

}


class Cart {

  constructor() {
    this.items = [];
  }

  addProduct(item) {
    const exists = this.items.some(element => element.data.id == item.data.id);
    if (exists) this.updateProduct(item.data.id);
    else {
      this.items.push(item);
      item.renderHTML();
    }
  }

  removeProduct(id) {
    const product = this.findProduct(id);
    product.update(-1);
    if (product.count <= 0) {
      product.deleteHTML();
      this.items = this.items.filter(item => item.data.id != id);
    }
  }

  findProduct(id) {
    return this.items.find(item => item.data.id == id);
  }

  updateProduct(id) {
    const product = this.findProduct(id);
    product.update(1);
  }

  calculateTotal() {
    let total = 0;

    for (const item of this.items) {
      total += item.calculateSubtotal();
    }

    $("#carrito-total").text(total);
  }

  saveCart() {
    localStorage.setItem("carrito", JSON.stringify(this.items));
  }


  clearCart() {
    this.items = [];
    localStorage.removeItem("carrito");
    $("#carrito-body").html("");
  }

  hasItems() {
    return this.items.length > 0;
  }

}
const wishList = [];
const cart = new Cart();

// Pintar productos
const pintarCards = data => {
  data.forEach(item => {
    templateCard.querySelector('h5').textContent = item.title
    templateCard.querySelector('p').textContent = "$" + item.precio
    templateCard.querySelector('button').setAttribute("value", item.id);
    templateCard.querySelector('img').setAttribute("src", `${item.thumbnailUrl}`);
    templateCard.querySelector('.wish-btn').setAttribute("value", `${item.id}`);
    const clone = templateCard.cloneNode(true)
    $(fragment).append(clone)
  })
  $(cards).append(fragment)

  // Eventos con JQUERY
  $(".wish-btn").click(appendWish);
  $(".cart-btn").click(buyProduct);
}

function appendWish(e) {
  const target = $(e.target);
  const product = json.find(data => data.id == target.val());
  wishList.push(product);
  localStorage.setItem("wish-list", JSON.stringify(wishList));
  createPopup(`${product.title} agregado a la lista de deseos ❤`);
}

function createPopup(content) {

  const popup = `<div class="popup-window">
                            <h5>${content}</h5>
                            <button class="btn btn-dark close-popup" class="btn btn-dark">Cerrar</button>
                    </div>`

  $(popup).appendTo("main").hide().fadeIn("fast");
  $(".close-popup").click(e => $(e.target).parent().remove())

}

function buyProduct(e) {
  const target = $(e.target);
  const product = json.find(data => data.id == target.val());
  const item = new CartItem({ data: product, count: 1 });
  cart.addProduct(item);
  cart.calculateTotal();
  cart.saveCart();
}

function deleteProduct(e) {
  const target = $(e.target);

  if (target.hasClass("btn-remove")) {
    cart.removeProduct(target.val());
    cart.calculateTotal();
    cart.saveCart();
  }

}

function createCart() {
  const storage = JSON.parse(localStorage.getItem("carrito")) || [];
  for (const item of storage) {
    cart.addProduct(new CartItem(item));
    cart.calculateTotal();
  }
}

function finishBuy() {
  if (cart.hasItems()) {
    createPopup("¡Muchas gracias por su compra! 😁");
    cart.clearCart();
    cart.calculateTotal();
  }
}

$(document).ready(() => {

  pintarCards(json);
  createCart();
  $("#carrito-body").click(deleteProduct);
  $(".finish-buy-btn").click(finishBuy);
}

);

