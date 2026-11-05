import express from "express";

import Diagnosis from "../models/diagnosis.js";
import User from "../models/user.js";

const api = express.Router();

/**
 * @route   GET /diagnoses/:userId
 * @desc    Obtiene todos los diagnósticos de un paciente por su ID.
 * @access  Private (se debe implementar autenticación y permisos)
 */
api.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "El usuario no existe." });
    }

    const diagnoses = await Diagnosis.find({ patient: userId });
    res.status(200).json(diagnoses);
  } catch (error) {
    console.error("Error al obtener los diagnósticos:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

// --- CREACIÓN: Crear un solo diagnóstico ---
/**
 * @route   POST /diagnoses/
 * @desc    Crea un solo diagnóstico para un paciente.
 * @access  Private (se debe implementar autenticación y permisos)
 */
api.post("/", async (req, res) => {
  const { patient, condition, code, diagnosedDate, status, notes } = req.body;

  try {
    const newDiagnosis = new Diagnosis({
      patient,
      condition,
      code,
      diagnosedDate,
      status,
      notes
    });

    const savedDiagnosis = await newDiagnosis.save();

    console.log("Diagnóstico creado exitosamente:", savedDiagnosis);
    res.status(201).json(savedDiagnosis);
  } catch (error) {
    console.error("Error al crear el diagnóstico:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

// --- CREACIÓN: Crear múltiples diagnósticos ---
/**
 * @route   POST /diagnoses/many
 * @desc    Crea múltiples diagnósticos para un paciente.
 * @access  Private (se debe implementar autenticación y permisos)
 */
api.post("/many", async (req, res) => {
  const diagnosesData = req.body;

  try {
    // La función insertMany es más eficiente para insertar múltiples documentos a la vez
    const insertedDiagnoses = await Diagnosis.insertMany(diagnosesData);

    const diagnosisIds = insertedDiagnoses.map(doc => doc._id);

    res.status(201).json({
      message: "Diagnósticos creados exitosamente.",
      ids: diagnosisIds
    });
  } catch (error) {
    console.error("Error al crear múltiples diagnósticos:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

export default api;