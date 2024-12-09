import express from "express";

const router = express.Router();

// Renderiza la vista principal de productos
router.get("/products", (req, res) => {
  res.render("products", { title: "Productos" });
});

// Renderiza la vista de productos en tiempo real
router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { title: "Add Product" });
});

export default router;
