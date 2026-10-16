import Home from '../views/Home';
import { getCmsSections } from '../lib/cmsData';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'AlGhaf Collective — Design Smarter. Build Precisely.',
  description:
    'UAE-based integrated design, prefabrication, and modular construction company creating smarter, more sustainable homes through one integrated system.',
};

export default async function Page() {
  const initialSections = await getCmsSections('home', 'live');
  return <Home initialSections={initialSections} />;
}
