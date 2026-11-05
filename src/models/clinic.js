import mongoose from "mongoose"
import { v4 as uuid_v4 } from "uuid"

const clinicSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: uuid_v4
  },
  name: {
    type: String,
    required: true,
    trim: true,
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
    type: String,
    ref: 'User'
  }],
  staff: [{
    type: String,
    ref: 'User'
  }],
  // Administrador principal de la clínica
  admin: {
    type: String,
    ref: 'User',
    default: null
  },
}, { timestamps: true });

export default mongoose.model('Clinic', clinicSchema);