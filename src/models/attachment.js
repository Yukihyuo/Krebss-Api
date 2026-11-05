import mongoose from "mongoose"
import { v4 as uuid_v4 } from "uuid"

const attachmentSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: uuid_v4
  },
  doctor: {
    type: String,
    ref: 'User',
    required: true
  },
  patient: {
    type: String,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true,
    trim: true
  },
  fileType: {
    type: String,
    enum: ['image', 'document', 'pdf', 'xray', 'labResult'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    trim: true
  }
}, { timestamps: true });

export default mongoose.model('Attachment', attachmentSchema);