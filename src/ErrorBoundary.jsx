import { Component } from 'react';
import useI18n from '@/useI18n';

class ErrorBoundaryInner extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    const { t } = this.props;
    if (this.state.error) {
      return (
        <div style={{
          maxWidth: '480px',
          margin: '64px auto',
          padding: '32px 24px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '800',
            margin: '0 0 12px',
            color: 'var(--danger)',
          }}>
            {t('error.title')}
          </h1>
          <p style={{
            color: 'var(--fg-secondary)',
            margin: '0 0 32px',
            fontSize: '15px',
          }}>
            {t('error.message')}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: '600',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
            }}
          >
            {t('error.reload')}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ErrorBoundary({ children }) {
  const { t } = useI18n();
  return <ErrorBoundaryInner t={t}>{children}</ErrorBoundaryInner>;
}
