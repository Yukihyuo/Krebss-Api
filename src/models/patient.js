import mongoose from "mongoose"
import { v4 as uuid_v4 } from "uuid"

const patientSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: uuid_v4
  },
  // Relación con el usuario. El paciente es un tipo de usuario.
  userId: {
    type: String,
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
}, { timestamps: true });

export default mongoose.model('Patient', patientSchema);