const { useState: useStateI } = React;

const DEVICES = [
  {
    id: 'firestick',
    name: 'Fire TV / Fire Stick',
    icon: '',
    player: 'IPTV Smarters Pro',
    time: '4 min',
    popular: true,
    steps: [
      { t: 'Enable apps from unknown sources',
        d: 'Settings → My Fire TV → Developer Options → Turn ON “Apps from Unknown Sources”.' },
      { t: 'Install Downloader',
        d: 'From the Fire TV home screen, search for Downloader and install it.' },
      { t: 'Install IPTV Smarters Pro',
        d: 'Open Downloader and enter: www.iptvsmarters.com — download and install the APK.' },
      { t: 'Add your TeeeVEE playlist',
        d: 'Open Smarters → “Login with Xtream Codes API” → paste the URL, username and password from your welcome email.' },
      { t: 'Done — start watching',
        d: 'Channels and EPG will populate within 30–60 seconds. First launch may take a little longer.' },
    ],
  },
  {
    id: 'androidtv',
    name: 'Android TV / Google TV',
    icon: '',
    player: 'TiviMate',
    time: '3 min',
    steps: [
      { t: 'Install TiviMate',
        d: 'Open Play Store on your TV and search “TiviMate IPTV Player”. Install it.' },
      { t: 'Add a playlist',
        d: 'Open TiviMate → Add Playlist → Enter URL → paste the M3U link from your TeeeVEE welcome email.' },
      { t: 'Wait for EPG',
        d: 'TiviMate will fetch the channel list and program guide. This usually takes under a minute.' },
    ],
  },
  {
    id: 'ios',
    name: 'iPhone / iPad',
    icon: '',
    player: 'IPTV Smarters Pro',
    time: '2 min',
    steps: [
      { t: 'Install from App Store',
        d: 'Open the App Store and install “IPTV Smarters Pro” (free).' },
      { t: 'Login with Xtream Codes',
        d: 'Tap “Login with Xtream Codes API” and paste the server URL, username and password from your welcome email.' },
      { t: 'You’re in',
        d: 'Channels, movies and series appear in separate tabs. Hold a channel to favourite it.' },
    ],
  },
  {
    id: 'android',
    name: 'Android phone / tablet',
    icon: '',
    player: 'IPTV Smarters Pro',
    time: '2 min',
    steps: [
      { t: 'Install from Play Store',
        d: 'Search for “IPTV Smarters Pro” and install.' },
      { t: 'Add your subscription',
        d: 'Choose “Login with Xtream Codes API” and paste your credentials.' },
      { t: 'Optional: enable external player',
        d: 'For 4K content, set MX Player or VLC as the external player in Settings.' },
    ],
  },
  {
    id: 'samsung',
    name: 'Samsung Smart TV',
    icon: '',
    player: 'Smart IPTV',
    time: '6 min',
    steps: [
      { t: 'Install Smart IPTV',
        d: 'From the TV app store, search for “Smart IPTV” or “SIPTV” and install. If not available, use the MAC-based activation method below.' },
      { t: 'Find your MAC address',
        d: 'Open Smart IPTV on the TV — the MAC address appears on screen (format 00:1A:79:…).' },
      { t: 'Upload your playlist',
        d: 'On a computer, visit siptv.app → enter the MAC address → upload the M3U file from your welcome email → pay the one-time €5.49 activation.' },
      { t: 'Reload the app',
        d: 'Close and reopen Smart IPTV on your TV. Channels appear automatically.' },
    ],
  },
  {
    id: 'lg',
    name: 'LG Smart TV (webOS)',
    icon: '',
    player: 'Smart IPTV / SS IPTV',
    time: '6 min',
    steps: [
      { t: 'Install a player',
        d: 'From the LG Content Store, install “Smart IPTV” or “SS IPTV”.' },
      { t: 'Grab the MAC address',
        d: 'Open the app and note the MAC address shown on the welcome screen.' },
      { t: 'Upload your M3U',
        d: 'Go to siptv.app (or the SS IPTV portal) on your computer and upload the playlist from your welcome email.' },
      { t: 'Restart the app',
        d: 'Relaunch on the TV. Your channels will load.' },
    ],
  },
  {
    id: 'mag',
    name: 'MAG Box / STB',
    icon: '',
    player: 'Built-in portal',
    time: '3 min',
    steps: [
      { t: 'Open the portal settings',
        d: 'On your MAG box: Settings → System settings → Servers → Portals.' },
      { t: 'Enter the portal URL',
        d: 'Paste the MAG/Stalker portal URL from your TeeeVEE welcome email into Portal 1.' },
      { t: 'Send your MAC address',
        d: 'Reply to your welcome email with the MAC printed on the back of the box so we can whitelist it.' },
      { t: 'Reboot the box',
        d: 'Restart the MAG. It will reload the portal and your channels will appear.' },
    ],
  },
  {
    id: 'computer',
    name: 'Windows / Mac / Linux',
    icon: '',
    player: 'VLC or IPTV Smarters',
    time: '2 min',
    steps: [
      { t: 'Install a player',
        d: 'VLC (free, videolan.org) or IPTV Smarters for desktop.' },
      { t: 'Open your playlist',
        d: 'VLC: Media → Open Network Stream → paste the M3U URL. Smarters: Login with Xtream Codes.' },
      { t: 'Stream',
        d: 'Press play. For best quality enable hardware acceleration in VLC preferences.' },
    ],
  },
];

