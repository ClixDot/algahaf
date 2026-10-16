import ProductPenta from '../../../views/ProductPenta';
import ProductComingSoon from '../../../components/common/ProductComingSoon';
import { getLiveProduct } from '../../../lib/productsHelper';
import { getGlobalSettings } from '../../../lib/settingsData';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, verifyToken } from '../../../lib/auth';

interface PentaPageProps {
  searchParams?: Promise<{ preview?: string }>;
}

export async function generateMetadata() {
  const p = await getLiveProduct('penta');
  return {
    title: p?.seo?.title || 'PENTA — Residential Modular System (50–300 m²) — AlGhaf Collective',
    description: p?.seo?.description || 'Signature double-height modular villa architecture offering luxury mezzanine spaces, premium finishes, and superior acoustic comfort.',
  };
}

export default async function PentaPage({ searchParams }: PentaPageProps) {
  const product = await getLiveProduct('penta');
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
        productName={product?.name || 'PENTA'}
        category={product?.category || 'Luxury Architectural Living'}
        tagline={product?.tagline || product?.shortDescription || 'Designed to Stand Apart. Built to Perform.'}
        bgImage={product?.heroImage || '/assets/images/imgupscaler-enhanced-7.jpg'}
        sizeRange={product?.sizeRange || '50–300 m²'}
      />
    );
  }

  return <ProductPenta initialProduct={product} />;
}
