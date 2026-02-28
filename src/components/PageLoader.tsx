export default function PageLoader() {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <style>{`
        @keyframes page-loader-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50%       { opacity: 0.8; transform: scale(1.15); }
        }
      `}</style>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: '#22d3ee',
        animation: 'page-loader-pulse 1.2s ease-in-out infinite',
      }} />
    </div>
  );
}
