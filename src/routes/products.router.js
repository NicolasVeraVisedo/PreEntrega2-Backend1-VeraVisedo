import { Router } from "express";
import ProductManager from "../services/ProductManager.js";

const router = Router(); // Instancia del enrutador de Express.
const productManager = new ProductManager(); // Instancia para gestionar operaciones de productos.

//Ruta para obtener todos los productos o un número limitado.
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined; // Obtiene el límite de productos (opcional).
    const products = await productManager.getAllProducts(limit); // Recupera los productos.
    res.json(products); // Responde con la lista de productos.
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los productos" }); // Manejo de errores.
  }
});

//Ruta para obtener un producto por ID.
router.get("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid); // ID del producto.
    if (!productId) {
      return res
        .status(400)
        .json({ error: "El id del producto es obligatorio" });
    }

    const product = await productManager.getProductById(productId); // Recupera el producto.
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" }); // Responde si no existe.
    }

    res.json(product); // Responde con el producto encontrado.
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener el producto" }); // Manejo de errores.
  }
});

//Ruta para agregar un nuevo producto.
router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, category } = req.body; // Obtiene los datos del producto.

    if (!title || !description || !code || !price || !stock || !category) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const newProduct = await productManager.addProduct({
      title,
      description,
      code,
      price,
      stock,
      category,
    }); // Crea el nuevo producto.

    res.status(201).json(newProduct); // Responde con el producto creado.
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al agregar el producto" }); // Manejo de errores.
  }
});

//Ruta para actualizar un producto existente.
router.put("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid); // ID del producto.
    if (!productId) {
      return res
        .status(400)
        .json({ error: "El id del producto es obligatorio" });
    }

    const updatedProduct = await productManager.updateProduct(
      productId,
      req.body
    ); // Actualiza el producto.
    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" }); // Responde si no existe.
    }

    res.json(updatedProduct); // Responde con el producto actualizado.
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al actualizar el producto" }); // Manejo de errores.
  }
});

//Ruta para eliminar un producto.
router.delete("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid); // ID del producto.
    if (!productId) {
      return res
        .status(400)
        .json({ error: "El id del producto debe ser un número válido" });
    }

    const deletedProduct = await productManager.deleteProduct(productId); // Elimina el producto.
    if (deletedProduct) {
      res.json(deletedProduct); // Responde con el producto eliminado.
    } else {
      res.status(404).json({ error: "No se pudo eliminar el producto" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al eliminar el producto" }); // Manejo de errores.
  }
});

export default router; // Exporta el enrutador.
