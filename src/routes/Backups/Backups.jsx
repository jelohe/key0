import './backups.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import useVault from '@/useVault';
import { TOTP } from 'totp-generator';
import QRCode from 'react-qr-code';

const REGENERATION_SECONDS = 30;
const REGENERATION_MILISECONDS = REGENERATION_SECONDS * 1000;

function Code({ secret }) {
  const { app, name, code } = secret;
  const uri = `otpauth://totp/${name}?issuer=${app}&secret=${code}`;

  return (
    <details className="key-item">
      <summary>
        <div><span>{app}</span><p>{name}</p></div>
      </summary>
      <div className="qr-wrapper">
        <QRCode value={uri} />
      </div>
      <p>{code}</p>
    </details>
  );
}

export default function Codes() {
  const navigate = useNavigate();
  const { vault } = useVault();

  return (
    <div className="backups container">
      <header>
        <h1>BACKUPS</h1>
      </header>

      <div className="list">
        {vault.map(s => <Code key={s.name + s.app} secret={s} />)}
      </div>

      <div className="go-back">
        <button onClick={() => navigate("/codes")}>Back</button>
      </div>
    </div>
  );
}

function generateRawCode(secret) {
  const config = { encoding: 'ascii', period: REGENERATION_SECONDS };
  const { otp: code } = TOTP.generate(secret, config);
  return code;
}
