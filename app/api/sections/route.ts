import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Section } from '@/lib/models/Section'

export async function GET(req: NextRequest) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const page = searchParams.get('page')
  const filter = page ? { page } : {}
  const sections = await Section.find(filter).sort({ order: 1 })
  return NextResponse.json(sections)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const body = await req.json()
  const section = await Section.create(body)
  return NextResponse.json(section, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const body = await req.json()
  const { id, ...update } = body
  const section = await Section.findByIdAndUpdate(id, update, { new: true })
  return NextResponse.json(section)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  await Section.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
