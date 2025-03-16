const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const faqRoutes = require("./routes/faqRoutes"); 
const policiesRoutes = require("./routes/policiesRoutes");
const termsRoutes = require('./routes/termsRoutes');

const app = express();

app.use(cors());
app.use(express.json()); 

app.use("/api/faqs", faqRoutes); 
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