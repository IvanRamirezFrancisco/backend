const express = require("express");
const router = express.Router();
const Faq = require("../models/Faq");

// Obtener todas las preguntas frecuentes
router.get("/", async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: "❌ Error al obtener preguntas frecuentes" });
  }
});

// Agregar una nueva pregunta frecuente
router.post("/", async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ message: "❌ Se requieren 'question' y 'answer'" });
    }
    const newFaq = new Faq({ question, answer });
    await newFaq.save();
    res.status(201).json(newFaq);
  } catch (error) {
    res.status(500).json({ message: "❌ Error al agregar la pregunta frecuente" });
  }
});

// Editar (actualizar) una pregunta frecuente
router.put("/:id", async (req, res) => {
  try {
    const { answer } = req.body;
    if (!answer) {
      return res.status(400).json({ message: "❌ Se requiere 'answer' para actualizar" });
    }
    const updatedFaq = await Faq.findByIdAndUpdate(
      req.params.id,
      { answer },
      { new: true }
    );
    if (!updatedFaq) {
      return res.status(404).json({ message: "❌ FAQ no encontrada" });
    }
    res.json(updatedFaq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar una pregunta frecuente
router.delete("/:id", async (req, res) => {
  try {
    const deletedFaq = await Faq.findByIdAndDelete(req.params.id);
    if (!deletedFaq) {
      return res.status(404).json({ message: "❌ FAQ no encontrada" });
    }
    res.json({ message: "FAQ eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
