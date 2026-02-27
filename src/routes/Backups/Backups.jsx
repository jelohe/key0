import './backups.css';
import { useNavigate } from 'react-router';
import useVault from '@/useVault';
import useI18n from '@/useI18n';
import QRCode from 'react-qr-code';

function Backup({ secret }) {
  const { app, name, code } = secret;
  const uri = `otpauth://totp/${name}?issuer=${app}&secret=${code}`;

  return (
    <details className="key-item">
      <summary>
        <div><span>{app}</span><p>{name}</p></div>
      </summary>
      <hr />
      <div className="qr-wrapper">
        <QRCode value={uri} />
      </div>
      <p>{code}</p>
    </details>
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
        <LangSelector lang={lang} setLang={setLang} />
      </header>

      <div className="list">
        {vault.map(s => <Backup key={s.name + s.app} secret={s} />)}
      </div>

      <div className="go-back">
        <button onClick={() => navigate("/keys")}>{t("backups.back-button")}</button>
      </div>
    </div>
  );
}
