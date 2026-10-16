import About from '../../views/About';
import { getCmsSections } from '../../lib/cmsData';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'About AlGhaf & The Ghaf Tree — AlGhaf Collective',
  description: 'Learn about our philosophy, inspiration from the UAE national Ghaf tree, and modular architecture approach.',
};

export default async function AboutPage() {
  const initialSections = await getCmsSections('about', 'live');
  return <About initialSections={initialSections} />;
}
