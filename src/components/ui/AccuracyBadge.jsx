export default function AccuracyBadge({ value }) {
  let cls = 'badge-success';
  if (value < 60) cls = 'badge-danger';
  else if (value < 80) cls = 'badge-warning';

  return <span className={`badge ${cls}`}>{value}%</span>;
}
