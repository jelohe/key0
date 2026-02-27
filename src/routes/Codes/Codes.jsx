import './codes.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import useVault from '@/useVault';
import useI18n from '@/useI18n';
import { TOTP } from 'totp-generator';

const REGENERATION_SECONDS = 30;
const REGENERATION_MILISECONDS = REGENERATION_SECONDS * 1000;

export default function Codes() {
  const { t, LangSelector, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const { vault } = useVault();

  return (
    <div className="codes container">
      <header className="topbar">
        <h1>{t("codes.title")}</h1>
        <LangSelector lang={lang} setLang={setLang} />
      </header>

      <ul className="keys-list">
        {vault.map(s => <Code key={s.name + s.app} secret={s} />)}
      </ul>

      <div className="add-key">
        <button onClick={() => navigate("/backups")}>
          {t("codes.backups-button")}
        </button>
        <button onClick={() => navigate("/scan")}>
          {t("codes.add-button")}
        </button>
      </div>
    </div>
  );
}

function Code({ secret }) {
  const { t } = useI18n();
  const { app, name, code } = secret;
  const { remove } = useVault();
  const [tempKey, setTempKey] = useState(() => generateRawCode(code));
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTempKey(generateRawCode(code));
    }, REGENERATION_MILISECONDS);

    return () => clearInterval(interval);
  }, [code]);

  const handleConfirm = () => remove(secret);
  const handleDelete = () => setIsDeleting(true);
  const handleCopy = () => navigator.clipboard.writeText(tempKey);
  const handleBack = () => setIsDeleting(false);

  return (
    <li className="key-item">
      <div className="name">
        <span>{app}</span>
        <p>{name}</p>
      </div>
      <div className="actions">
        <code data-testid="key">{ tempKey }</code>
        <div>
          { !isDeleting &&
            <button onClick={handleCopy}>
              {t('codes.copy-button')}
            </button>
          }
          { !isDeleting &&
            <button data-testid="remove" onClick={handleDelete}>
              {t('codes.delete-button')}
            </button>
          }
          { isDeleting &&
            <button onClick={handleBack}>
              {t('codes.back-button')}
            </button>
          }
          { isDeleting &&
            <button
              className="red-text"
              data-testid="confirm-remove"
              onClick={handleConfirm}
            >
              {t('codes.confirm-button')}
            </button>
          }
        </div>
      </div>
    </li>
  );
}

function generateRawCode(secret) {
  const config = { encoding: 'ascii', period: REGENERATION_SECONDS };
  const { otp: code } = TOTP.generate(secret, config);
  return code;
}
