import express from "express";

// Importación de los modelos
import Appointment from "../models/appointment.js";
import User from "../models/user.js";
import Clinic from "../models/clinic.js";

const api = express.Router();

// --- CREATE: Crear una nueva cita ---
api.post("/", async (req, res) => {
  const { patient, doctor, clinic, date, duration, reason, notes } = req.body;

  try {
    const newAppointment = new Appointment({
      patient,
      doctor,
      clinic,
      date,
      duration,
      reason,
      notes,
    });
    
    await newAppointment.save();
    
    res.status(201).json({
      message: "Cita creada exitosamente.",
      appointment: newAppointment
    });
  } catch (error) {
    console.error("Error al crear la cita:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

// --- READ: Obtener citas por ID de usuario ---
api.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Buscar el usuario para verificar que exista
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Buscar citas donde el usuario sea el paciente o el doctor
    const appointments = await Appointment.find({
      $or: [{ patient: userId }, { doctor: userId }]
    }).populate('patient', 'firstName lastName email').populate('doctor', 'firstName lastName email').populate('clinic', 'name');

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error al obtener las citas del usuario:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

// --- READ: Obtener citas por ID de clínica ---
api.get("/clinic/:clinicId", async (req, res) => {
  const { clinicId } = req.params;

  try {
    // Buscar la clínica para verificar que exista
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({ message: "Clínica no encontrada." });
    }

    // Buscar todas las citas que pertenecen a esa clínica
    const appointments = await Appointment.find({ clinic: clinicId })
      .populate('patient', 'firstName lastName')
      .populate('doctor', 'firstName lastName')
      .sort({ date: 1 }); // Ordenar por fecha ascendente

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error al obtener las citas de la clínica:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

// --- UPDATE: Actualizar una cita por ID ---
api.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedAppointment) {
      return res.status(404).json({ message: "Cita no encontrada." });
    }
    
    res.status(200).json({
      message: "Cita actualizada exitosamente.",
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

// --- DELETE: Eliminar una cita por ID ---
api.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return res.status(404).json({ message: "Cita no encontrada." });
    }
    
    res.status(200).json({ message: "Cita eliminada exitosamente." });
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

export default api;