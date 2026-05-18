import { useState, useRef } from 'react';
import { createDetector } from '../detector';
import useI18n from '@/useI18n';

export default function ManualUpload({ onScan }) {
  const { t } = useI18n();
  const inputRef = useRef(null);
  const [status, setStatus] = useState('idle');

  const [dragOver, setDragOver] = useState(false);

  async function processFile(file) {
    setStatus('loading');

    try {
      const detector = await createDetector();
      const result = await detector.detect(file);

      if (result && result.length > 0) {
        onScan(result);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) processFile(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragOver(false);
  }

  function handleZoneClick() {
    inputRef.current?.click();
  }

  return (
    <>
      {status === 'loading' && (
        <div className="scanner-state">
          <div className="spinner" />
          <span className="scanner-state-text">{t("scan.manual-loading")}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="scanner-state">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <span className="scanner-state-text">{t("scan.manual-error")}</span>
        </div>
      )}

      {status === 'idle' && (
        <div
          className={`manual-upload-zone${dragOver ? ' manual-upload-zone--drag-over' : ''}`}
          data-testid="manual-upload-zone"
          onClick={handleZoneClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span className="scanner-state-text">{t("scan.manual-prompt")}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        data-testid="manual-file-input"
        onChange={handleFile}
        hidden
      />
    </>
  );
}
