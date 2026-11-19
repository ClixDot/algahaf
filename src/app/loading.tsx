// Shown instantly while a page's server data loads. Because Next.js prefetches
// this boundary for every <Link>, clicking a nav link responds immediately
// instead of waiting on the server round trip.
export default function Loading() {
  return (
    <div className="route-loading" role="status" aria-label="Loading page">
      <span className="route-loading-bar" />
    </div>
  );
}
