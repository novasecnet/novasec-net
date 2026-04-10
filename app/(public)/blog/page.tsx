import Link from 'next/link'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/lib/models/Post'

export const revalidate = 60

interface PostDoc {
  _id: string
  title: string
  slug: string
  excerpt: string
  tags: string[]
  createdAt: string
}

async function getPosts() {
  try {
    await connectDB()
    return Post.find({ published: true }).sort({ createdAt: -1 }).lean()
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const posts = (await getPosts()) as unknown as PostDoc[]

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>// KNOWLEDGE BASE</span>
          <h1 className="text-4xl font-bold mt-2">Security Blog</h1>
          <p className="mt-3" style={{ color: 'var(--muted)' }}>
            Insights on penetration testing, threat intelligence, and network defense.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-24 border rounded-lg"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
            <div className="text-4xl mb-4">📝</div>
            <p className="font-mono">// No posts published yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article key={post._id}
                className="p-6 rounded-lg border transition-all hover:border-opacity-60 group"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags?.map((tag) => (
                    <span key={tag}
                      className="text-xs font-mono px-2 py-0.5 rounded"
                      style={{ backgroundColor: 'rgba(0,212,255,0.1)', color: 'var(--accent)' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-sky-400 transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                {post.excerpt && (
                  <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>{post.excerpt}</p>
                )}
                <div className="flex items-center justify-between">
                  <time className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
                    {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                  <Link href={`/blog/${post.slug}`}
                    className="text-xs font-mono"
                    style={{ color: 'var(--accent)' }}>
                    READ MORE →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
