// Ejecuta el código cuando el DOM esté completamente cargado.
document.addEventListener("DOMContentLoaded", () => {
  const productsList = document.getElementById("listProd"); // Referencia a la lista de productos.

  // Renderiza un producto en la lista.

  const renderProduct = (product) => {
    const li = document.createElement("li"); // Crea un elemento de lista.

    li.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Precio: ${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <p>Categoría: ${product.category}</p>`;

    productsList.appendChild(li); // Añade el producto a la lista de productos.
  };

  // Obtiene todos los productos y los renderiza al cargar la página.
  fetch("/api/products")
    .then((res) => res.json())
    .then((products) => {
      products.forEach(renderProduct); // Renderiza cada producto.
    })
    .catch((error) => {
      console.error("Error prod", error);
    });
});
