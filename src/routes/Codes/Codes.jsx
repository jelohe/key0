import './codes.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import useVault from '@/useVault';
import { TOTP } from 'totp-generator';

const REGENERATION_SECONDS = 30;
const REGENERATION_MILISECONDS = REGENERATION_SECONDS * 1000;

function Code({ secret }) {
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
            <button onClick={handleCopy}>Copy</button>
          }
          { !isDeleting &&
            <button data-testid="remove" onClick={handleDelete}>Delete</button>
          }
          { isDeleting &&
            <button onClick={handleBack}>Back</button>
          }
          { isDeleting &&
            <button
              className="red-text"
              data-testid="confirm-remove"
              onClick={handleConfirm}
            >Confirm</button>
          }
        </div>
      </div>
    </li>
  );
}

export default function Codes() {
  const navigate = useNavigate();
  const { vault } = useVault();

  return (
    <div className="codes container">
      <header>
        <h1>KEYS</h1>
      </header>

      <ul className="keys-list">
        {vault.map(s => <Code key={s.name + s.app} secret={s} />)}
      </ul>

      <div className="add-key">
        <button onClick={() => navigate("/backups")}>Backups</button>
        <button onClick={() => navigate("/scan")}>Add</button>
      </div>
    </div>
  );
}

function generateRawCode(secret) {
  const config = { encoding: 'ascii', period: REGENERATION_SECONDS };
  const { otp: code } = TOTP.generate(secret, config);
  return code;
}
