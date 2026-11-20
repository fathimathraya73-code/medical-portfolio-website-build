export const competencies = [
  {
    id: 'medical-expert',
    title: 'Medical Expert',
    description:
      'Bring together medical knowledge, clinical reasoning, and practical skills to provide safe, effective care.',
  },
  {
    id: 'evidence-based-practitioner-and-scholar',
    title: 'Evidence-Based Practitioner and Scholar',
    description:
      'Find, assess, and apply research evidence while reflecting on practice and continuing to learn.',
  },
  {
    id: 'patient-care-provider-and-health-advocate',
    title: 'Patient Care Provider and Health Advocate',
    description:
      'Provide compassionate, patient-centred care and support the health of individuals and communities.',
  },
  {
    id: 'communicator',
    title: 'Communicator',
    description:
      'Build trusting relationships and share information clearly with patients, families, and colleagues.',
  },
  {
    id: 'collaborator-innovator-and-leader',
    title: 'Collaborator, Innovator and Leader',
    description:
      'Work across professions, contribute new ideas, and help teams deliver effective care.',
  },
  {
    id: 'professional',
    title: 'Professional',
    description:
      'Practise with integrity, accountability, respect, and a commitment to ethical care.',
  },
  {
    id: 'system-based-healthcare-advocate',
    title: 'System-Based Healthcare Advocate',
    description:
      'Understand the health system and use its resources responsibly to improve quality and safety.',
  },
  {
    id: 'self-and-profession-enhancer',
    title: 'Self and Profession Enhancer',
    description:
      'Support personal wellbeing, seek feedback, and contribute to ongoing professional development.',
  },
  {
    id: 'socially-accountable-practitioner',
    title: 'Socially Accountable Practitioner',
    description:
      'Respond to diverse community needs and contribute to equitable, culturally responsive care.',
  },
] as const

export type CompetencyId = (typeof competencies)[number]['id']
export type PortfolioSection = CompetencyId | 'profile'

export function isPortfolioSection(value: string): value is PortfolioSection {
  return value === 'profile' || competencies.some((competency) => competency.id === value)
}
