import { useNavigate } from 'react-router';
import { useState } from 'react';
import useVault from '@/useVault';
import useI18n from '@/useI18n';
import Scanner from './Scanner';
import { parse, validate } from '@/parser';
import './scan.css';

export default function Scan() {
  const { t, LangSelector, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const { store, vault } = useVault();
  const [secret, setSecret] = useState();
  const hasSecrets = vault && vault.length > 0;

  const handleScan = uris => {
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
    if (hasSecrets) navigate("/keys");
    else navigate("/")
  }

  return (
    <div className="scan container">
      <header className="topbar">
        <h1>{t("scan.title")}</h1>
        <LangSelector lang={lang} setLang={setLang} />
      </header>
      <div className="scanner">
        {secret && <Found app={secret.app} name={secret.name} code={secret.code} />}
        {!secret && 
          <Scanner Loading={Loading} Error={Error} onScan={handleScan} />
        }
      </div>
      <div className="instructions">
        <p>{t("scan.instructions")}</p>
      </div>
      {!secret && (
        <div className="actions">
          <button onClick={handleCancel}>{t('scan.cancel-button')}</button>
          <button>{t("scan.scan-button")}</button>
        </div>
      )}
      {secret && (
        <div className="actions">
          <button onClick={handleReject}>{t("scan.reject-button")}</button>
          <button data-testid="save-secret" onClick={handleSave}>{t("scan.save-button")}</button>
        </div>
      )}
    </div>
  );
}

function Loading() {
  const { t } = useI18n();
  return (<span>{t("scan.loading")}</span>);
}

function Error() {
  const { t } = useI18n();
  return (<span>{t("scan.error")}</span>);
}

function Found({ app, name, code }) {
  const { t } = useI18n();
  return (
    <div className="detected-box">
      <h2>{app}</h2>
      <div className="detected-meta">
        <div>{t("scan.user")} {name}</div>
        <div>{t("scan.type")} TOTP</div>
      </div>
      <div className="warning">{t("scan.warning")}</div>
    </div>
  );
}
