import { useNavigate } from 'react-router';
import { useState } from 'react';
import useVault from '@/useVault';
import useI18n from '@/useI18n';
import ThemeToggle from '@/ThemeToggle';
import Scanner from './Scanner';
import ManualUpload from './ManualUpload';
import { parse, validate } from '@/parser';
import './scan.css';

export default function Scan() {
  const { t, LangSelector, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const { store } = useVault();
  const [secret, setSecret] = useState();
  const [scannerKey, setScannerKey] = useState(0);
  const [mode, setMode] = useState('camera');

  function handleToggleMode() {
    if (mode === 'camera') {
      setMode('manual');
    } else {
      setScannerKey(k => k + 1);
      setMode('camera');
    }
  }

  const handleScan = uris => {
    if (!uris || uris.length === 0) return;
    const secretFound = parse(uris[0]);
    if (validate(secretFound))
      setSecret(secretFound);
  };

  function handleReject() {
    setSecret(null);
  }

  function handleSave() {
    store(secret);
    setSecret(null);
    navigate("/keys");
  }

  function handleCancel() {
    navigate("/keys")
  }

  return (
    <div className="scan container">
      <header className="topbar">
        <h1>{t("scan.title")}</h1>
        <div className="topbar-right">
          <ThemeToggle />
          <LangSelector lang={lang} setLang={setLang} />
        </div>
      </header>

      <div className="scan-body">
        <div className="scanner-frame">
          {secret && <Found app={secret.app} name={secret.name} />}
          {!secret && mode === 'camera' &&
            <Scanner key={scannerKey} Loading={Loading} Error={Error} onScan={handleScan} />
          }
          {!secret && mode === 'manual' &&
            <ManualUpload onScan={handleScan} />
          }
        </div>

        {!secret && (
          <div className="scan-info">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>{t("scan.instructions")}</span>
          </div>
        )}

        {secret && (
          <div className="warning-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>{t("scan.warning")}</span>
          </div>
        )}
      </div>

      <div className="actions" style={{ marginTop: 'auto' }}>
        {!secret && (
          <>
            <button className="btn-secondary" onClick={handleCancel}>
              {t('scan.cancel-button')}
            </button>
            {mode === 'manual' ? (
              <button className="btn-primary" onClick={handleToggleMode}>
                {t("scan.camera-button")}
              </button>
            ) : (
              <button className="btn-primary" onClick={handleToggleMode}>
                {t("scan.scan-button")}
              </button>
            )}
          </>
        )}
        {secret && (
          <>
            <button className="btn-secondary" onClick={handleReject}>
              {t("scan.reject-button")}
            </button>
            <button className="btn-primary" data-testid="save-secret" onClick={handleSave}>
              {t("scan.save-button")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Loading() {
  const { t } = useI18n();
  return (
    <div className="scanner-state">
      <div className="spinner" />
      <span className="scanner-state-text">{t("scan.loading")}</span>
    </div>
  );
}

function Error() {
  const { t } = useI18n();
  return (
    <div className="scanner-state scanner-error">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
      <span className="scanner-state-text">{t("scan.error")}</span>
    </div>
  );
}

function Found({ app, name }) {
  const { t } = useI18n();
  return (
    <div className="detected-box">
      <div className="detected-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <h2>{app}</h2>
      </div>
      <div className="detected-meta">
        <div className="detected-row">
          <span className="detected-label">{t("scan.user")}</span>
          <span className="detected-value">{name}</span>
        </div>
        <div className="detected-row">
          <span className="detected-label">{t("scan.type")}</span>
          <span className="detected-value">TOTP</span>
        </div>
      </div>
    </div>
  );
}
