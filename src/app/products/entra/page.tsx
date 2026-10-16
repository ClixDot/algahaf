import ProductEntra from '../../../views/ProductEntra';
import ProductComingSoon from '../../../components/common/ProductComingSoon';
import { getLiveProduct } from '../../../lib/productsHelper';
import { getGlobalSettings } from '../../../lib/settingsData';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, verifyToken } from '../../../lib/auth';

interface EntraPageProps {
  searchParams?: Promise<{ preview?: string }>;
}

export async function generateMetadata() {
  const p = await getLiveProduct('entra');
  return {
    title: p?.seo?.title || 'ENTRA — Entertainment & Wellness Modular System (40–120 m²) — AlGhaf Collective',
    description: p?.seo?.description || 'Specialized modular spaces curated for private cinema, home wellness, executive garden offices, and gaming suites.',
  };
}

export default async function EntraPage({ searchParams }: EntraPageProps) {
  const product = await getLiveProduct('entra');
  const settings = await getGlobalSettings();
  const sp = searchParams ? await searchParams : {};

  // Check admin session for previewing draft products
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const isAdmin = token ? Boolean(verifyToken(token)) : false;

  const isPublicAllowed = settings?.productDetailsAccess !== false && product?.status === 'published';

  if (!isPublicAllowed && !isAdmin && sp?.preview !== 'true') {
    return (
      <ProductComingSoon
        productName={product?.name || 'ENTRA'}
        category={product?.category || 'Private Entertainment'}
        tagline={product?.tagline || product?.shortDescription || 'Your Space. Your Experience.'}
        bgImage={product?.heroImage || '/assets/renders/ENTRA_EXT_3D_img1.jpg'}
        sizeRange={product?.sizeRange || '3 Available Sizes'}
      />
    );
  }

  return <ProductEntra initialProduct={product} />;
}
