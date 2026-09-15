import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setAuthed, setOnboarded } from '../../utils/session';
import './Auth.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.identifier.trim()) {
      nextErrors.identifier = 'يرجى إدخال البريد الإلكتروني أو رقم الجوال';
    } else if (form.identifier.includes('@') && !EMAIL_RE.test(form.identifier)) {
      nextErrors.identifier = 'صيغة البريد الإلكتروني غير صحيحة';
    }
    if (!form.password) {
      nextErrors.password = 'يرجى إدخال كلمة المرور';
    } else if (form.password.length < 6) {
      nextErrors.password = 'كلمة المرور يجب ألا تقل عن 6 أحرف';
    }
    return nextErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Demo only: no real authentication happens here.
    setAuthed(true);
    setOnboarded(true);
    navigate('/dashboard', { replace: true });
  }

  return (
    <div className="auth-screen">
      <section className="auth-panel-brand">
        <div className="auth-brand-logo">شَدْوُ</div>
        <h1 className="auth-brand-heading">متابعة رحلة طفلك في تحسين النطق، خطوة بخطوة</h1>
        <p className="auth-brand-copy">
          منصة شَدْوُ تساعدك على متابعة تقدّم طفلك في جلسات علاج النطق، ومتابعة تمارين اللغة المنزلية بينك وبين
          الأخصائية.
        </p>
        <ul className="auth-brand-list">
          <li>
            <span className="auth-brand-list-icon">١</span>
            متابعة نسبة الدقة والتقدم أولًا بأول
          </li>
          <li>
            <span className="auth-brand-list-icon">٢</span>
            تمارين منزلية موجّهة مبنية على حالة طفلك
          </li>
          <li>
            <span className="auth-brand-list-icon">٣</span>
            تقارير جاهزة للمشاركة مع أخصائية النطق
          </li>
        </ul>
      </section>

      <section className="auth-panel-form">
        <div className="auth-card">
          <div className="auth-card-mobile-logo">شَدْوُ</div>
          <h1>تسجيل الدخول</h1>
          <p className="auth-card-subtitle">أهلًا بعودتك! سجّلي الدخول لمتابعة تقدّم طفلك.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="identifier">البريد الإلكتروني أو رقم الجوال</label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                className={`input ${errors.identifier ? 'has-error' : ''}`}
                placeholder="example@email.com"
                value={form.identifier}
                onChange={handleChange}
                autoComplete="username"
              />
              {errors.identifier && <span className="field-error">{errors.identifier}</span>}
            </div>

            <div className="field">
              <label htmlFor="password">كلمة المرور</label>
              <input
                id="password"
                name="password"
                type="password"
                className={`input ${errors.password ? 'has-error' : ''}`}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              تسجيل الدخول
            </button>
          </form>

          <p className="auth-divider">
            ليس لديك حساب؟ <Link to="/register">إنشاء حساب جديد</Link>
          </p>
          <p className="auth-footnote">هذا نموذج أولي للعرض فقط — لا حاجة لبيانات حقيقية.</p>
        </div>
      </section>
    </div>
  );
}
