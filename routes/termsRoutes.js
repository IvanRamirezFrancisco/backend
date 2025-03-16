// backend/routes/termsRoutes.js
const express = require('express');
const router = express.Router();
const Term = require('../models/Terms');
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");

// Middleware de validación para Términos
const validateTerm = [
  check("title", "El título es obligatorio").not().isEmpty(),
  check("description", "La descripción es obligatoria").not().isEmpty(),
];

// CREATE -> /api/terms
router.post("/", validateTerm, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { title, description } = req.body;
    const newTerm = await Term.create({ title, description });
    res.status(201).json({ success: true, data: newTerm });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear el término",
      error: error.message,
    });
  }
});

// GET ALL -> /api/terms
router.get("/", async (req, res) => {
  try {
    const terms = await Term.find()
      .select("title description createdAt")
      .lean();
    res.status(200).json(terms);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los términos",
      error: error.message,
    });
  }
});

// GET by ID -> /api/terms/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "ID no válido" });
  }
  try {
    const term = await Term.findById(id);
    if (!term) {
      return res.status(404).json({ success: false, message: "Término no encontrado" });
    }
    res.status(200).json({ success: true, data: term });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener el término",
      error: error.message,
    });
  }
});

// UPDATE -> /api/terms/:id
router.put("/:id", validateTerm, async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "ID no válido" });
  }
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    const { title, description } = req.body;
    const updatedTerm = await Term.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    ).lean();
    if (!updatedTerm) {
      return res.status(404).json({ success: false, message: "Término no encontrado" });
    }
    res.status(200).json({ success: true, data: updatedTerm });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar el término",
      error: error.message,
    });
  }
});

// DELETE -> /api/terms/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "ID no válido" });
  }
  try {
    const deletedTerm = await Term.findByIdAndDelete(id);
    if (!deletedTerm) {
      return res.status(404).json({ success: false, message: "Término no encontrado" });
    }
    res.status(200).json({ success: true, message: "Término eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar el término",
      error: error.message,
    });
  }
});

module.exports = router;
