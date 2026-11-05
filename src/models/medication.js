import mongoose from "mongoose"
import {v4 as uuid_v4} from "uuid"

const medicationSchema = new mongoose.Schema({
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
  medicationName: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    required: true,
    trim: true
  },
  frequency: {
    type: String,
    required: true,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, { timestamps: true });

export default mongoose.model('Medication', medicationSchema);