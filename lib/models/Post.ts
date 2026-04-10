import { Schema, model, models } from 'mongoose'

const PostSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, default: '' },
  body: { type: String, default: '' },
  tags: [{ type: String }],
  published: { type: Boolean, default: false },
  coverImage: { type: String, default: '' },
}, { timestamps: true })

PostSchema.pre('validate', function () {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
})

export const Post = models.Post || model('Post', PostSchema)
