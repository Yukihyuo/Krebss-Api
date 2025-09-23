const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  // Relación con el usuario. El paciente es un tipo de usuario.
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Información demográfica y de contacto del paciente
  dateOfBirth: {
    type: Date,
    required: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  // Información de seguros médicos
  insuranceProvider: {
    type: String,
    trim: true
  },
  policyNumber: {
    type: String,
    trim: true
  },
  // Lista de alergias conocidas
  allergies: [{
    type: String,
    trim: true
  }],
  // Relación con su historial clínico
  medicalHistory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalHistory'
  }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);