const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  // Relación con el paciente que solicita la cita
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Relación con el doctor que atenderá la cita
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Relación con el consultorio, si el sistema soporta múltiples
  clinic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true
  },
  // Fecha y hora de la cita
  date: {
    type: Date,
    required: true
  },
  // Duración de la cita en minutos
  duration: {
    type: Number,
    required: true,
    default: 30
  },
  // Motivo de la consulta
  reason: {
    type: String,
    required: true,
    trim: true
  },
  // Estado de la cita
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'canceled'],
    default: 'pending'
  },
  // Notas adicionales para la cita
  notes: {
    type: String,
    trim: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);