import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Testimonial } from '@/lib/models/Testimonial'

export async function GET() {
  await connectDB()
  const testimonials = await Testimonial.find({ visible: true }).sort({ createdAt: -1 })
  return NextResponse.json(testimonials)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const body = await req.json()
  const t = await Testimonial.create(body)
  return NextResponse.json(t, { status: 201 })
}
