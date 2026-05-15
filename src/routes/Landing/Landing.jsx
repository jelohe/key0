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
      <main>
        <h1>KEYØ</h1>
        <p className="tagline">{t('landing.tagline')}</p>
        <section className="cta">
          <button data-testid="run-key0" onClick={handleCta}>
            {t("landing.cta")}
          </button>
        </section>
      </main>
    </div>
  );
}
