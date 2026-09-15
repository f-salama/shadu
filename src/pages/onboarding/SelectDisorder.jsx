import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChild } from '../../context/ChildContext';
import { soundOptions } from '../../data/mockData';
import { setOnboarded } from '../../utils/session';
import './Onboarding.css';

export default function SelectDisorder() {
  const navigate = useNavigate();
  const { child, updateChild } = useChild();
  const [selected, setSelected] = useState(child.targetSound || soundOptions[0].letter);

  function handleSubmit(e) {
    e.preventDefault();
    updateChild({ targetSound: selected });
    setOnboarded(true);
    navigate('/dashboard', { replace: true });
  }

  return (
    <div className="onboarding-screen">
      <div className="onboarding-card">
        <div className="onboarding-logo">شَدْوُ</div>
        <div className="onboarding-steps">
          <span className="onboarding-step-dot is-done" />
          <span className="onboarding-step-dot is-active" />
        </div>
        <h1>ما الصوت الذي يحتاج طفلك للتدرب عليه؟</h1>
        <p className="onboarding-card-subtitle">
          اختاري الوصف الأقرب لما تلاحظينه في نطق {child.nickname || 'طفلك'}. يمكن تعديل هذا لاحقًا من ملف الطفل.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="sound-options" role="radiogroup" aria-label="اختيار الصوت المستهدف">
            {soundOptions.map((option) => (
              <button
                type="button"
                key={option.id}
                className={`sound-option ${selected === option.letter ? 'is-selected' : ''}`}
                onClick={() => setSelected(option.letter)}
                role="radio"
                aria-checked={selected === option.letter}
              >
                <span className="sound-option-letter">{option.letter}</span>
                <span className="sound-option-body">
                  <span className="sound-option-title-row">
                    <h3>{option.name}</h3>
                    <span className={`badge ${option.priority === 'أساسي' ? 'badge-primary' : 'badge-neutral'}`}>
                      {option.priority}
                    </span>
                  </span>
                  <p className="sound-option-phrase">{option.parentPhrase}</p>
                </span>
                <span className="sound-option-radio" aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              إنهاء الإعداد والانتقال إلى اللوحة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
