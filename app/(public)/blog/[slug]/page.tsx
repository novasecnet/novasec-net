import { notFound } from 'next/navigation'
import Link from 'next/link'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/lib/models/Post'

export const revalidate = 60

interface PostDoc {
  _id: string
  title: string
  slug: string
  excerpt: string
  body: string
  tags: string[]
  createdAt: string
}

async function getPost(slug: string) {
  try {
    await connectDB()
    return Post.findOne({ slug, published: true }).lean()
  } catch {
    return null
  }
}

// Simple markdown-to-HTML converter (no extra deps)
function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```[\w]*\n([\s\S]+?)```/g, '<pre><code>$1</code></pre>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hup]|<li|<pre)(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = (await getPost(slug)) as unknown as PostDoc | null
  if (!post) notFound()

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog"
          className="inline-flex items-center gap-2 text-sm font-mono mb-12 hover:opacity-80"
          style={{ color: 'var(--muted)' }}>
          ← BACK TO BLOG
        </Link>

        <article>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.map((tag) => (
              <span key={tag}
                className="text-xs font-mono px-2 py-0.5 rounded"
                style={{ backgroundColor: 'rgba(0,212,255,0.1)', color: 'var(--accent)' }}>
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

          <time className="block text-xs font-mono mb-12" style={{ color: 'var(--muted)' }}>
            {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>

          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
          />
        </article>
      </div>
    </div>
  )
}
