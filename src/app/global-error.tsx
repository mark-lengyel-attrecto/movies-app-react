'use client';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body
        style={{
          margin: 0,
          fontFamily: 'sans-serif',
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1.5rem',
          textAlign: 'center',
          padding: '1rem',
        }}
      >
        <p style={{ fontSize: '4rem', fontWeight: 'bold', color: '#e5e7eb', margin: 0 }}>500</p>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#6b7280', margin: 0 }}>
            An unexpected error occurred. Please try again.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={reset}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
          >
            Back to home
          </button>
        </div>
      </body>
    </html>
  );
}
