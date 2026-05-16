import './codes.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import useVault from '@/useVault';
import useI18n from '@/useI18n';
import ThemeToggle from '@/ThemeToggle';
import { TOTP } from 'totp-generator';

const REGENERATION_SECONDS = 30;
const REGENERATION_MILLISECONDS = REGENERATION_SECONDS * 1000;
const COPY_FEEDBACK_MS = 1500;

export default function Codes() {
  const { t, LangSelector, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const { vault } = useVault();

  return (
    <div className="codes container">
      <header className="topbar">
        <h1>{t("codes.title")}</h1>
        <div className="topbar-right">
          <ThemeToggle />
          <LangSelector lang={lang} setLang={setLang} />
        </div>
      </header>

      <div className="codes-body">
        {vault.length === 0 && (
          <div className="codes-empty">
            <svg className="empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
            <p>{t('codes.empty')}</p>
            <button className="btn-primary" onClick={() => navigate("/scan")}>
              {t('codes.add-button')}
            </button>
          </div>
        )}

        <ul className="keys-list">
          {vault.map(s => <Code key={s.name + '|' + s.app} secret={s} />)}
        </ul>
      </div>

      {vault.length > 0 && (
        <div className="add-key">
          <button className="btn-secondary" onClick={() => navigate("/backups")}>
            {t("codes.backups-button")}
          </button>
          <button className="btn-primary" onClick={() => navigate("/scan")}>
            {t("codes.add-button")}
          </button>
        </div>
      )}
    </div>
  );
}

function Code({ secret }) {
  const { t } = useI18n();
  const { app, name, code } = secret;
  const { remove } = useVault();
  const [tempKey, setTempKey] = useState(() => generateRawCode(code));
  const [stage, setStage] = useState('hidden');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(REGENERATION_SECONDS);
  const copyTimer = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTempKey(generateRawCode(code));
      setTimeLeft(REGENERATION_SECONDS);
    }, REGENERATION_MILLISECONDS);

    const countdown = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdown);
    };
  }, [code]);

  const handleConfirm = () => remove(secret);
  const handleDelete = () => setStage('confirm');
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(tempKey).catch(() => {});
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
  }, [tempKey]);
  const handleBack = () => setStage('hidden');

  return (
    <li className="key-item">
      <div className="key-item-body">
        <div className="key-item-left">
          <span className="key-app">{app}</span>
          {name && <p className="key-name">{name}</p>}
        </div>
        <div className="key-item-right">
          <code className="key-code" data-testid="key">{ tempKey }</code>
        </div>
      </div>
      <div className="countdown-bar">
        <div
          className="countdown-fill"
          style={{ width: `${(timeLeft / REGENERATION_SECONDS) * 100}%` }}
        />
      </div>
      <div className="key-actions">
        {stage === 'hidden' && (
          <>
            <button className="btn-outline" onClick={handleCopy}>
              {copied ? t('codes.copied') : t('codes.copy-button')}
            </button>
            <button
              className="btn-outline btn-danger-outline"
              data-testid="remove"
              onClick={handleDelete}
            >
              {t('codes.delete-button')}
            </button>
          </>
        )}
        {stage === 'confirm' && (
          <div className="delete-warning">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p>{t('codes.delete-warning')}</p>
            <div className="delete-actions">
              <button className="btn-secondary" onClick={handleBack}>
                {t('codes.back-button')}
              </button>
              <button
                className="btn-danger"
                data-testid="confirm-remove"
                onClick={handleConfirm}
              >
                {t('codes.confirm-button')}
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}

function generateRawCode(secret) {
  const config = { encoding: 'ascii', period: REGENERATION_SECONDS };
  const { otp: code } = TOTP.generate(secret, config);
  return code;
}
