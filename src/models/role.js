import mongoose from "mongoose"
import { v4 as uuid_v4 } from "uuid"

const roleSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: uuid_v4
  },
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

export default mongoose.model('Role', roleSchema);