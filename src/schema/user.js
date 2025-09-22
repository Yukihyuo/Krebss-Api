const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Información de autenticación
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
  // Información personal y del consultorio
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  // Relación con el rol, idealmente un 'ObjectId' de la colección de roles
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  // Relación con el consultorio, si el sistema soporta múltiples consultorios
  clinic: {
    type: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model('User', userSchema);