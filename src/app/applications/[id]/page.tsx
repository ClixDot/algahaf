import ApplicationDetail from '../../../views/ApplicationDetail';
import { applicationsData } from '../../../data/applicationsData';

export function generateStaticParams() {
  return applicationsData.map((item) => ({
    id: item.id,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const app = applicationsData.find((item) => item.id === resolvedParams?.id) || applicationsData[0];
  return {
    title: `${app.title} — AlGhaf Collective`,
    description: app.description,
  };
}

export default function Page() {
  return <ApplicationDetail />;
}
