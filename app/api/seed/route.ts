import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { AdminUser } from '@/lib/models/AdminUser'
import { Section } from '@/lib/models/Section'
import { Post } from '@/lib/models/Post'

export async function POST() {
  // Only allow in development or if no admin exists
  await connectDB()

  const existing = await AdminUser.findOne({})
  if (existing) {
    return NextResponse.json({ message: 'Already seeded' }, { status: 400 })
  }

  const passwordHash = await bcrypt.hash('novasec2025!', 12)
  await AdminUser.create({ email: 'admin@novasec.net', passwordHash, name: 'Admin' })

  // Seed default sections for home page
  await Section.insertMany([
    {
      page: 'home',
      type: 'hero',
      order: 0,
      visible: true,
      content: {
        headline: 'Network Security Expert',
        subheadline: 'Penetration Testing · Threat Intelligence · Security Consulting',
        cta: 'View My Work',
        ctaLink: '/about',
      },
    },
    {
      page: 'home',
      type: 'skills',
      order: 1,
      visible: true,
      content: {
        title: 'Core Skills',
        items: [
          { name: 'Penetration Testing', level: 95 },
          { name: 'Network Security', level: 90 },
          { name: 'Incident Response', level: 85 },
          { name: 'Security Auditing', level: 88 },
          { name: 'Malware Analysis', level: 80 },
          { name: 'OSINT', level: 85 },
        ],
      },
    },
    {
      page: 'home',
      type: 'certifications',
      order: 2,
      visible: true,
      content: {
        title: 'Certifications',
        items: [
          { name: 'CEH', full: 'Certified Ethical Hacker' },
          { name: 'OSCP', full: 'Offensive Security Certified Professional' },
          { name: 'CISSP', full: 'Certified Information Systems Security Professional' },
          { name: 'CompTIA Security+', full: 'CompTIA Security+' },
        ],
      },
    },
    {
      page: 'home',
      type: 'testimonials',
      order: 3,
      visible: true,
      content: { title: 'What Clients Say' },
    },
    {
      page: 'home',
      type: 'contact',
      order: 4,
      visible: true,
      content: {
        title: 'Get In Touch',
        email: 'contact@novasec.net',
        linkedin: '',
        github: '',
      },
    },
    {
      page: 'about',
      type: 'bio',
      order: 0,
      visible: true,
      content: {
        name: 'Security Professional',
        title: 'Network Security Expert',
        bio: 'With years of experience in network security, penetration testing, and threat intelligence, I help organizations identify and remediate vulnerabilities before adversaries can exploit them.',
        avatar: '',
      },
    },
    {
      page: 'about',
      type: 'experience',
      order: 1,
      visible: true,
      content: {
        title: 'Experience',
        items: [
          {
            role: 'Senior Security Consultant',
            company: 'NovaSec',
            period: '2020 – Present',
            description: 'Lead penetration testing engagements, red team operations, and security architecture reviews.',
          },
        ],
      },
    },
    {
      page: 'about',
      type: 'services',
      order: 2,
      visible: true,
      content: {
        title: 'Services',
        items: [
          { name: 'Penetration Testing', description: 'Web, network, and infrastructure assessments.' },
          { name: 'Security Audits', description: 'Comprehensive review of your security posture.' },
          { name: 'Incident Response', description: 'Rapid response and containment of security incidents.' },
          { name: 'Security Training', description: 'Team training and security awareness programs.' },
        ],
      },
    },
  ])

  // Seed a sample blog post
  await Post.create({
    title: 'Getting Started with Penetration Testing',
    slug: 'getting-started-penetration-testing',
    excerpt: 'An introduction to ethical hacking methodologies and tools used by security professionals.',
    body: `# Getting Started with Penetration Testing\n\nPenetration testing is a simulated cyber attack on a computer system, network, or web application to assess its security.\n\n## Methodology\n\n1. **Reconnaissance** – Gather information about the target\n2. **Scanning** – Identify open ports and services\n3. **Exploitation** – Attempt to exploit vulnerabilities\n4. **Post-exploitation** – Assess the impact of the breach\n5. **Reporting** – Document findings and recommendations\n\n## Common Tools\n\n- **Nmap** – Network scanner\n- **Metasploit** – Exploitation framework\n- **Burp Suite** – Web application testing\n- **Wireshark** – Network protocol analyzer\n\nAlways obtain written permission before testing any system you do not own.`,
    tags: ['pentesting', 'security', 'hacking'],
    published: true,
  })

  return NextResponse.json({ message: 'Seeded successfully', credentials: { email: 'admin@novasec.net', password: 'novasec2025!' } })
}
