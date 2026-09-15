import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useChild } from '../context/ChildContext';
import {
  computeTrend,
  currentStreak,
  errorBreakdown,
  overallAccuracy,
  sessions,
} from '../data/mockData';
import PageHeader from '../components/ui/PageHeader';
import StatTile from '../components/ui/StatTile';
import AccuracyTrendChart from '../components/charts/AccuracyTrendChart';
import ErrorBreakdownChart from '../components/charts/ErrorBreakdownChart';
import { IconSvg } from '../components/layout/icons';
import './Dashboard.css';

const QUICK_LINKS = [
  {
    to: '/history',
    icon: 'history',
    title: 'سجل الجلسات',
    description: 'استعرضي كل جلسات الممارسة السابقة بالتفصيل.',
  },
  {
    to: '/results',
    icon: 'results',
    title: 'النتائج',
    description: 'تفاصيل الأداء والكلمات لكل جلسة، جاهزة للمشاركة.',
  },
  {
    to: '/practice',
    icon: 'practice',
    title: 'التمارين المنزلية',
    description: 'تمارين موجّهة يمكنكِ ممارستها مع طفلك في المنزل.',
  },
];

export default function Dashboard() {
  const { child } = useChild();
  const [range, setRange] = useState(30);
  const trend = useMemo(() => computeTrend(sessions, range), [range]);
  const lastSession = sessions[0];

  return (
    <div>
      <PageHeader
        title={`مرحبًا بكِ، متابعة تقدّم ${child.nickname || child.name}`}
        subtitle={`آخر جلسة ممارسة: ${lastSession ? formatArabicDate(lastSession.date) : 'لا توجد جلسات بعد'}`}
      />

      <div className="dashboard-stats">
        <StatTile label="التقدّم العام (آخر 7 جلسات)" value={overallAccuracy} unit="%" accent="primary" />
        <StatTile
          label="أيام ممارسة متتالية"
          value={currentStreak}
          unit={currentStreak === 1 ? 'يوم' : 'أيام'}
          accent="success"
        />
        <StatTile
          label="الصوت المستهدف حاليًا"
          value={`صوت ${child.targetSound}`}
          hint="حسب اختيار التقييم الأولي"
          accent="amber"
        />
        <StatTile label="إجمالي الجلسات المسجّلة" value={sessions.length} unit="جلسة" />
      </div>

      <div className="dashboard-grid">
        <section className="card card-pad dashboard-trend-card">
          <div className="card-header">
            <div>
              <h2>نسبة الدقة عبر الوقت</h2>
              <p className="card-subtitle">تتبّعي تطوّر أداء طفلك في التمارين</p>
            </div>
            <div className="dashboard-range-toggle">
              <button
                type="button"
                className={range === 7 ? 'is-active' : ''}
                onClick={() => setRange(7)}
              >
                7 أيام
              </button>
              <button
                type="button"
                className={range === 30 ? 'is-active' : ''}
                onClick={() => setRange(30)}
              >
                30 يومًا
              </button>
            </div>
          </div>
          <AccuracyTrendChart data={trend} />
        </section>

        <section className="card card-pad dashboard-errors-card">
          <div className="card-header">
            <div>
              <h2>تفصيل أنواع الأخطاء</h2>
              <p className="card-subtitle">إجمالي كل الجلسات المسجّلة</p>
            </div>
          </div>
          <ErrorBreakdownChart data={errorBreakdown} />
        </section>
      </div>

      <section className="dashboard-quick-links">
        <h2>الوصول السريع</h2>
        <div className="dashboard-quick-links-grid">
          {QUICK_LINKS.map((link) => (
            <Link to={link.to} key={link.to} className="quick-link-card">
              <span className="quick-link-icon">
                <IconSvg name={link.icon} size={22} />
              </span>
              <span className="quick-link-title">{link.title}</span>
              <span className="quick-link-description">{link.description}</span>
              <span className="quick-link-arrow">
                <IconSvg name="chevron" size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function formatArabicDate(dateStr) {
  return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(dateStr),
  );
}
