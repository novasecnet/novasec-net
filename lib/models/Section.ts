import { Schema, model, models } from 'mongoose'

const SectionSchema = new Schema({
  page: { type: String, required: true, enum: ['home', 'about'] },
  type: {
    type: String,
    required: true,
    enum: ['hero', 'skills', 'certifications', 'experience', 'testimonials', 'contact', 'bio', 'services'],
  },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
  content: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true })

export const Section = models.Section || model('Section', SectionSchema)
