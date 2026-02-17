import { useNavigate } from 'react-router';
import { useState } from 'react';
import useVault from '@/useVault';
import Scanner from './Scanner';
import { parseUris } from '@/parser';
import './scan.css';

export default function Scan() {
  const navigate = useNavigate();
  const { store, vault } = useVault();
  const [secret, setSecret] = useState(null);
  const hasSecrets = vault && vault.length > 0;

  const handleScan = uris => {
    const url = parseUris(uris)[0];
    const isValid = (
      url &&
      url.name &&
      url.app &&
      url.code
    )

    if (isValid) setSecret(url);
  };

  function handleReject() {
    setSecret(null);
  }

  function handleSave() {
    store(secret);
    setSecret(null);
    navigate("/codes");
  }

  function handleCancel() {
    if (hasSecrets) navigate("/codes");
    else navigate("/")
  }

  return (
    <div className="scan container">
      <header>
        <h1>SCANNER</h1>
      </header>
      <div className="scanner">
        {secret && <Found app={secret.app} name={secret.name} code={secret.code} />}
        {!secret && 
          <Scanner loading={Loading} error={Error} onScan={handleScan} />
        }
      </div>
      <div className="instructions">
        <p>Scan only QR codes you trust.</p>
      </div>
      {!secret && (
        <div className="actions">
          <button onClick={handleCancel}>Cancel</button>
          <button>Scan</button>
        </div>
      )}
      {secret && (
        <div className="actions">
          <button onClick={handleReject}>Reject</button>
          <button onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  );
}

function Loading() {
  return (<span>Accesing camera</span>);
}

function Error() {
  return (<span>Permission error</span>);
}

function Found({ app, name, code }) {
  return (
    <div className="detected-box">
      <h2>{app}</h2>
      <div className="detected-meta">
        <div>User: {name}</div>
        <div>Type: TOTP</div>
      </div>
      <div className="warning">Verify before saving</div>
    </div>
  );
}
