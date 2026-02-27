import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import useI18n from '@/useI18n';
import useVault from '@/useVault';
import './landing.css';

export default function Landing() {
  const { t, LangSelector, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const { vault } = useVault();
  const hasSecrets = vault && vault.length > 0;

  function handleCta() {
    if (hasSecrets) navigate("/keys");
    else navigate("/scan")
  }

  return (
    <div className="landing container">
      <div className="topbar">
        <a target="_blank" href="https://github.com/jelohe/key0">github</a>
        <LangSelector lang={lang} setLang={setLang} />
      </div>
      <header>
        <h1>KEYØ</h1>
        <p className="tagline">{t('landing.subtitle')}</p>
      </header>

      <section className="block">
        <ul>
          <li>ZERØ SERVERS</li>
          <li>ZERØ TRACKING</li>
          <li>ZERØ FRICTION</li>
        </ul>
      </section>

      <section className="block">
        <h2>{t('landing.why')}</h2>
        <div className="stack">
          <p>{t('landing.why.first')}</p>
          <p>{t('landing.why.second')}</p>
          <p>{t('landing.why.third')}</p>
        </div>
      </section>

      <section className="block">
        <h2>{t("landing.limits")}</h2>
        <div className="stack">
          <p>{t("landing.limits.first")}</p>
          <p>{t("landing.limits.second")}</p>
          <p>{t("landing.limits.third")}</p>
        </div>
      </section>

      <section className="cta">
        <button data-testid="run-key0" onClick={handleCta}>
          {t("landing.cta")}
        </button>
      </section>

      <footer>
        <p>{t("landing.footer")}</p>
      </footer>
    </div> 
  );
}
