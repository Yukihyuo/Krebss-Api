import mongoose from "mongoose"
import { v4 as uuid_v4 } from "uuid"

const consultationSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: uuid_v4
  },
  // Relaciones esenciales
  patient: {
    type: String,
    ref: 'User',
    required: true
  },
  doctor: {
    type: String,
    ref: 'User',
    required: true
  },
  // Información de la consulta
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  reasonForVisit: {
    type: String,
    required: true,
    trim: true
  },
  // Detalles generales para cualquier especialidad
  subjective: {
    type: String, // Descripción de los síntomas desde la perspectiva del paciente
    trim: true
  },
  objective: {
    type: String, // Hallazgos objetivos del examen físico, signos vitales, etc.
    trim: true
  },
  // Diagnóstico
  diagnosis: [{
    type: String, // Diagnóstico en texto
    trim: true,
    ref: "Diagnosis"

  }],
  diagnosisCode: {
    type: String, // Código de diagnóstico (ej. CIE-10) para facturación y reportes
    trim: true
  },
  // Plan de tratamiento
  plan: {
    type: String,
    trim: true
  },
  prescriptions: [{
    type: String,
    ref: 'Medication'
  }],
  procedures: [{
    procedureName: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    }
  }],
  attachments: [{
    type: String,
    ref: 'Attachment'
  }],


  specialtyDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

export default mongoose.model('Consultation', consultationSchema);