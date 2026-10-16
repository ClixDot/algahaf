import Contact from '../../views/Contact';
import { getCmsSections } from '../../lib/cmsData';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact & Project Inquiries — AlGhaf Collective',
  description:
    'Connect with our Dubai design and engineering team to discuss your residential, hospitality, or commercial modular project.',
};

export default async function ContactPage() {
  const initialSections = await getCmsSections('contact', 'live');
  return <Contact initialSections={initialSections} />;
}
