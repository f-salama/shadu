import { useState } from 'react';
import { parent } from '../data/mockData';
import PageHeader from '../components/ui/PageHeader';
import './Settings.css';

const initialNotifications = {
  weeklyReport: true,
  dailyReminder: true,
  therapistNotes: true,
  productUpdates: false,
};

export default function Settings() {
  const [account, setAccount] = useState({ name: parent.name, email: parent.email, phone: parent.phone });
  const [notifications, setNotifications] = useState(initialNotifications);
  const [reminderFrequency, setReminderFrequency] = useState('daily');
  const [reminderTime, setReminderTime] = useState('17:30');
  const [savedNotice, setSavedNotice] = useState(false);

  function handleAccountChange(e) {
    const { name, value } = e.target;
    setAccount((prev) => ({ ...prev, [name]: value }));
  }

  function toggleNotification(key) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSave(e) {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2600);
  }

  return (
    <div>
      <PageHeader title="الإعدادات" subtitle="إدارة معلومات الحساب والتنبيهات والتذكيرات الذكية." />

      {savedNotice && (
        <div className="inline-success-notice" role="status">
          تم حفظ التغييرات بنجاح.
        </div>
      )}

      <form onSubmit={handleSave} className="settings-form">
        <section className="card card-pad">
          <div className="card-header">
            <div>
              <h2>معلومات الحساب</h2>
              <p className="card-subtitle">بيانات ولي الأمر المسجّلة في التطبيق</p>
            </div>
          </div>

          <div className="settings-row">
            <div className="field">
              <label htmlFor="parent-name">الاسم</label>
              <input id="parent-name" name="name" className="input" value={account.name} onChange={handleAccountChange} />
            </div>
            <div className="field">
              <label htmlFor="parent-email">البريد الإلكتروني</label>
              <input
                id="parent-email"
                name="email"
                type="email"
                className="input"
                value={account.email}
                onChange={handleAccountChange}
              />
            </div>
          </div>

          <div className="settings-row">
            <div className="field">
              <label htmlFor="parent-phone">رقم الجوال</label>
              <input id="parent-phone" name="phone" className="input" value={account.phone} onChange={handleAccountChange} />
            </div>
            <div className="field">
              <label htmlFor="language">اللغة</label>
              <select id="language" className="input" defaultValue="ar" disabled>
                <option value="ar">العربية</option>
                <option value="en">English (قريبًا)</option>
              </select>
              <span className="field-hint">دعم اللغة الإنجليزية قيد التطوير حاليًا.</span>
            </div>
          </div>
        </section>

        <section className="card card-pad">
          <div className="card-header">
            <div>
              <h2>تفضيلات الإشعارات</h2>
              <p className="card-subtitle">اختاري الإشعارات التي تودّين استلامها</p>
            </div>
          </div>

          <div className="settings-toggle-list">
            <ToggleRow
              label="تقرير تقدّم أسبوعي"
              hint="ملخص أسبوعي بأداء طفلك عبر البريد الإلكتروني"
              checked={notifications.weeklyReport}
              onChange={() => toggleNotification('weeklyReport')}
            />
            <ToggleRow
              label="تذكير يومي بالتمارين"
              hint="إشعار يومي في حال عدم إتمام تمرين لهذا اليوم"
              checked={notifications.dailyReminder}
              onChange={() => toggleNotification('dailyReminder')}
            />
            <ToggleRow
              label="ملاحظات الأخصائية"
              hint="تنبيه فوري عند إضافة ملاحظة جديدة على ملف الطفل"
              checked={notifications.therapistNotes}
              onChange={() => toggleNotification('therapistNotes')}
            />
            <ToggleRow
              label="تحديثات المنصة"
              hint="أخبار وميزات جديدة في تطبيق شَدْوُ"
              checked={notifications.productUpdates}
              onChange={() => toggleNotification('productUpdates')}
            />
          </div>
        </section>

        <section className="card card-pad">
          <div className="card-header">
            <div>
              <h2>التذكيرات الذكية</h2>
              <p className="card-subtitle">حدّدي متى وكم مرة تودّين تلقّي تذكير بالممارسة</p>
            </div>
          </div>

          <div className="settings-row">
            <div className="field">
              <label htmlFor="reminder-frequency">التكرار</label>
              <select
                id="reminder-frequency"
                className="input"
                value={reminderFrequency}
                onChange={(e) => setReminderFrequency(e.target.value)}
              >
                <option value="daily">يوميًا</option>
                <option value="every-other-day">كل يومين</option>
                <option value="weekdays">أيام الأسبوع فقط (الأحد - الخميس)</option>
                <option value="off">إيقاف التذكيرات</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="reminder-time">وقت التذكير</label>
              <input
                id="reminder-time"
                type="time"
                className="input"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                disabled={reminderFrequency === 'off'}
              />
            </div>
          </div>
        </section>

        <div className="form-actions settings-save-row">
          <button type="submit" className="btn btn-primary">
            حفظ التغييرات
          </button>
        </div>
      </form>
    </div>
  );
}

function ToggleRow({ label, hint, checked, onChange }) {
  return (
    <label className="settings-toggle-row">
      <span>
        <span className="settings-toggle-label">{label}</span>
        <span className="settings-toggle-hint">{hint}</span>
      </span>
      <span className={`switch ${checked ? 'is-on' : ''}`}>
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="switch-track">
          <span className="switch-thumb" />
        </span>
      </span>
    </label>
  );
}
