const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
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
  // URL donde se almacena el archivo (ej. AWS S3, Google Cloud Storage)
  url: {
    type: String,
    required: true
  },
  // Relación con la consulta a la que pertenece el archivo
  consultation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultation',
    default: null
  },
  notes: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Attachment', attachmentSchema);