import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChild } from '../../context/ChildContext';
import { avatarOptions } from '../../data/mockData';
import Avatar from '../../components/ui/Avatar';
import './Onboarding.css';

export default function ChildCreation() {
  const navigate = useNavigate();
  const { child, updateChild } = useChild();
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    age: '6',
    gender: child.gender || 'ذكر',
    avatarId: child.avatarId || avatarOptions[0].id,
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'يرجى إدخال اسم الطفل';
    const age = Number(form.age);
    if (!age || age < 5 || age > 8) nextErrors.age = 'العمر يجب أن يكون بين 5 و8 سنوات';
    return nextErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    updateChild({
      name: form.name.trim(),
      nickname: form.nickname.trim() || form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
      avatarId: form.avatarId,
      dateJoined: new Date().toISOString().slice(0, 10),
    });
    navigate('/onboarding/disorder');
  }

  return (
    <div className="onboarding-screen">
      <div className="onboarding-card">
        <div className="onboarding-logo">شَدْوُ</div>
        <div className="onboarding-steps">
          <span className="onboarding-step-dot is-active" />
          <span className="onboarding-step-dot" />
        </div>
        <h1>بيانات الطفل</h1>
        <p className="onboarding-card-subtitle">أخبرينا قليلًا عن طفلك لنُخصّص له تجربة مناسبة.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="onboarding-row">
            <div className="field">
              <label htmlFor="name">اسم الطفل</label>
              <input
                id="name"
                name="name"
                type="text"
                className={`input ${errors.name ? 'has-error' : ''}`}
                placeholder="مثال: سلمان"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="field">
              <label htmlFor="nickname">الاسم المفضّل (اختياري)</label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                className="input"
                placeholder="مثال: سلومي"
                value={form.nickname}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="onboarding-row">
            <div className="field">
              <label htmlFor="age">العمر</label>
              <select id="age" name="age" className="input" value={form.age} onChange={handleChange}>
                {[5, 6, 7, 8].map((age) => (
                  <option key={age} value={age}>
                    {age} سنوات
                  </option>
                ))}
              </select>
              {errors.age && <span className="field-error">{errors.age}</span>}
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
            <label>اختاري صورة رمزية</label>
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

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              التالي
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
