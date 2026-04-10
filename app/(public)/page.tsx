import { connectDB } from '@/lib/mongodb'
import { Section } from '@/lib/models/Section'
import { Testimonial } from '@/lib/models/Testimonial'
import HeroSection from '@/components/sections/HeroSection'
import SkillsSection from '@/components/sections/SkillsSection'
import CertificationsSection from '@/components/sections/CertificationsSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import ContactSection from '@/components/sections/ContactSection'

export const revalidate = 60

async function getHomeData() {
  try {
    await connectDB()
    const [sections, testimonials] = await Promise.all([
      Section.find({ page: 'home', visible: true }).sort({ order: 1 }).lean(),
      Testimonial.find({ visible: true }).lean(),
    ])
    return { sections, testimonials }
  } catch {
    return { sections: [], testimonials: [] }
  }
}

const SECTION_MAP: Record<string, React.ComponentType<{ content: Record<string, unknown>; extra?: unknown }>> = {
  hero: HeroSection,
  skills: SkillsSection,
  certifications: CertificationsSection,
  testimonials: TestimonialsSection,
  contact: ContactSection,
}

export default async function HomePage() {
  const { sections, testimonials } = await getHomeData()

  if (sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-text mb-4">NovaSec</h1>
          <p style={{ color: 'var(--muted)' }}>Network Security Expert</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {sections.map((section: Record<string, unknown>) => {
        const Comp = SECTION_MAP[section.type as string]
        if (!Comp) return null
        return (
          <Comp
            key={section._id as string}
            content={section.content as Record<string, unknown>}
            extra={section.type === 'testimonials' ? testimonials : undefined}
          />
        )
      })}
    </div>
  )
}
