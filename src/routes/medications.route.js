import express from "express";

import Medication from "../models/medication.js";
import User from "../models/user.js";

const api = express.Router();

// --- LECTURA: Obtener todos los medicamentos de un paciente ---
/**
 * @route   GET /medications/:userId
 * @desc    Obtiene todos los medicamentos recetados a un paciente por su ID de usuario.
 * @access  Private (requiere autenticación)
 */
api.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "El usuario no existe." });
    }

    const medications = await Medication.find({ patient: userId })
    res.status(200).json(medications);
  } catch (error) {
    console.error("Error al obtener los medicamentos:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

// --- CREACIÓN: Crear un solo medicamento ---
/**
 * @route   POST /medications/
 * @desc    Crea un solo registro de medicamento para un paciente.
 * @access  Private (requiere autenticación)
 */
api.post("/", async (req, res) => {
  const { patient, medicationName, dosage, frequency, consultation, notes } = req.body;

  try {
    const newMedication = new Medication({
      patient,
      medicationName,
      dosage,
      frequency,
      consultation,
      notes,
    });

    const savedMedication = await newMedication.save();

    res.status(201).json(savedMedication);
  } catch (error) {
    console.error("Error al crear el medicamento:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

// --- CREACIÓN: Crear múltiples medicamentos ---
/**
 * @route   POST /medications/many
 * @desc    Crea múltiples registros de medicamentos para un paciente.
 * @access  Private (requiere autenticación)
 */
api.post("/many", async (req, res) => {
  const medicationsData = req.body;

  try {
    const insertedMedications = await Medication.insertMany(medicationsData);
    const medicationIds = insertedMedications.map(doc => doc._id);

    res.status(201).json({
      message: "Medicamentos creados exitosamente.",
      ids: medicationIds,
    });
  } catch (error) {
    console.error("Error al crear múltiples medicamentos:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

export default api;