import { notFound, redirect } from 'next/navigation';
import ProductMova from '../../../views/ProductMova';
import ProductPenta from '../../../views/ProductPenta';
import ProductEntra from '../../../views/ProductEntra';
import { getLiveProduct } from '../../../lib/productsHelper';
import { getGlobalSettings } from '../../../lib/settingsData';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, verifyToken } from '../../../lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const p = await getLiveProduct(slug);
  if (!p) return { title: 'Product Not Found — AlGhaf Collective' };

  return {
    title: p?.seo?.title || `${p.name} — ${p.fullName || 'Modular System'} — AlGhaf Collective`,
    description: p?.seo?.description || p.shortDescription || `${p.name} modular system by AlGhaf Collective.`,
  };
}

export default async function DynamicProductPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const product = await getLiveProduct(slug);

  if (!product) {
    notFound();
  }

  const settings = await getGlobalSettings();
  const sp = searchParams ? await searchParams : {};

  // Check admin session for live previewing draft products
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const isAdmin = token ? Boolean(verifyToken(token)) : false;

  const isDetailsOpen = Boolean(settings?.productDetailsAccess);

  // Disable public product details navigation if toggled off; preserve admin preview
  if (!isDetailsOpen && !isAdmin && sp?.preview !== 'true') {
    redirect('/products');
  }

  if (slug === 'penta') return <ProductPenta initialProduct={product} />;
  if (slug === 'entra') return <ProductEntra initialProduct={product} />;
  return <ProductMova initialProduct={product} />;
}
