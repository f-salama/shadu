import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setAuthed, setOnboarded } from '../../utils/session';
import './Auth.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'يرجى إدخال الاسم الكامل';
    if (!form.email.trim()) {
      nextErrors.email = 'يرجى إدخال البريد الإلكتروني';
    } else if (!EMAIL_RE.test(form.email)) {
      nextErrors.email = 'صيغة البريد الإلكتروني غير صحيحة';
    }
    if (!form.phone.trim()) {
      nextErrors.phone = 'يرجى إدخال رقم الجوال';
    } else if (!/^\d{9,10}$/.test(form.phone.replace(/^0/, ''))) {
      nextErrors.phone = 'يرجى إدخال رقم جوال صحيح';
    }
    if (!form.password) {
      nextErrors.password = 'يرجى إدخال كلمة المرور';
    } else if (form.password.length < 6) {
      nextErrors.password = 'كلمة المرور يجب ألا تقل عن 6 أحرف';
    }
    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'كلمتا المرور غير متطابقتين';
    }
    return nextErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Demo only: no real account is created here.
    setAuthed(true);
    setOnboarded(false);
    navigate('/onboarding/child', { replace: true });
  }

  return (
    <div className="auth-screen">
      <section className="auth-panel-brand">
        <div className="auth-brand-logo">شَدْوُ</div>
        <h1 className="auth-brand-heading">ابدئي رحلة طفلك مع شَدْوُ في دقائق</h1>
        <p className="auth-brand-copy">
          أنشئي حسابك، ثم أضيفي ملف طفلك وحدّدي الصوت الذي يحتاج إلى تدريب عليه لنبدأ بمساعدته فورًا.
        </p>
        <ul className="auth-brand-list">
          <li>
            <span className="auth-brand-list-icon">١</span>
            إنشاء الحساب
          </li>
          <li>
            <span className="auth-brand-list-icon">٢</span>
            إضافة ملف الطفل
          </li>
          <li>
            <span className="auth-brand-list-icon">٣</span>
            تحديد الصوت المستهدف للتدريب
          </li>
        </ul>
      </section>

      <section className="auth-panel-form">
        <div className="auth-card">
          <div className="auth-card-mobile-logo">شَدْوُ</div>
          <h1>إنشاء حساب جديد</h1>
          <p className="auth-card-subtitle">أنشئي حسابًا لمتابعة تقدّم طفلك في تمارين النطق.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">الاسم الكامل</label>
              <input
                id="name"
                name="name"
                type="text"
                className={`input ${errors.name ? 'has-error' : ''}`}
                placeholder="مثال: أروى الحربي"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="field">
              <label htmlFor="email">البريد الإلكتروني</label>
              <input
                id="email"
                name="email"
                type="email"
                className={`input ${errors.email ? 'has-error' : ''}`}
                placeholder="example@email.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="field">
              <label htmlFor="phone">رقم الجوال</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={`input ${errors.phone ? 'has-error' : ''}`}
                placeholder="05xxxxxxxx"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
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
                autoComplete="new-password"
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className={`input ${errors.confirmPassword ? 'has-error' : ''}`}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              إنشاء الحساب
            </button>
          </form>

          <p className="auth-divider">
            لديك حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link>
          </p>
          <p className="auth-footnote">هذا نموذج أولي للعرض فقط — لا حاجة لبيانات حقيقية.</p>
        </div>
      </section>
    </div>
  );
}
