import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Section } from '@/lib/models/Section'

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  // body: [{ id: string, order: number }]
  const items: { id: string; order: number }[] = await req.json()
  await Promise.all(
    items.map(({ id, order }) => Section.findByIdAndUpdate(id, { order }))
  )
  return NextResponse.json({ success: true })
}
