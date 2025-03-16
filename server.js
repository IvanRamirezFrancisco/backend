const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const faqRoutes = require("./routes/faqRoutes"); // 👈 Asegúrate de que está bien importado
const policiesRoutes = require("./routes/policiesRoutes");
const termsRoutes = require('./routes/termsRoutes');

const app = express();

app.use(cors());
app.use(express.json()); // 👈 Permite leer JSON en las peticiones

// Definir rutas
app.use("/api/faqs", faqRoutes); // 👈 Asegúrate de que esto está antes del listen()
app.use("/api/policies", policiesRoutes);
app.use('/api/terms', termsRoutes);

app.get("/", (req, res) => {
  res.send("Bienvenido al backend de CRUD Políticas");
});

const PORT = process.env.PORT || 4000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB Atlas");
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
  })
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err));