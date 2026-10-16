import Home from '../views/Home';
import { getCmsSections } from '../lib/cmsData';
import { getGlobalSettings } from '../lib/settingsData';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'AlGhaf Collective — Design Smarter. Build Precisely.',
  description:
    'UAE-based integrated design, prefabrication, and modular construction company creating smarter, more sustainable homes through one integrated system.',
};

export default async function Page() {
  const initialSections = await getCmsSections('home', 'live');
  const settings = await getGlobalSettings();
  return (
    <Home
      initialSections={initialSections}
      initialDetailsOpen={Boolean(settings?.productDetailsAccess)}
    />
  );
}
