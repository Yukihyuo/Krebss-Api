const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['superAdmin', 'admin', 'doctor', 'receptionist', 'patient']
  },
  // Permisos asociados a este rol
  // Por ejemplo: ['appointments:create', 'appointments:read', 'patients:read', 'patients:update']
  permissions: [{
    type: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);