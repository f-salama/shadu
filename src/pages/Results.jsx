import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { computeErrorBreakdown, getSessionById, sessions } from '../data/mockData';
import { useChild } from '../context/ChildContext';
import PageHeader from '../components/ui/PageHeader';
import StatTile from '../components/ui/StatTile';
import ErrorTypeBadge from '../components/ui/ErrorTypeBadge';
import ErrorBreakdownChart from '../components/charts/ErrorBreakdownChart';
import { IconSvg } from '../components/layout/icons';
import './Results.css';

const dateFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { day: 'numeric', month: 'long', year: 'numeric' });

export default function Results() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { child } = useChild();
  const [shareNotice, setShareNotice] = useState(false);

  const session = (sessionId && getSessionById(sessionId)) || sessions[0];

  useEffect(() => {
    if (!sessionId && session) {
      navigate(`/results/${session.id}`, { replace: true });
    }
  }, [sessionId, session, navigate]);

  if (!session) {
    return (
      <div className="empty-state">
        <h3>لا توجد جلسات مسجّلة بعد</h3>
        <p>ستظهر نتائج الجلسات هنا بعد إتمام أول تمرين.</p>
      </div>
    );
  }

  const sessionErrorBreakdown = computeErrorBreakdown([session]);

  function handleShare() {
    setShareNotice(true);
    setTimeout(() => setShareNotice(false), 2600);
  }

  return (
    <div className="results-page">
      <PageHeader
        title="تفاصيل النتيجة"
        subtitle={`تقرير جلسة ${session.activityName} بتاريخ ${dateFormatter.format(new Date(session.date))}`}
        actions={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
              <IconSvg name="print" size={17} />
              طباعة
            </button>
            <button type="button" className="btn btn-primary" onClick={handleShare}>
              مشاركة مع الأخصائية
            </button>
          </>
        }
      />

      {shareNotice && (
        <div className="inline-success-notice" role="status">
          تم تجهيز التقرير لمشاركته مع أخصائية النطق. (هذا إجراء تجريبي في النموذج الأولي)
        </div>
      )}

      <div className="results-toolbar card card-pad">
        <label htmlFor="session-select">اختيار جلسة أخرى</label>
        <select
          id="session-select"
          className="input"
          value={session.id}
          onChange={(e) => navigate(`/results/${e.target.value}`)}
        >
          {sessions.map((s) => (
            <option key={s.id} value={s.id}>
              {dateFormatter.format(new Date(s.date))} — {s.activityName} ({s.accuracy}%)
            </option>
          ))}
        </select>
      </div>

      <div className="dashboard-stats results-stats">
        <StatTile label="نسبة الدقة" value={session.accuracy} unit="%" accent="primary" />
        <StatTile label="الإجابات الصحيحة" value={`${session.correctCount}/${session.attemptsCount}`} />
        <StatTile label="مدة الجلسة" value={session.durationMinutes} unit="دقيقة" />
        <StatTile
          label="الطفل"
          value={child.nickname || child.name}
          hint={`صوت ${child.targetSound} المستهدف`}
          accent="amber"
        />
      </div>

      <div className="results-grid">
        <section className="card card-pad">
          <div className="card-header">
            <div>
              <h2>تفصيل المحاولات</h2>
              <p className="card-subtitle">أداء طفلك في كل كلمة خلال هذه الجلسة</p>
            </div>
          </div>

          <ul className="attempts-list">
            {session.attempts.map((attempt, i) => (
              <li key={i} className={`attempt-row ${attempt.result === 'correct' ? 'is-correct' : 'is-incorrect'}`}>
                <span className="attempt-result-icon" aria-hidden="true">
                  {attempt.result === 'correct' ? '✓' : '✕'}
                </span>
                <span className="attempt-word">{attempt.word}</span>
                <span className="attempt-tag">
                  <ErrorTypeBadge type={attempt.errorType} />
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card card-pad">
          <div className="card-header">
            <div>
              <h2>توزيع الأخطاء</h2>
              <p className="card-subtitle">لهذه الجلسة فقط</p>
            </div>
          </div>
          <ErrorBreakdownChart data={sessionErrorBreakdown} />
        </section>
      </div>
    </div>
  );
}