function PreReq() {
  return (
    <div style={{
      background:'#fff', border:'1px solid var(--line)', borderRadius: 22,
      padding: 32, marginBottom: 56,
    }}>
      <span className="eyebrow">Before you start</span>
      <h2 className="display" style={{fontSize: 30, marginTop: 14, marginBottom: 18}}>Three things you’ll need.</h2>
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap: 20,
      }}>
        {[
          { n: '01', t: 'Your welcome email', d: 'Sent within 5 minutes of ordering. Contains your M3U URL, Xtream credentials, and portal URL.' },
          { n: '02', t: 'A stable internet line', d: '10 Mbps for HD, 25 Mbps for 4K. Wired is always better than Wi-Fi.' },
          { n: '03', t: 'Your device + a compatible player', d: 'Not sure which one? See the Players page for a full list.' },
        ].map(x => (
          <div key={x.n} style={{display:'flex', gap: 14, alignItems:'flex-start'}}>
            <div style={{
              fontFamily:'JetBrains Mono, monospace', fontSize: 11,
              color:'var(--accent)', letterSpacing:'.1em', paddingTop: 3,
            }}>{x.n}</div>
            <div>
              <div style={{fontWeight: 600, fontSize: 15, marginBottom: 4}}>{x.t}</div>
              <div style={{fontSize: 13, color:'var(--ink-soft)', lineHeight: 1.55}}>{x.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeviceCard({ d, open, onToggle }) {
  return (
    <div style={{
      background:'#fff', border:`1px solid ${open ? 'var(--ink)' : 'var(--line)'}`,
      borderRadius: 22, overflow:'hidden',
      transition:'border-color .2s, box-shadow .2s',
      boxShadow: open ? 'var(--shadow-md)' : 'none',
    }}>
      <button onClick={onToggle} style={{
        width:'100%', display:'grid',
        gridTemplateColumns: '52px 1fr auto auto', gap: 20,
        alignItems:'center', padding: '22px 26px', textAlign:'left',
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          background:'var(--accent-soft)', color:'var(--accent)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize: 24,
        }}>{d.icon || d.name.split(' ').map(w => w[0]).join('').slice(0,2)}</div>
        <div>
          <div style={{display:'flex', alignItems:'center', gap:10, marginBottom: 2}}>
            <div style={{fontSize: 18, fontWeight: 600}}>{d.name}</div>
            {d.popular && (
              <span style={{
                fontFamily:'JetBrains Mono, monospace', fontSize: 9,
                padding:'3px 8px', borderRadius: 999,
                background:'var(--accent)', color:'#fff',
                letterSpacing:'.1em', textTransform:'uppercase',
              }}>Most used</span>
            )}
          </div>
          <div style={{fontSize: 13, color:'var(--ink-mute)'}}>
            Recommended player: <span style={{color:'var(--ink-soft)'}}>{d.player}</span>
          </div>
        </div>
        <div className="mono" style={{
          fontSize: 11, color:'var(--ink-mute)', letterSpacing:'.1em',
          textTransform:'uppercase',
        }}>~{d.time}</div>
        <div style={{
          width: 36, height: 36, borderRadius:'50%',
          border:'1px solid var(--line)',
          display:'flex', alignItems:'center', justifyContent:'center',
          transition:'transform .2s, background .2s',
          transform: open ? 'rotate(45deg)' : 'none',
          background: open ? 'var(--ink)' : 'transparent',
          color: open ? '#fff' : 'var(--ink)',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </div>
      </button>
      {open && (
        <div style={{borderTop:'1px solid var(--line)', padding:'8px 26px 30px'}}>
          <ol style={{listStyle:'none', padding:0, margin:0}}>
            {d.steps.map((s, i) => (
              <li key={i} style={{
                display:'grid', gridTemplateColumns:'44px 1fr', gap: 18,
                padding: '18px 0',
                borderBottom: i < d.steps.length - 1 ? '1px dashed var(--line)' : 'none',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius:'50%',
                  background:'var(--bg-alt)', color:'var(--ink)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'Instrument Serif, serif', fontSize: 20, fontWeight: 400,
                }}>{i + 1}</div>
                <div>
                  <div style={{fontWeight: 600, fontSize: 15, marginBottom: 4}}>{s.t}</div>
                  <div style={{fontSize: 14, color:'var(--ink-soft)', lineHeight: 1.6}}>{s.d}</div>
                </div>
              </li>
            ))}
          </ol>
          <div style={{display:'flex', gap: 10, marginTop: 18, flexWrap:'wrap'}}>
            <a href={`mailto:support@teeeveee.nl?subject=${encodeURIComponent('Help installing on ' + d.name)}`} className="btn btn-ghost btn-sm">Stuck? Email support</a>
            <a href="setup.html" className="btn btn-ghost btn-sm">See all players</a>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [openId, setOpenId] = useStateI('firestick');

  return (
    <>
      <Nav current="install" />

      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Installation guide</span>
          <h1 className="display" style={{marginTop: 16, fontSize:'clamp(40px, 6vw, 72px)'}}>
            Up and running in <em>under 5 minutes.</em>
          </h1>
          <p className="lede" style={{marginTop: 14}}>
            Pick your device below. Each guide is the shortest possible path from your welcome email to your first channel. Keep that email open — you’ll need the links in it.
          </p>
          <div style={{display:'flex', gap:10, marginTop: 24, flexWrap:'wrap'}}>
            <a href="#devices" className="btn btn-primary">Find my device <Arrow /></a>
            <a href="mailto:support@teeeveee.nl" className="btn btn-ghost">Talk to a human</a>
          </div>
        </div>
      </div>

      <section id="devices">
        <div className="container">
          <PreReq />

          <div style={{
            display:'flex', alignItems:'baseline', justifyContent:'space-between',
            marginBottom: 20, flexWrap:'wrap', gap: 10,
          }}>
            <div>
              <span className="eyebrow">Step-by-step</span>
              <h2 className="display" style={{fontSize: 36, marginTop: 10}}>Pick your device.</h2>
            </div>
            <div className="mono" style={{fontSize: 12, color:'var(--ink-mute)'}}>
              {DEVICES.length} guides · click to expand
            </div>
          </div>

          <div style={{display:'flex', flexDirection:'column', gap: 14}}>
            {DEVICES.map(d => (
              <DeviceCard
                key={d.id}
                d={d}
                open={openId === d.id}
                onToggle={() => setOpenId(openId === d.id ? null : d.id)}
              />
            ))}
          </div>

          {/* Troubleshooting */}
          <div style={{marginTop: 72}}>
            <span className="eyebrow">Troubleshooting</span>
            <h2 className="display" style={{fontSize: 36, marginTop: 10, marginBottom: 28}}>
              If something isn’t working.
            </h2>
            <div style={{
              display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 14,
            }}>
              {[
                { q: 'Channels load but buffer constantly.',
                  a: 'Switch to wired ethernet, or move closer to your router. If on Wi-Fi, prefer 5 GHz. A VPN, if enabled, will usually halve your speed — try without it.' },
                { q: 'Login failed / credentials rejected.',
                  a: 'Copy-paste directly from the welcome email — a single trailing space breaks it. If you reset your password recently, use the most recent email.' },
                { q: 'EPG (guide) is blank.',
                  a: 'The EPG loads in the background and can take 1–3 minutes on first launch. In TiviMate and Smarters, pull-to-refresh in the guide view.' },
                { q: 'Some channels missing.',
                  a: 'Most players let you hide/show channel groups. Check Settings → Channel groups to make sure the group is enabled.' },
                { q: 'MAG box won’t connect.',
                  a: 'We need to whitelist your MAC address. Email it to support@teeeveee.nl and we\'ll activate you within an hour during business hours.' },
                { q: 'Something else entirely.',
                  a: 'Email support@teeeveee.nl with your order number and a short description. We reply within a few hours, 7 days a week.' },
              ].map((x, i) => (
                <div key={i} style={{
                  background:'#fff', border:'1px solid var(--line)',
                  borderRadius: 18, padding: '22px 24px',
                }}>
                  <div style={{fontWeight: 600, fontSize: 15, marginBottom: 8}}>{x.q}</div>
                  <div style={{fontSize: 13, color:'var(--ink-soft)', lineHeight: 1.6}}>{x.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div style={{
            marginTop: 72, padding: 40,
            border: '1px solid var(--line)', borderRadius: 22,
            background:'var(--bg-alt)',
            display:'flex', gap:24, alignItems:'center', justifyContent:'space-between', flexWrap:'wrap',
          }}>
            <div>
              <div className="eyebrow">Still not sure?</div>
              <div className="display" style={{fontSize: 32, marginTop: 10}}>
                We’ll set it up with you, on a call.
              </div>
              <div style={{fontSize:14, color:'var(--ink-soft)', marginTop: 8, maxWidth:'52ch'}}>
                Free, 15 minutes, no sales pitch. Book a screen-share and we’ll walk through your device together.
              </div>
            </div>
            <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
              <a href="mailto:support@teeeveee.nl?subject=Help installing TeeeVEE" className="btn btn-primary">Book a setup call <Arrow /></a>
              <a href="setup.html" className="btn btn-ghost">Compare players</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
