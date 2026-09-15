import './charts.css';

export default function ErrorBreakdownChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div className="empty-state">
        <h3>لا توجد أخطاء مسجلة</h3>
        <p>سيظهر تفصيل أنواع الأخطاء هنا بعد تسجيل جلسات ممارسة.</p>
      </div>
    );
  }

  return (
    <div className="error-breakdown">
      {data.map((item) => {
        const pct = total ? Math.round((item.value / total) * 100) : 0;
        return (
          <div className="error-breakdown-row" key={item.key}>
            <div className="error-breakdown-row-top">
              <span className="error-breakdown-label">
                <span className="error-breakdown-dot" style={{ background: item.color }} />
                {item.label}
              </span>
              <span className="error-breakdown-count">
                {item.value} <span className="text-muted">({pct}%)</span>
              </span>
            </div>
            <div className="error-breakdown-track">
              <div className="error-breakdown-fill" style={{ width: `${pct}%`, background: item.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
