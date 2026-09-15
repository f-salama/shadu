import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useChild } from '../../context/ChildContext';
import { parent } from '../../data/mockData';
import { logout } from '../../utils/session';
import Avatar from '../ui/Avatar';
import ChatbotWidget from '../chatbot/ChatbotWidget';
import { IconSvg } from './icons';
import './AppShell.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'لوحة التقدم', icon: 'dashboard' },
  { to: '/history', label: 'سجل الجلسات', icon: 'history' },
  { to: '/results', label: 'النتائج', icon: 'results' },
  { to: '/practice', label: 'التمارين المنزلية', icon: 'practice' },
  { to: '/profile', label: 'ملف الطفل', icon: 'profile' },
  { to: '/settings', label: 'الإعدادات', icon: 'settings' },
];

export default function AppShell() {
  const { child } = useChild();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <button
        type="button"
        className="app-shell-mobile-toggle"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="فتح القائمة"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      </button>

      <aside className={`app-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="app-sidebar-brand">
          <span className="app-sidebar-logo">شَدْوُ</span>
          <span className="app-sidebar-tagline">تطبيق الوالدين</span>
        </div>

        <div className="app-sidebar-child">
          <Avatar avatarId={child.avatarId} size={40} />
          <div>
            <div className="app-sidebar-child-name">{child.nickname || child.name}</div>
            <div className="app-sidebar-child-meta">
              {child.age} سنوات · صوت {child.targetSound}
            </div>
          </div>
        </div>

        <nav className="app-sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `app-sidebar-link ${isActive ? 'is-active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <IconSvg name={item.icon} size={19} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button type="button" className="app-sidebar-logout" onClick={handleLogout}>
          <IconSvg name="logout" size={18} />
          <span>تسجيل الخروج</span>
        </button>
      </aside>

      {menuOpen && <div className="app-shell-overlay" onClick={() => setMenuOpen(false)} />}

      <div className="app-shell-main">
        <header className="app-topbar">
          <div className="app-topbar-spacer" />
          <div className="app-topbar-account">
            <div className="app-topbar-account-text">
              <div className="app-topbar-account-name">{parent.name}</div>
              <div className="app-topbar-account-role">{parent.relation}</div>
            </div>
            <span className="app-topbar-avatar" aria-hidden="true">
              {parent.name.trim().charAt(0)}
            </span>
          </div>
        </header>

        <main className="app-content">
          <Outlet />
        </main>
      </div>

      <ChatbotWidget />
    </div>
  );
}
