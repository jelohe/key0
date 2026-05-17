import { Component } from 'react';

export default class ErrorBoundary extends Component {
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
            Something went wrong
          </h1>
          <p style={{
            color: 'var(--fg-secondary)',
            margin: '0 0 32px',
            fontSize: '15px',
          }}>
            An unexpected error occurred. Your secrets are safe in local storage.
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
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
