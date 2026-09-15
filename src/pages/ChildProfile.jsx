import { useState } from 'react';
import { useChild } from '../context/ChildContext';
import { avatarOptions, soundOptions } from '../data/mockData';
import PageHeader from '../components/ui/PageHeader';
import Avatar from '../components/ui/Avatar';
import './ChildProfile.css';

const dateFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { day: 'numeric', month: 'long', year: 'numeric' });

export default function ChildProfile() {
  const { child, updateChild } = useChild();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(child);

  function startEditing() {
    setForm(child);
    setEditing(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'age' ? Number(value) : value }));
  }

  function handleSave(e) {
    e.preventDefault();
    updateChild(form);
    setEditing(false);
  }

  if (editing) {
    return (
      <div>
        <PageHeader title="تعديل ملف الطفل" subtitle="حدّثي بيانات طفلك عند الحاجة." />

        <form className="card card-pad profile-form" onSubmit={handleSave}>
          <div className="field">
            <label>الصورة الرمزية</label>
            <div className="avatar-picker">
              {avatarOptions.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  className={`avatar-picker-option ${form.avatarId === option.id ? 'is-selected' : ''}`}
                  onClick={() => setForm((prev) => ({ ...prev, avatarId: option.id }))}
                  aria-label={option.label}
                  aria-pressed={form.avatarId === option.id}
                >
                  <Avatar avatarId={option.id} size={52} />
                </button>
              ))}
            </div>
          </div>

          <div className="profile-form-row">
            <div className="field">
              <label htmlFor="name">اسم الطفل</label>
              <input id="name" name="name" className="input" value={form.name} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="nickname">الاسم المفضّل</label>
              <input id="nickname" name="nickname" className="input" value={form.nickname} onChange={handleChange} />
            </div>
          </div>

          <div className="profile-form-row">
            <div className="field">
              <label htmlFor="age">العمر</label>
              <select id="age" name="age" className="input" value={form.age} onChange={handleChange}>
                {[5, 6, 7, 8].map((age) => (
                  <option key={age} value={age}>
                    {age} سنوات
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="gender">الجنس</label>
              <select id="gender" name="gender" className="input" value={form.gender} onChange={handleChange}>
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>الصوت المستهدف</label>
            <div className="profile-sound-toggle">
              {soundOptions.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  className={form.targetSound === option.letter ? 'is-active' : ''}
                  onClick={() => setForm((prev) => ({ ...prev, targetSound: option.letter }))}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="therapistNotes">ملاحظات الأخصائية (اختياري)</label>
            <textarea
              id="therapistNotes"
              name="therapistNotes"
              className="input"
              rows={4}
              placeholder="لا توجد ملاحظات بعد"
              value={form.therapistNotes}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
              إلغاء
            </button>
            <button type="submit" className="btn btn-primary">
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>
    );
  }

  const soundInfo = soundOptions.find((s) => s.letter === child.targetSound);

  return (
    <div>
      <PageHeader
        title="ملف الطفل"
        subtitle="بيانات طفلك والصوت المستهدف في تمارين النطق."
        actions={
          <button type="button" className="btn btn-primary" onClick={startEditing}>
            تعديل البيانات
          </button>
        }
      />

      <section className="card card-pad profile-summary">
        <Avatar avatarId={child.avatarId} size={76} />
        <div>
          <h2>{child.name}</h2>
          <p className="profile-nickname">الاسم المفضّل: {child.nickname}</p>
          <div className="profile-summary-tags">
            <span className="badge badge-neutral">{child.age} سنوات</span>
            <span className="badge badge-neutral">{child.gender}</span>
            <span className="badge badge-primary">صوت {child.targetSound} المستهدف</span>
          </div>
        </div>
      </section>

      <div className="profile-details-grid">
        <section className="card card-pad">
          <h3>الصوت المستهدف حاليًا</h3>
          {soundInfo && (
            <>
              <p className="profile-detail-value">{soundInfo.name}</p>
              <p className="text-secondary">{soundInfo.parentPhrase}</p>
            </>
          )}
        </section>

        <section className="card card-pad">
          <h3>تاريخ الانضمام</h3>
          <p className="profile-detail-value">{dateFormatter.format(new Date(child.dateJoined))}</p>
          <p className="text-secondary">تاريخ إنشاء ملف الطفل في التطبيق</p>
        </section>
      </div>

      <section className="card card-pad">
        <h3>ملاحظات الأخصائية</h3>
        {child.therapistNotes ? (
          <p className="profile-notes">{child.therapistNotes}</p>
        ) : (
          <p className="text-muted">لا توجد ملاحظات مسجّلة من الأخصائية بعد.</p>
        )}
      </section>
    </div>
  );
}
