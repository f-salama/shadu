import { useEffect, useRef, useState } from 'react';
import { chatbotFallback, chatbotScript } from '../../data/mockData';
import './ChatbotWidget.css';

const GREETING = {
  id: 'greeting',
  from: 'bot',
  text: 'مرحبًا! أنا المساعد الذكي لتطبيق شَدْوُ. يمكنني الإجابة عن الأسئلة الشائعة حول التمارين والتقدم. اختاري سؤالًا أدناه أو اكتبي سؤالك.',
};

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [draft, setDraft] = useState('');
  const [askedIds, setAskedIds] = useState([]);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, open]);

  function pushMessage(msg) {
    setMessages((prev) => [...prev, msg]);
  }

  function handleQuickQuestion(item) {
    pushMessage({ id: `${item.id}-q-${Date.now()}`, from: 'parent', text: item.question });
    setAskedIds((prev) => [...prev, item.id]);
    setTimeout(() => {
      pushMessage({ id: `${item.id}-a-${Date.now()}`, from: 'bot', text: item.answer });
    }, 400);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    pushMessage({ id: `free-q-${Date.now()}`, from: 'parent', text });
    setDraft('');
    setTimeout(() => {
      pushMessage({ id: `free-a-${Date.now()}`, from: 'bot', text: chatbotFallback });
    }, 400);
  }

  const remainingQuestions = chatbotScript.filter((q) => !askedIds.includes(q.id));

  return (
    <>
      <button
        type="button"
        className="chatbot-fab"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'إغلاق المساعد الذكي' : 'فتح المساعد الذكي'}
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path
              d="M4 12a8 8 0 1 1 3.2 6.4L4 20l1.1-3.4A7.96 7.96 0 0 1 4 12Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {open && (
        <div className="chatbot-panel" role="dialog" aria-label="المساعد الذكي">
          <div className="chatbot-header">
            <div>
              <h3>المساعد الذكي</h3>
              <p>إجابات سريعة على الأسئلة الشائعة</p>
            </div>
          </div>

          <div className="chatbot-body" ref={bodyRef}>
            {messages.map((m) => (
              <div key={m.id} className={`chatbot-bubble chatbot-bubble-${m.from}`}>
                {m.text}
              </div>
            ))}
          </div>

          {remainingQuestions.length > 0 && (
            <div className="chatbot-quick-questions">
              {remainingQuestions.map((q) => (
                <button key={q.id} type="button" className="chatbot-chip" onClick={() => handleQuickQuestion(q)}>
                  {q.question}
                </button>
              ))}
            </div>
          )}

          <form className="chatbot-input-row" onSubmit={handleSubmit}>
            <input
              type="text"
              className="input"
              placeholder="اكتبي سؤالك هنا..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              aria-label="اكتبي سؤالك"
            />
            <button type="submit" className="btn btn-primary btn-sm">
              إرسال
            </button>
          </form>
        </div>
      )}
    </>
  );
}
