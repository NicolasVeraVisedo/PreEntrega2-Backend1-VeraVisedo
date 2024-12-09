// Conexión al servidor de WebSocket.
const socket = io();

// Referencias al formulario y a la lista de productos en el DOM.
const form = document.getElementById("formProd");
const productsList = document.getElementById("listProd");

//Renderiza un producto en la lista de productos.

const renderProduct = (product) => {
  const li = document.createElement("li"); // Crea un elemento de lista.
  li.setAttribute("data-id", product.id); // Asigna el ID del producto al atributo.

  li.innerHTML = `
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p>Código: ${product.code}</p>
        <p>Precio: ${product.price}</p>   
        <p>Stock: ${product.stock}</p>
        <p>Categoría: ${product.category}</p>`;

  // Botón para eliminar el producto.
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Eliminar";
  deleteButton.addEventListener("click", () => deleteProduct(product.id));

  li.appendChild(deleteButton); // Añade el botón al elemento de lista.
  productsList.appendChild(li); // Añade el producto a la lista de productos.
};

// Elimina un producto del servidor y de la lista.

const deleteProduct = (productId) => {
  fetch(`/api/products/${productId}`, { method: "DELETE" })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error al eliminar el producto");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Producto eliminado correctamente:", data);
      const productElement = document.querySelector(
        `li[data-id="${productId}"]`
      );
      if (productElement) {
        productElement.remove(); // Elimina el producto del DOM.
      }
    })
    .catch((error) => {
      console.error("Error al eliminar el producto:", error);
    });
};

// Obtiene todos los productos y los renderiza al cargar la página.
fetch("/api/products")
  .then((res) => res.json())
  .then((products) => {
    products.forEach(renderProduct);
  })
  .catch((error) => {
    console.error("Error al obtener los productos:", error);
  });

// Escucha el evento "deletedProd" del servidor y elimina el producto del DOM.
socket.on("deletedProd", (productId) => {
  const li = document.querySelector(`li[data-id="${productId}"]`);
  if (li) {
    li.remove();
  }
});

// Maneja el envío del formulario para agregar un nuevo producto.
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Previene el envío por defecto del formulario.

  const data = new FormData(form); // Crea un objeto FormData con los datos del formulario.
  const obj = {};

  data.forEach((value, key) => (obj[key] = value)); // Convierte los datos en un objeto.

  fetch("/api/products", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error al agregar el producto");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Producto agregado correctamente:", data);
      renderProduct(data); // Renderiza el nuevo producto en la lista.
      form.reset(); // Limpia el formulario.
    })
    .catch((error) => {
      console.error("Error al agregar el producto:", error);
    });
});

// Escucha el evento "addProd" del servidor y renderiza el nuevo producto.
socket.on("addProd", (product) => {
  renderProduct(product);
});
