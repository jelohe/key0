import './backups.css';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import useVault from '@/useVault';
import useI18n from '@/useI18n';
import ThemeToggle from '@/ThemeToggle';
import QRCode from 'react-qr-code';

function Backup({ secret }) {
  const { t } = useI18n();
  const { app, name, code } = secret;
  const uri = `otpauth://totp/${encodeURIComponent(name)}?issuer=${encodeURIComponent(app)}&secret=${encodeURIComponent(code)}`;
  const [stage, setStage] = useState('hidden');

  return (
    <div className="backup-item">
      <div className="backup-header">
        <div>
          <span className="backup-app">{app}</span>
          {name && <p className="backup-name">{name}</p>}
        </div>
        {stage === 'hidden' && (
          <button
            className="btn-outline"
            onClick={() => setStage('confirm')}
          >
            Show Secret
          </button>
        )}
        {stage === 'revealed' && (
          <button
            className="btn-outline"
            onClick={() => setStage('hidden')}
          >
            Hide Secret
          </button>
        )}
      </div>

      {stage === 'confirm' && (
        <div className="reveal-warning">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p>{t('backups.reveal-warning')}</p>
          <div className="reveal-actions">
            <button
              className="btn-secondary"
              onClick={() => setStage('hidden')}
            >
              {t('backups.reveal-cancel')}
            </button>
            <button
              className="btn-primary"
              onClick={() => setStage('revealed')}
            >
              {t('backups.reveal-proceed')}
            </button>
          </div>
        </div>
      )}

      {stage === 'revealed' && (
        <div className="backup-details">
          <div className="qr-wrapper">
            <QRCode value={uri} />
          </div>
          <div className="secret-display">
            <span className="secret-label">Secret</span>
            <code className="secret-value">{code}</code>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Backups() {
  const { t, LangSelector, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const { vault } = useVault();

  return (
    <div className="backups container">
      <header className="topbar">
        <h1>{t("backups.title")}</h1>
        <div className="topbar-right">
          <ThemeToggle />
          <LangSelector lang={lang} setLang={setLang} />
        </div>
      </header>

      <div className="backups-body">
        {vault.length === 0 && (
          <div className="backups-empty">
            <svg className="empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <line x1="12" y1="11" x2="12" y2="15" />
              <line x1="11" y1="13" x2="13" y2="13" />
            </svg>
            <p>{t('backups.empty')}</p>
            <button className="btn-primary" onClick={() => navigate("/scan")}>
              {t('codes.add-button')}
            </button>
          </div>
        )}

        {vault.length > 0 && (
          <div className="backups-list">
            {vault.map(s => <Backup key={s.name + '|' + s.app} secret={s} />)}
          </div>
        )}
      </div>

      {vault.length > 0 && (
        <div className="backups-actions">
          <button className="btn-secondary" onClick={() => navigate("/keys")}>
            {t("backups.back-button")}
          </button>
        </div>
      )}
    </div>
  );
}
