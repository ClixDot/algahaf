import Products from '../../views/Products';
import { getCmsSections } from '../../lib/cmsData';
import { getGlobalSettings } from '../../lib/settingsData';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Modular Living Systems & Collections — AlGhaf Collective',
  description: 'Explore the MOVA, PENTA, and ENTRA modular architectural systems engineered for precision, speed, and sustainability.',
};

export default async function ProductsPage() {
  const initialSections = await getCmsSections('products', 'live');
  const settings = await getGlobalSettings();
  return (
    <Products
      initialSections={initialSections}
      initialDetailsOpen={Boolean(settings?.productDetailsAccess)}
    />
  );
}
