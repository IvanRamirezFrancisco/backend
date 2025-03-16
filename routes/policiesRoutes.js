// backend/routes/policiesRoutes.js
const express = require("express");
const router = express.Router();
const Policies = require("../models/Policies");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");

// Middleware de validación actualizado ✅
const validatePolicy = [
  check("title", "El título es obligatorio").not().isEmpty(),
  check("description", "La descripción es obligatoria").not().isEmpty(),
];

// CREATE -> /api/policies ✅
router.post("/", validatePolicy, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { title, description } = req.body; // ✅ Campos actualizados
    const newPolicy = await Policies.create({ title, description }); // ✅
    res.status(201).json({ success: true, data: newPolicy });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear la política",
      error: error.message,
    });
  }
});

// GET ALL -> /api/policies
router.get("/", async (req, res) => {
  try {
    const policies = await Policies.find()
      .select("title description createdAt") // Solo campos necesarios
      .lean(); // Mejor performance
    
    res.status(200).json(policies);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las políticas",
      error: error.message,
    });
  }
});

// GET by ID -> /api/policies/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "ID no válido" });
  }

  try {
    const policy = await Policies.findById(id);
    if (!policy) {
      return res
        .status(404)
        .json({ success: false, message: "Política no encontrada" });
    }
    res.status(200).json({ success: true, data: policy });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener la política",
      error: error.message,
    });
  }
});

// UPDATE -> /api/policies/:id ✅
router.put("/:id", validatePolicy, async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "ID no válido" });
  }

  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { title, description } = req.body; // ✅ Campos actualizados


    const updatedPolicy = await Policies.findByIdAndUpdate(
      id,
      { title, description }, // ✅
      { new: true }
    ).lean(); 

    if (!updatedPolicy) {
      return res
        .status(404)
        .json({ success: false, message: "Política no encontrada" });
    }

    res.status(200).json({ success: true, data: updatedPolicy });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar la política",
      error: error.message,
    });
  }
});

// DELETE -> /api/policies/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "ID no válido" });
  }

  try {
    const deletedPolicy = await Policies.findByIdAndDelete(id);
    if (!deletedPolicy) {
      return res
        .status(404)
        .json({ success: false, message: "Política no encontrada" });
    }
    res
      .status(200)
      .json({ success: true, message: "Política eliminada correctamente" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar la política",
      error: error.message,
    });
  }
});

module.exports = router;