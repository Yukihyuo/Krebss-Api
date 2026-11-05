import mongoose from "mongoose"
import {v4 as uuid_v4} from "uuid"

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: uuid_v4
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    ref: 'Role',
    required: true
  },
  // Relación con el consultorio, si el sistema soporta múltiples consultorios
  clinic: {
    type: String,
    ref: 'Clinic',
    // Opcional: Puede ser 'null' si un usuario no está asociado a un consultorio específico
    // Por ejemplo, un administrador del sistema
    default: null
  },
  // Estado de la cuenta, por ejemplo, 'activo', 'pendiente', 'inactivo'
  status: {
    type: String,
    enum: ['active', 'pending', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);