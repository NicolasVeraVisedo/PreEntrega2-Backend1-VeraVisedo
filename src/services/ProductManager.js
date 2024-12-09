import fs from "fs/promises";
import path from "path";

const productsFilePath = path.resolve("data", "products.json");

export default class ProductManager {
  constructor() {
    this.products = [];
    this.init();
  }

  // Inicializa la lista de productos desde el archivo JSON
  async init() {
    try {
      const data = await fs.readFile(productsFilePath, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  // Guarda la lista de productos en el archivo JSON
  async saveToFile() {
    const jsonData = JSON.stringify(this.products, null, 2);
    await fs.writeFile(productsFilePath, jsonData);
  }

  // Obtiene todos los productos, con opción de límite
  async getAllProducts(limit) {
    return limit ? this.products.slice(0, limit) : this.products;
  }

  // Obtiene un producto por su ID
  getProductById(id) {
    return this.products.find((product) => product.id === id);
  }

  // Agrega un nuevo producto
  async addProduct(product) {
    const newProduct = {
      id: this.products.length
        ? this.products[this.products.length - 1].id + 1
        : 1,
      ...product,
      status: true,
    };

    this.products.push(newProduct);
    await this.saveToFile();
    return newProduct;
  }

  // Actualiza un producto existente
  async updateProduct(id, updatedFields) {
    const index = this.products.findIndex((product) => product.id === id);

    if (index === -1) return null;

    this.products[index] = { ...this.products[index], ...updatedFields };
    await this.saveToFile();
    return this.products[index];
  }

  // Elimina un producto por su ID
  async deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);

    if (index === -1) return null;

    const deletedProduct = this.products.splice(index, 1);
    await this.saveToFile();
    return deletedProduct[0];
  }
}
