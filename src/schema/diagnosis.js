const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Nombre o descripción de la condición (asma, diabetes, etc.)
  condition: {
    type: String,
    required: true,
    trim: true
  },
  // Código de diagnóstico (ej. ICD-10)
  code: {
    type: String,
    trim: true
  },
  // Fecha en que se diagnosticó la condición
  diagnosedDate: {
    type: Date,
    default: Date.now
  },
  // Estado de la condición: 'crónica', 'resuelta', 'activa'
  status: {
    type: String,
    enum: ['chronic', 'resolved', 'active'],
    default: 'active'
  },
  notes: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Diagnosis', diagnosisSchema);