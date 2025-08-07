const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
  id: String,
  type: {
    type: String,
    enum: ['categorize', 'cloze', 'comprehension', 'multiple-choice'],
    required: true
  },
  title: String,
  content: mongoose.Schema.Types.Mixed
})

const FormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  headerImage: {
    type: String,
    trim: true
  },
  questions: [QuestionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  shareableLink: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
})

// Generate shareable link before saving
FormSchema.pre('save', function(next) {
  if (!this.shareableLink) {
    this.shareableLink = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
  next()
})

module.exports = mongoose.model('Form', FormSchema)
