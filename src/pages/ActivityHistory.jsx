import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ERROR_TYPES, sessions } from '../data/mockData';
import PageHeader from '../components/ui/PageHeader';
import AccuracyBadge from '../components/ui/AccuracyBadge';
import ErrorTypeBadge from '../components/ui/ErrorTypeBadge';
import './ActivityHistory.css';

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'الأحدث أولًا' },
  { value: 'date-asc', label: 'الأقدم أولًا' },
  { value: 'accuracy-desc', label: 'الدقة: من الأعلى' },
  { value: 'accuracy-asc', label: 'الدقة: من الأقل' },
  { value: 'duration-desc', label: 'المدة: الأطول' },
];

const dateFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { day: 'numeric', month: 'short', year: 'numeric' });

export default function ActivityHistory() {
  const [search, setSearch] = useState('');
  const [errorFilter, setErrorFilter] = useState('all');
  const [sort, setSort] = useState('date-desc');

  const filtered = useMemo(() => {
    let list = sessions.filter((s) => s.activityName.includes(search.trim()));
    if (errorFilter === 'none') {
      list = list.filter((s) => !s.dominantErrorType);
    } else if (errorFilter !== 'all') {
      list = list.filter((s) => s.dominantErrorType === errorFilter);
    }

    const [key, dir] = sort.split('-');
    list = [...list].sort((a, b) => {
      let diff = 0;
      if (key === 'date') diff = new Date(a.date) - new Date(b.date);
      if (key === 'accuracy') diff = a.accuracy - b.accuracy;
      if (key === 'duration') diff = a.durationMinutes - b.durationMinutes;
      return dir === 'asc' ? diff : -diff;
    });
    return list;
  }, [search, errorFilter, sort]);

  return (
    <div>
      <PageHeader title="سجل الجلسات" subtitle="كل جلسات الممارسة المسجّلة لطفلك، مرتبة وقابلة للتصفية." />

      <div className="history-toolbar">
        <input
          type="text"
          className="input history-search"
          placeholder="ابحثي باسم النشاط..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="input history-select" value={errorFilter} onChange={(e) => setErrorFilter(e.target.value)}>
          <option value="all">كل أنواع الأخطاء</option>
          <option value="none">بدون أخطاء ملحوظة</option>
          {Object.values(ERROR_TYPES).map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>

        <select className="input history-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <p className="history-count">
        عرض {filtered.length} من أصل {sessions.length} جلسة
      </p>

      <div className="card history-table-wrap">
        <table className="history-table">
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>النشاط</th>
              <th>المدة</th>
              <th>نسبة الدقة</th>
              <th>الخطأ الأكثر تكرارًا</th>
              <th className="visually-hidden">التفاصيل</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((session) => (
              <tr key={session.id}>
                <td>{dateFormatter.format(new Date(session.date))}</td>
                <td>{session.activityName}</td>
                <td>{session.durationMinutes} د</td>
                <td>
                  <AccuracyBadge value={session.accuracy} />
                </td>
                <td>
                  <ErrorTypeBadge type={session.dominantErrorType} />
                </td>
                <td>
                  <Link to={`/results/${session.id}`} className="btn btn-ghost btn-sm">
                    عرض التفاصيل
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="empty-state">
            <h3>لا توجد نتائج مطابقة</h3>
            <p>جرّبي تعديل كلمة البحث أو الفلاتر المستخدمة.</p>
          </div>
        )}
      </div>
    </div>
  );
}
