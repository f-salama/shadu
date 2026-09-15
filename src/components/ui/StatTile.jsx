import './StatTile.css';

export default function StatTile({ label, value, unit, hint, accent = 'primary' }) {
  return (
    <div className={`stat-tile stat-tile-${accent}`}>
      <span className="stat-tile-label">{label}</span>
      <span className="stat-tile-value">
        {value}
        {unit && <span className="stat-tile-unit">{unit}</span>}
      </span>
      {hint && <span className="stat-tile-hint">{hint}</span>}
    </div>
  );
}
