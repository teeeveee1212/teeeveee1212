const PLAYER_URL = 'https://tvplayer.webrats.media';

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flex:'0 0 auto'}}>
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  );
}

function App() {
  return (
    <>
      <Nav current="player" />

      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Web player</span>
          <h1 className="display" style={{marginTop: 16, fontSize: 'clamp(40px, 6vw, 72px)'}}>
            Stream in your browser. <em>No app required.</em>
          </h1>
          <p className="lede" style={{marginTop: 14}}>
            Sign in with your TeeeVEE credentials right here. Works on any device with a modern browser — laptop, phone, tablet, or smart TV.
          </p>
          <div style={{display:'flex', gap:10, marginTop: 24, flexWrap:'wrap'}}>
            <a href={PLAYER_URL} target="_blank" rel="noopener" className="btn btn-primary">
              Open full player <Arrow />
            </a>
            <a href="Installation.html" className="btn btn-ghost">Install on your device instead</a>
          </div>
        </div>
      </div>

      <section>
        <div className="container">
          <div style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '56.25%',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            background: '#0F1114',
            border: '1px solid var(--line)',
            boxShadow: '0 30px 60px -30px rgba(15,17,20,.3)',
          }}>
            <iframe
              src={PLAYER_URL}
              title="TeeeVEE Web Player"
              allowFullScreen
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
                border: 0,
              }}
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
            marginTop: 32,
          }}>
            {[
              { t: 'Any modern browser', d: 'Chrome, Safari, Firefox, Edge — all supported. No plugin install.' },
              { t: 'Sign in with Xtream Codes', d: 'Use the credentials from your welcome email. Same login as the mobile apps.' },
              { t: 'Full library + live TV', d: 'Every channel and VOD title available in the app is here too.' },
              { t: 'Full-screen supported', d: 'Click full-screen in the player. Works great on a casting laptop.' },
            ].map(x => (
              <div key={x.t} style={{
                padding: 22,
                background: '#fff',
                border: '1px solid var(--line)',
                borderRadius: 16,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: 'var(--accent-soft)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 12,
                }}><Check /></div>
                <div style={{fontSize: 15, fontWeight: 600, marginBottom: 6}}>{x.t}</div>
                <div style={{fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55}}>{x.d}</div>
              </div>
            ))}
          </div>

          {/* Troubleshooting block */}
          <div style={{
            marginTop: 56, padding: 32,
            background: 'var(--bg-alt)',
            border: '1px solid var(--line)',
            borderRadius: 22,
          }}>
            <span className="eyebrow">Not loading?</span>
            <div className="display" style={{fontSize: 28, marginTop: 10, marginBottom: 16}}>
              Quick fixes before you email us.
            </div>
            <ul style={{
              listStyle: 'none', padding: 0, margin: 0,
              display: 'grid', gap: 10,
              fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.55,
            }}>
              <li>• Disable any VPN — many IPTV endpoints block VPN traffic.</li>
              <li>• Try the <a href={PLAYER_URL} target="_blank" rel="noopener" style={{color:'var(--accent)', textDecoration:'underline'}}>standalone player</a> (opens in its own tab).</li>
              <li>• Third-party cookies must be allowed for tvplayer.webrats.media.</li>
              <li>• Still stuck? Email <a href="mailto:support@teeeveee.nl" style={{color:'var(--accent)', textDecoration:'underline'}}>support@teeeveee.nl</a> — we reply within an hour.</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
