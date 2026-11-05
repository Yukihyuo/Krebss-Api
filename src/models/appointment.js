import mongoose from "mongoose"
import { v4 as uuid_v4 } from "uuid"

const appointmentSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: uuid_v4
  },
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
  clinic: {
    type: String,
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
  remember: {
    patient: {
      type: Boolean,
      default: false
    },
    doctor: {
      type: Boolean,
      default: false
    }
  },
  // Estado de la cita
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'canceled'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);