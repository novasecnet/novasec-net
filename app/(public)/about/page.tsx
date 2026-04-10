import { connectDB } from '@/lib/mongodb'
import { Section } from '@/lib/models/Section'
import BioSection from '@/components/sections/BioSection'
import ExperienceSection from '@/components/sections/ExperienceSection'
import ServicesSection from '@/components/sections/ServicesSection'
import SkillsSection from '@/components/sections/SkillsSection'
import CertificationsSection from '@/components/sections/CertificationsSection'

export const revalidate = 60

const SECTION_MAP: Record<string, React.ComponentType<{ content: Record<string, unknown> }>> = {
  bio: BioSection,
  experience: ExperienceSection,
  services: ServicesSection,
  skills: SkillsSection,
  certifications: CertificationsSection,
}

async function getAboutSections() {
  try {
    await connectDB()
    return Section.find({ page: 'about', visible: true }).sort({ order: 1 }).lean()
  } catch {
    return []
  }
}

export default async function AboutPage() {
  const sections = await getAboutSections()
  return (
    <div>
      {sections.map((section: Record<string, unknown>) => {
        const Comp = SECTION_MAP[section.type as string]
        if (!Comp) return null
        return <Comp key={section._id as string} content={section.content as Record<string, unknown>} />
      })}
    </div>
  )
}
