import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";

const app = express();
const PORT = 9090;

// Socket.IO Setup
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
const io = new Server(httpServer);

// Configuración de Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Configuración de middleware
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/", viewsRouter); // Vista principal y real-time
app.use("/api/products", productsRouter); // API de productos
app.use("/api/carts", cartsRouter); // API de carritos

// Socket.IO
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("addProd", (product) => {
    console.log("Se recibió un nuevo producto:", product);
    io.emit("addProd", product);
  });
});
