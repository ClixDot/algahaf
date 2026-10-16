import { redirect } from 'next/navigation';
import ProductEntra from '../../../views/ProductEntra';
import { getLiveProduct } from '../../../lib/productsHelper';
import { getGlobalSettings } from '../../../lib/settingsData';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, verifyToken } from '../../../lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  const isDetailsOpen = Boolean(settings?.productDetailsAccess);

  if (!isDetailsOpen && !isAdmin && sp?.preview !== 'true') {
    redirect('/products');
  }

  return <ProductEntra initialProduct={product} />;
}
