import { Schema, model, models } from 'mongoose'

const TestimonialSchema = new Schema({
  name: { type: String, required: true },
  company: { type: String, default: '' },
  role: { type: String, default: '' },
  text: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  visible: { type: Boolean, default: true },
}, { timestamps: true })

export const Testimonial = models.Testimonial || model('Testimonial', TestimonialSchema)
