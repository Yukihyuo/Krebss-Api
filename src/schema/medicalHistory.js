const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Ahora, las alergias se almacenan aquí de manera simple
  allergies: [{
    type: String,
    trim: true
  }],
  // No se incluyen consultas, diagnósticos o medicamentos, ya que están en sus propias colecciones
}, { timestamps: true });

module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);