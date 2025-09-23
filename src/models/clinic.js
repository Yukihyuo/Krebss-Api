const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  // Información de identificación y contacto
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true
  },
  // Lista de especialidades ofrecidas en esta clínica
  specialties: [{
    type: String,
    trim: true
  }],
  // Horario de atención general de la clínica
  openingHours: {
    monday: {
      type: String,
      trim: true
    },
    tuesday: {
      type: String,
      trim: true
    },
    wednesday: {
      type: String,
      trim: true
    },
    thursday: {
      type: String,
      trim: true
    },
    friday: {
      type: String,
      trim: true
    },
    saturday: {
      type: String,
      trim: true
    },
    sunday: {
      type: String,
      trim: true
    },
  },
  // Relaciones con otros módulos
  doctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  staff: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Administrador principal de la clínica
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Clinic', clinicSchema);