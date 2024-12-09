import fs from "fs/promises";
import path from "path";

const cartsFilePath = path.resolve("data", "carts.json");

export default class CartManager {
  constructor() {
    this.carts = [];
    this.init();
  }

  // Inicializa la lista de carritos desde el archivo JSON
  async init() {
    try {
      const data = await fs.readFile(cartsFilePath, "utf-8");
      this.carts = JSON.parse(data);
    } catch (error) {
      this.carts = [];
    }
  }

  // Guarda la lista de carritos en el archivo JSON
  async saveToFile() {
    const jsonData = JSON.stringify(this.carts, null, 2);
    await fs.writeFile(cartsFilePath, jsonData);
  }

  // Crea un nuevo carrito
  async createCart() {
    const newCart = {
      id: this.carts.length ? this.carts[this.carts.length - 1].id + 1 : 1,
      products: [],
    };

    this.carts.push(newCart);
    await this.saveToFile();
    return newCart;
  }

  // Obtiene un carrito por su ID
  async getCartById(id) {
    return this.carts.find((cart) => cart.id === id);
  }

  // Agrega un producto a un carrito
  async addProductToCart(cartId, productId) {
    const cart = await this.getCartById(cartId);

    if (!cart) return null;

    let product = cart.products.find((item) => item.product === productId);

    if (product) {
      product.quantity++;
    } else {
      product = { product: productId, quantity: 1 };
      cart.products.push(product);
    }

    await this.saveToFile();
    return product;
  }
}
