import { redirect } from 'next/navigation';
import ProductMova from '../../../views/ProductMova';
import { getLiveProduct } from '../../../lib/productsHelper';
import { getGlobalSettings } from '../../../lib/settingsData';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, verifyToken } from '../../../lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface MovaPageProps {
  searchParams?: Promise<{ preview?: string }>;
}

export async function generateMetadata() {
  const p = await getLiveProduct('mova');
  return {
    title: p?.seo?.title || 'MOVA — Compact Architectural System (30–75 m²) — AlGhaf Collective',
    description: p?.seo?.description || 'Precision-engineered modular living space designed for rapid deployment, resort villas, farm retreats, and private annexes.',
  };
}

export default async function MovaPage({ searchParams }: MovaPageProps) {
  const product = await getLiveProduct('mova');
  const settings = await getGlobalSettings();
  const sp = searchParams ? await searchParams : {};

  // Check admin session for live previewing draft products
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const isAdmin = token ? Boolean(verifyToken(token)) : false;

  const isDetailsOpen = Boolean(settings?.productDetailsAccess);

  if (!isDetailsOpen && !isAdmin && sp?.preview !== 'true') {
    redirect('/products');
  }

  return <ProductMova initialProduct={product} />;
}
