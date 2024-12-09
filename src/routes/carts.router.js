import { Router } from "express";
import CartManager from "../services/CartManager.js";
import ProductManager from "../services/ProductManager.js";

const router = Router(); // Instancia del enrutador de Express.
const cartManager = new CartManager(); // Instancia para gestionar operaciones de carritos.

//Ruta para crear un nuevo carrito.
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart(); // Crea un carrito vacío.
    res.status(201).json(newCart); // Responde con el carrito creado.
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear el carrito" }); // Manejo de errores.
  }
});

//Ruta para obtener un carrito por ID.
router.get("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid); // Convierte el ID del carrito a número.
    if (!cartId) {
      return res
        .status(400)
        .json({ error: "El id del carrito es obligatorio" });
    }

    const cart = await cartManager.getCartById(cartId); // Busca el carrito por ID.
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" }); // Responde si no existe.
    }

    res.json(cart); // Responde con el carrito encontrado.
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener el carrito" }); // Manejo de errores.
  }
});

//Ruta para agregar un producto a un carrito.
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid); // ID del carrito.
    if (!cartId) {
      return res
        .status(400)
        .json({ error: "El id del carrito es obligatorio" });
    }

    const productId = parseInt(req.params.pid); // ID del producto.
    if (!productId) {
      return res
        .status(400)
        .json({ error: "El id del producto es obligatorio" });
    }

    const productManager = new ProductManager(); // Instancia para gestionar productos.
    await productManager.init(); // Inicializa la gestión de productos.
    const productExists = await productManager.getProductById(productId); // Verifica si el producto existe.

    if (!productExists) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const updatedCart = await cartManager.addProductToCart(cartId, productId); // Agrega el producto al carrito.
    if (!updatedCart) {
      return res
        .status(404)
        .json({ error: "Carrito o producto no encontrado" });
    }

    res.json(updatedCart); // Responde con el carrito actualizado.
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al agregar el producto al carrito" }); // Manejo de errores.
  }
});

export default router; // Exporta el enrutador.
