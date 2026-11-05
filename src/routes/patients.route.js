// src/routes/patient.route.js

import express from "express";

// Importación de los modelos
import Patient from "../models/patient.js";
import User from "../models/user.js";
import authMiddleware from "../middleware/auth.middleware.js";

const api = express.Router();

/**
 * @route   POST /patients/
 * @desc    Crea un nuevo documento de paciente después de que el usuario ya ha sido registrado.
 * @access  Private (se debe implementar autenticación)
 */
api.post("/", async (req, res) => {
  const { userId, dateOfBirth, phoneNumber, address, insuranceProvider, policyNumber, allergies } = req.body;

  try {
    // 1. Validar que el usuario asociado exista y no sea ya un paciente
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "El usuario no existe." });
    }

    const existingPatient = await Patient.findOne({ userId });
    if (existingPatient) {
      return res.status(409).json({ message: "Este usuario ya está registrado como paciente." });
    }

    // 2. Crear el nuevo documento del paciente
    const newPatient = new Patient({
      userId,
      dateOfBirth,
      phoneNumber,
      address,
      insuranceProvider,
      policyNumber,
      allergies,
    });

    // 3. Guardar el paciente en la base de datos
    await newPatient.save();

    res.status(201).json({
      message: "Perfil de paciente creado exitosamente.",
      patient: newPatient,
    });
  } catch (error) {
    console.error("Error al crear el perfil del paciente:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

/**
 * @route   GET /patients/:id
 * @desc    Obtiene la información de un paciente por su ID.
 * @access  Private
 */
api.get("/getAll/", authMiddleware, async (req, res) => {
  console.log(req.user)
  try {
    const userIds = await User.find({ clinic: req.user.clinicId, role: "68d247b7f2ee33a857a5a3b7" }, '_id')
    const userIdsArray = userIds.map(user => user._id);
    const patients = await Patient.find({
      userId: { $in: userIdsArray }
    }).populate('userId');
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error al obtener el paciente:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

/**
 * @route   GET /patients/:id
 * @desc    Obtiene la información de un paciente por su ID.
 * @access  Private
 */
api.get("/getById/:id", async (req, res) => {
  const patientId = req.params.id;

  try {
    const patient = await Patient.findById(patientId).populate('userId');
    if (!patient) {
      return res.status(404).json({ message: "Paciente no encontrado." });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error("Error al obtener el paciente:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

/**
 * @route   PUT /patients/:id
 * @desc    Actualiza la información de un paciente.
 * @access  Private
 */
api.put("/:id", async (req, res) => {
  const patientId = req.params.id;
  const updateData = req.body;

  try {
    const updatedPatient = await Patient.findByIdAndUpdate(patientId, updateData, { new: true });
    if (!updatedPatient) {
      return res.status(404).json({ message: "Paciente no encontrado para actualizar." });
    }

    res.status(200).json({
      message: "Perfil de paciente actualizado exitosamente.",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error("Error al actualizar el paciente:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

/**
 * @route   DELETE /patients/:id
 * @desc    Elimina un documento de paciente.
 * @access  Private
 */
api.delete("/:id", async (req, res) => {
  const patientId = req.params.id;

  try {
    const deletedPatient = await Patient.findByIdAndDelete(patientId);
    if (!deletedPatient) {
      return res.status(404).json({ message: "Paciente no encontrado para eliminar." });
    }

    await User.findByIdAndDelete(deletedPatient.userId);

    res.status(200).json({ message: "Perfil de paciente eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar el paciente:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});


export default api;