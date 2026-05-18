import './notfound.css';
import { useNavigate } from 'react-router';
import useI18n from '@/useI18n';

export default function NotFound() {
  const { t } = useI18n();
  const navigate = useNavigate();
  return (
    <div className="not-found container">
      <header>
        <h1>{t('not-found.code')}</h1>
        <p>{t('not-found.title')}</p>
      </header>

      <section className="cta">
        <button onClick={() => navigate("/")}>{t('not-found.cta')}</button>
      </section>
    </div>
  );
}
