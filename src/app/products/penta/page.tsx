import { redirect } from 'next/navigation';
import ProductPenta from '../../../views/ProductPenta';
import { getLiveProduct } from '../../../lib/productsHelper';
import { getGlobalSettings } from '../../../lib/settingsData';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, verifyToken } from '../../../lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  const isDetailsOpen = Boolean(settings?.productDetailsAccess);

  if (!isDetailsOpen && !isAdmin && sp?.preview !== 'true') {
    redirect('/products');
  }

  return <ProductPenta initialProduct={product} />;
}
