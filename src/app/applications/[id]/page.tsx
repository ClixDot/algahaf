import ApplicationDetail from '../../../views/ApplicationDetail';
import { applicationsData } from '../../../data/applicationsData';

import { getCmsSections } from '../../../lib/cmsData';

export function generateStaticParams() {
  return applicationsData.map((item) => ({
    id: item.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const fallback = applicationsData.find((item) => item.id === id) || applicationsData[0];
  
  try {
    const sections = await getCmsSections('applications', 'live');
    const cardsSec = sections.find((s) => s.sectionId === 'applications-cards');
    const card = cardsSec?.items?.find((item: any) => item.id === id || item.slug === id);
    if (card) {
      return {
        title: `${card.heroTitle || card.title || fallback.title} — AlGhaf Collective`,
        description: card.heroDesc || card.description || fallback.description,
      };
    }
  } catch {}

  return {
    title: `${fallback.heroTitle || fallback.title} — AlGhaf Collective`,
    description: fallback.heroDesc || fallback.description,
  };
}

export default function Page() {
  return <ApplicationDetail />;
}
