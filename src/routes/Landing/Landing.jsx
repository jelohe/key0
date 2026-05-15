import { useNavigate } from 'react-router';
import useI18n from '@/useI18n';
import ThemeToggle from '@/ThemeToggle';
import './landing.css';
import '@/trust.css';

export default function Landing() {
  const { t, LangSelector, lang, setLang } = useI18n();
  const navigate = useNavigate();
  function handleCta() {
    navigate("/keys")
  }

  return (
    <div className="landing container">
      <div className="topbar">
        <div className="topbar-left">
          <a
            className="github-link"
            target="_blank"
            href="https://github.com/jelohe/key0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </div>
        <div className="topbar-right">
          <ThemeToggle />
          <LangSelector lang={lang} setLang={setLang} />
        </div>
      </div>
      <main>
        <h1>KEYØ</h1>
        <p className="tagline">{t('landing.tagline')}</p>
        <section className="cta">
          <button data-testid="run-key0" onClick={handleCta}>
            {t("landing.cta")}
          </button>
        </section>
        <div className="trust-badges">
          <span className="trust-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {t('footer.client-side')}
          </span>
          <span className="trust-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Open source
          </span>
          <span className="trust-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            {t('footer.privacy')}
          </span>
        </div>
      </main>
      <div className="page-footer">
        <p>
          KEYØ v1.0.0 &mdash;{' '}
          <a target="_blank" href="https://github.com/jelohe/key0">github.com/jelohe/key0</a>
        </p>
      </div>
    </div>
  );
}
