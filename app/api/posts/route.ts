import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/lib/models/Post'

export async function GET(req: NextRequest) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const adminView = searchParams.get('admin')
  const filter = adminView ? {} : { published: true }
  const posts = await Post.find(filter).sort({ createdAt: -1 })
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const body = await req.json()
  const post = await Post.create(body)
  return NextResponse.json(post, { status: 201 })
}
