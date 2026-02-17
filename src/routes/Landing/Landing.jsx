import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import useVault from '@/useVault';
import './landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const { vault } = useVault();
  const hasSecrets = vault && vault.length > 0;

  function handleCta() {
    if (hasSecrets) navigate("/keys");
    else navigate("/scan")
  }

  return (
    <div className="landing container">
      <header>
        <h1>KEYØ</h1>
        <p className="tagline">Two factor authenticator. Minimal by force.</p>
      </header>

      <section className="block">
        <ul>
          <li>ZERO SERVERS</li>
          <li>ZERO TRACKING</li>
          <li>ZERØ FRICTION</li>
        </ul>
      </section>

      <section className="block">
        <h2>Why</h2>
        <div className="stack">
          <p>Others track. Others sync. Others profit.</p>
          <p>KEYØ refuses all of that.</p>
          <p>Free. No ads. Nothing leaves your device.</p>
        </div>
      </section>

      <section className="block">
        <h2>Limits</h2>
        <div className="stack">
          <p>No cross-device syncing. Intentionally.</p>
          <p>Back up your QRs or suffer the consequences.</p>
          <p>Keep your device safe.</p>
        </div>
      </section>

      <section className="cta">
        <button data-testid="run-key0" onClick={handleCta}>Run KEYØ</button>
      </section>

      <footer>
        <p>Security is not a product. It's a right.</p>
      </footer>
    </div> 
  );
}
