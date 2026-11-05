import express from "express";

import Clinic from "../models/clinic.js";
import User from "../models/user.js";

const api = express.Router();

// --- CREATE: Crear una nueva clínica ---
api.post("/", async (req, res) => {
  const { name, address, phone, email, specialties, openingHours, adminId } = req.body;

  try {
    const existingClinic = await Clinic.findOne({ name });
    if (existingClinic) {
      return res.status(409).json({ message: "Ya existe una clínica con este nombre." });
    }

    // 3. Crear una nueva instancia de la clínica
    const newClinic = new Clinic({
      name,
      address,
      phone,
      email,
      specialties,
      openingHours,
      admin: adminId,
    });

    // 4. Guardar la clínica en la base de datos
    await newClinic.save();

    res.status(201).json({
      message: "Clínica creada exitosamente.",
      clinic: newClinic,
    });
  } catch (error) {
    console.error("Error al crear la clínica:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

// --- READ: Obtener información de clínicas ---

// Obtener todas las clínicas
api.get("/", async (req, res) => {
  try {
    const clinics = await Clinic.find().populate('admin', 'firstName lastName email').populate('doctors', 'firstName lastName email').populate('staff', 'firstName lastName email');
    res.status(200).json(clinics);
  } catch (error) {
    console.error("Error al obtener las clínicas:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

// Obtener una clínica por ID
api.get("/:id", async (req, res) => {
  const clinicId = req.params.id;

  try {
    const clinic = await Clinic.findById(clinicId).populate('admin', 'firstName lastName email').populate('doctors', 'firstName lastName email').populate('staff', 'firstName lastName email');
    if (!clinic) {
      return res.status(404).json({ message: "Clínica no encontrada." });
    }
    res.status(200).json(clinic);
  } catch (error) {
    console.error("Error al obtener la clínica por ID:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

// --- UPDATE: Actualizar una clínica ---
api.put("/:id", async (req, res) => {
  const clinicId = req.params.id;
  const updateData = req.body;

  try {
    const updatedClinic = await Clinic.findByIdAndUpdate(clinicId, updateData, { new: true, runValidators: true });
    if (!updatedClinic) {
      return res.status(404).json({ message: "Clínica no encontrada para actualizar." });
    }
    res.status(200).json({
      message: "Clínica actualizada exitosamente.",
      clinic: updatedClinic,
    });
  } catch (error) {
    console.error("Error al actualizar la clínica:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

// --- DELETE: Eliminar una clínica ---
api.delete("/:id", async (req, res) => {
  const clinicId = req.params.id;

  try {
    const deletedClinic = await Clinic.findByIdAndDelete(clinicId);
    if (!deletedClinic) {
      return res.status(404).json({ message: "Clínica no encontrada para eliminar." });
    }

    // Opcional: Desvincular usuarios asociados a la clínica eliminada
    // const usersToUpdate = [...deletedClinic.doctors, ...deletedClinic.staff, deletedClinic.admin];
    // await User.updateMany({ _id: { $in: usersToUpdate } }, { $unset: { clinic: "" } });

    res.status(200).json({ message: "Clínica eliminada exitosamente." });
  } catch (error) {
    console.error("Error al eliminar la clínica:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

export default api;